// src/app/api/extension/add-problem/route.ts

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/database/connection";
import User from "@/database/User";
import Problem from "@/database/Problem";
import ActivityLog from "@/database/ActivityLog";
import extractDetailsfromURl from "@/utils/extractDetailsFromURL";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ==========================
    // Authenticate Extension
    // ==========================
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization token",
        },
        { status: 401 },
      );
    }

    const extensionToken = authHeader.replace("Bearer ", "");

    const user = await User.findOne({
      extensionToken,
    }).select("_id name email googleAccessToken wantCalendarReminder");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid extension token",
        },
        { status: 401 },
      );
    }

    // ==========================
    // Read Body
    // ==========================
    const body = await req.json();
    console.log("body", body);
    const { problemUrl, source } = body;

    if (!problemUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Temporary until difficulty extraction is implemented
    const difficulty = "easy";

    // ==========================
    // Duplicate Check
    // ==========================
    const existingProblem = await Problem.findOne({
      userId: user._id,
      problemUrl,
    });

    if (existingProblem) {
      return NextResponse.json(
        {
          success: false,
          error: "Problem already tracked",
        },
        { status: 409 },
      );
    }

    // ==========================
    // Date Calculation
    // ==========================
    const solvedDateUTC = toUTCMidnight(new Date());

    solvedDateUTC.setUTCDate(solvedDateUTC.getUTCDate() + 1);

    const nextReviewDate = new Date(solvedDateUTC);

    nextReviewDate.setUTCDate(nextReviewDate.getUTCDate() + 7);

    //get problem name
    const problemName = extractDetailsfromURl(problemUrl)?.titleSlug;
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
    console.log(problem);
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
        console.error("Calendar creation failed", err);
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
          $in: oldestLogs.map((l) => l._id),
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Problem added successfully",
        problem,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("POST /api/extension/add-problem error:", err);

    // Handles unique index race condition
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Problem already tracked",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

function toUTCMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

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

        // 🔔 THIS IS THE REMINDER PART
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 30 }, // in-app notification
            // { method: "email", minutes: 60 }, // email reminder
          ],
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
