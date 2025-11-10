import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const problemCount = await Problem.countDocuments({});
    console.log("ProblemCount:", problemCount);
    return NextResponse.json({ problemCount: problemCount }, { status: 200 });
  } catch (error) {
    NextResponse.json({ reviewedToday: 0 }, { status: 500 });
  }
}
