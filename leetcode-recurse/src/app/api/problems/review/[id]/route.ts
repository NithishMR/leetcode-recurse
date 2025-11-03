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
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    problem.timesSolved = (problem.timesSolved || 0) + 1;

    const daysToAdd = getSpacing(problem.timesSolved);
    // const daysToAdd = 7;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);

    problem.nextReviewDate = newDate;
    await problem.save();
    console.log(problem);
    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

function getSpacing(times: number) {
  const schedule = [7, 14, 30, 60];
  return schedule[Math.min(times - 1, schedule.length - 1)];
}
