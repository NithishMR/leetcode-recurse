import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/database/connection";
import User from "@/database/User";
import Problem from "@/database/Problem";
import ActivityLog from "@/database/ActivityLog";
import extractDetailsfromURl from "@/utils/extractDetailsFromURL";

const EXTENSION_ORIGIN = "chrome-extension://lcbkdmehkcebgnehgllekpnnfaefenaj";

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin");

  const headers = new Headers();

  if (origin === EXTENSION_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", EXTENSION_ORIGIN);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.set("Access-Control-Max-Age", "86400");
    headers.set("Vary", "Origin");
  }

  return headers;
}

function jsonResponse(req: NextRequest, body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: getCorsHeaders(req),
  });
}

// ==========================
// Handle CORS Preflight
// ==========================
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

// ==========================
// Add Problem
// ==========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ==========================
    // Authenticate Extension
    // ==========================
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Missing authorization token",
        },
        401,
      );
    }

    const extensionToken = authHeader.replace("Bearer ", "");

    const user = await User.findOne({
      extensionToken,
    }).select("_id name email googleAccessToken wantCalendarReminder");

    if (!user) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Invalid extension token",
        },
        401,
      );
    }

    // ==========================
    // Read Body
    // ==========================
    const body = await req.json();

    console.log("Extension submission received:", {
      problemUrl: body.problemUrl,
      difficulty: body.difficulty,
      language: body.language,
    });

    const { problemUrl } = body;

    const difficulty = body.difficulty?.toLowerCase();

    if (!problemUrl || !difficulty) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Missing required fields",
        },
        400,
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Invalid problem difficulty",
        },
        400,
      );
    }

    // ==========================
    // Extract Problem Name
    // ==========================
    const problemName = extractDetailsfromURl(problemUrl)?.titleSlug;

    if (!problemName) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Could not extract problem name from URL",
        },
        400,
      );
    }

    // ==========================
    // Duplicate Check
    // ==========================
    const existingProblem = await Problem.findOne({
      userId: user._id,
      problemUrl,
    });

    if (existingProblem) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Problem already tracked",
        },
        409,
      );
    }

    // ==========================
    // Date Calculation
    // ==========================
    const solvedDateUTC = toUTCMidnight(new Date());

    solvedDateUTC.setUTCDate(solvedDateUTC.getUTCDate() + 1);

    const nextReviewDate = new Date(solvedDateUTC);

    nextReviewDate.setUTCDate(nextReviewDate.getUTCDate() + 7);

    // ==========================
    // Create Problem
    // ==========================
    const problem = await Problem.create({
      userId: user._id,
      problemName,
      problemUrl,
      difficulty,
      source: "leetcode.com",
      notes: "",
      dateSolved: solvedDateUTC,
      nextReviewDate,
      timesSolved: 1,
      status: "active",
    });

    // ==========================
    // Calendar Event
    // ==========================
    if (user.wantCalendarReminder && user.googleAccessToken) {
      try {
        const event = await createCalendarEvent({
          accessToken: user.googleAccessToken,
          title: `Anamnesis – Review: ${problemName}`,
          description: `Review problem: ${problemName}\n${problemUrl}`,
          startTime: nextReviewDate.toISOString(),
          endTime: new Date(
            nextReviewDate.getTime() + 30 * 60 * 1000,
          ).toISOString(),
        });

        problem.calendarEventId = event.id;
        await problem.save();
      } catch (err) {
        console.error("Calendar creation failed:", err);
      }
    }

    // ==========================
    // Activity Log
    // ==========================
    await ActivityLog.create({
      userId: user._id,
      type: "add",
      problemId: problem._id,
      problemName: problem.problemName,
    });

    // ==========================
    // Trim Logs
    // ==========================
    const logsCount = await ActivityLog.countDocuments({
      userId: user._id,
    });

    if (logsCount > 20) {
      const deleteCount = logsCount - 20;

      const oldestLogs = await ActivityLog.find({
        userId: user._id,
      })
        .sort({ createdAt: 1 })
        .limit(deleteCount);

      await ActivityLog.deleteMany({
        _id: {
          $in: oldestLogs.map((log) => log._id),
        },
      });
    }

    return jsonResponse(
      req,
      {
        success: true,
        message: "Problem added successfully",
        problem,
      },
      201,
    );
  } catch (err: any) {
    console.error("POST /api/extension/add-problem error:", err);

    if (err.code === 11000) {
      return jsonResponse(
        req,
        {
          success: false,
          error: "Problem already tracked",
        },
        409,
      );
    }

    return jsonResponse(
      req,
      {
        success: false,
        error: "Internal server error",
      },
      500,
    );
  }
}

// ==========================
// Date Helper
// ==========================
function toUTCMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

// ==========================
// Google Calendar Helper
// ==========================
async function createCalendarEvent({
  accessToken,
  title,
  description,
  startTime,
  endTime,
}: {
  accessToken: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}) {
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        description,
        start: {
          dateTime: startTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTime,
          timeZone: "Asia/Kolkata",
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 30 }],
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Calendar event failed: " + err);
  }

  return res.json();
}
