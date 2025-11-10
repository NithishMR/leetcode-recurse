import ActivityLog from "@/database/ActivityLog";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";
export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { params } = context;
    const id = (await params).id;
    console.log("ID from route:", id);

    const problem = await Problem.findById(id);
    await ActivityLog.create({
      type: "review",
      problemId: problem._id,
      problemName: problem.problemName,
    });

    //  2. Increment timesSolved
    problem.timesSolved = (problem.timesSolved || 0) + 1;

    //  3. Set 'dateSolved' to today (new review date)
    const today = new Date();
    problem.dateSolved = today;

    //  4. Set nextReviewDate based on spaced repetition schedule
    const daysToAdd = getSpacing(problem.timesSolved);
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysToAdd);

    problem.nextReviewDate = nextDate;

    //  Save the updated problem
    await problem.save();

    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Spaced repetition schedule
function getSpacing(times: number) {
  const schedule = [7, 14, 30, 60];
  return schedule[Math.min(times - 1, schedule.length - 1)];
}
