import ActivityLog from "@/database/ActivityLog";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
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
