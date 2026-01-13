import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse, NextRequest } from "next/server";
import ActivityLog from "@/database/ActivityLog";
import { getToken } from "next-auth/jwt";
import User from "@/database/User";
// ==========================
// GET Problems for Auth User
// ==========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // Fetch problems only for this user
    const problems = await Problem.find({ userId })
      .sort({ dateSolved: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Problem.countDocuments({ userId });

    return NextResponse.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    const accessToken = token.accessToken;

    await connectDB();

    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Delete problem
    const deleted = await Problem.findOneAndDelete({ userId, _id });

    if (!deleted) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // 2️⃣ Delete calendar event (best-effort)
    if (deleted.calendarEventId && accessToken) {
      try {
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${deleted.calendarEventId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err) {
        console.error("Failed to delete calendar event", {
          problemId: deleted._id,
          calendarEventId: deleted.calendarEventId,
          err,
        });
      }
    }

    // 3️⃣ Activity log
    await ActivityLog.create({
      userId,
      type: "delete",
      problemId: deleted._id,
      problemName: deleted.problemName,
    });

    // 4️⃣ Trim logs
    const logsCount = await ActivityLog.countDocuments({ userId });
    if (logsCount > 20) {
      const deleteCount = logsCount - 20;

      const oldestLogs = await ActivityLog.find({ userId })
        .sort({ createdAt: 1 })
        .limit(deleteCount);

      await ActivityLog.deleteMany({
        _id: { $in: oldestLogs.map((l) => l._id) },
      });
    }

    return NextResponse.json(
      { message: "Problem deleted", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { error: "Failed to delete problem" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. AUTH
    // console.log("point 1");
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // console.log("JWT token:", token);

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // console.log("point 2");
    await connectDB();
    const userId = token.user.id;
    const accessToken = token.accessToken;
    // console.log("Access token", token.accessToken);
    if (!accessToken) {
      // console.log("access token error");
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 400 }
      );
    }
    // 2. READ BODY
    // console.log("point 3");
    const body = await req.json();
    const { problemName, problemUrl, source, difficulty, dateSolved, notes } =
      body;

    if (!dateSolved) {
      return NextResponse.json(
        { error: "dateSolved is required" },
        { status: 400 }
      );
    }
    // 3. NORMALIZE TO UTC MIDNIGHT
    const solvedDateUTC = toUTCMidnight(new Date(dateSolved));

    // 🔴 HARD-CODE: FORCE +1 DAY
    solvedDateUTC.setUTCDate(solvedDateUTC.getUTCDate() + 1);

    // 4. INITIAL SPACED REPETITION (+7 DAYS FROM FIXED DATE)
    const nextReviewDate = new Date(solvedDateUTC);
    nextReviewDate.setUTCDate(nextReviewDate.getUTCDate() + 7);

    // 4.5 creating calendar event
    // 5. CREATE PROBLEM
    // console.log("point 4");
    const problem = await Problem.create({
      userId,
      problemName,
      problemUrl,
      difficulty: difficulty.toLowerCase(),
      source,
      notes,
      dateSolved: solvedDateUTC,
      nextReviewDate,
      timesSolved: 1,
      status: "active",
    });
    // console.log(problem);
    // after creating problem , i will create calendar event
    // 6. CREATE CALENDAR EVENT (side-effect)
    // let calendarEventId: string | null = null;
    // console.log("point 5");
    const user = await User.findById(userId);
    if (user?.wantCalendarReminder) {
      try {
        const event = await createCalendarEvent({
          accessToken,
          title: `Anamnesis – Review: ${problemName}`,
          description: `Review problem: ${problemName}\n${problemUrl || ""}`,
          startTime: nextReviewDate.toISOString(),
          endTime: new Date(
            nextReviewDate.getTime() + 30 * 60 * 1000
          ).toISOString(),
        });

        problem.calendarEventId = event.id;
        await problem.save();
      } catch (err) {
        console.error("Calendar event failed", {
          userId,
          problemId: problem._id,
          err,
        });
      }
    }
    // 6. ACTIVITY LOG
    await ActivityLog.create({
      userId,
      type: "add",
      problemId: problem._id,
      problemName: problem.problemName,
    });

    // 7. TRIM LOGS (KEEP LAST 20)
    const logsCount = await ActivityLog.countDocuments({ userId });
    if (logsCount > 20) {
      const deleteCount = logsCount - 20;

      const oldestLogs = await ActivityLog.find({ userId })
        .sort({ createdAt: 1 })
        .limit(deleteCount);

      await ActivityLog.deleteMany({
        _id: { $in: oldestLogs.map((l) => l._id) },
      });
    }

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}

function toUTCMidnight(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
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
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Calendar event failed: " + err);
  }

  return res.json();
}
