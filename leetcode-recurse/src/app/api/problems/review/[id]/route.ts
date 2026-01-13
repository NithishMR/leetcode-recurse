import ActivityLog from "@/database/ActivityLog";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import User from "@/database/User";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. AUTH CHECK
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    // 2. Extract ID from URL params (NOT req.json)
    const { id } = await params;
    const _id = id;

    if (!_id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }
    // get access token
    const accessToken = token.accessToken;

    await connectDB();

    // 3. FIND PROBLEM FOR THIS USER ONLY
    const problem = await Problem.findOne({ _id, userId });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found or unauthorized" },
        { status: 404 }
      );
    }
    //4.0
    if (problem.timesSolved >= 4) {
      problem.status = "completed";
      problem.nextReviewDate = null;

      if (problem.calendarEventId && accessToken) {
        try {
          await deleteCalendarEvent({
            accessToken,
            calendarEventId: problem.calendarEventId,
          });
          problem.calendarEventId = null;
        } catch (err) {
          console.error("Failed to delete calendar event on completion", err);
        }
      }

      await problem.save();
      return NextResponse.json(problem, { status: 200 });
    }

    // 4. LOG REVIEW
    await ActivityLog.create({
      userId,
      type: "review",
      problemId: problem._id,
      problemName: problem.problemName,
    });
    const logsCount = await ActivityLog.countDocuments({ userId });

    if (logsCount > 20) {
      const deleteCount = logsCount - 20;

      const oldestLogs = await ActivityLog.find({ userId })
        .sort({ createdAt: 1 })
        .limit(deleteCount);

      const idsToDelete = oldestLogs.map((l) => l._id);

      await ActivityLog.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 5. INCREMENT TIMES SOLVED
    problem.timesSolved = (problem.timesSolved || 0) + 1;

    // 6. UPDATE LAST SOLVED DATE
    const today = new Date();
    problem.dateSolved = today;

    // 7. SPACED REPETITION NEXT REVIEW DATE
    const daysToAdd = getSpacing(problem.timesSolved);
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysToAdd);

    problem.nextReviewDate = nextDate;
    const user = await User.findById(userId);

    if (user?.wantCalendarReminder && problem.calendarEventId && accessToken) {
      try {
        await updateCalendarEvent({
          accessToken,
          calendarEventId: problem.calendarEventId,
          title: `Anamnesis – Review: ${problem.problemName}`,
          description: `Review problem: ${problem.problemName}\n${
            problem.problemUrl || ""
          }`,
          startTime: nextDate.toISOString(),
          endTime: new Date(nextDate.getTime() + 30 * 60 * 1000).toISOString(),
        });
      } catch (err) {
        console.error("Failed to update calendar event", err);
      }
    }

    // 8. SAVE
    await problem.save();

    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Spaced repetition intervals
function getSpacing(times: number) {
  const schedule = [7, 14, 30, 60];
  return schedule[Math.min(times - 1, schedule.length - 1)];
}

async function updateCalendarEvent({
  accessToken,
  calendarEventId,
  title,
  description,
  startTime,
  endTime,
}: {
  accessToken: string;
  calendarEventId: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}) {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarEventId}`,
    {
      method: "PUT",
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
          overrides: [
            { method: "popup", minutes: 30 },
            { method: "email", minutes: 60 },
          ],
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Calendar update failed: " + err);
  }

  return res.json();
}
async function deleteCalendarEvent({
  accessToken,
  calendarEventId,
}: {
  accessToken: string;
  calendarEventId: string;
}) {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${calendarEventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Google returns 204 No Content on success
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error("Calendar delete failed: " + err);
  }

  return true;
}
