import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { problemName, problemUrl, source, difficulty, dateSolved, notes } =
      body;

    const problem = await Problem.create({
      problemName,
      problemUrl,
      difficulty,
      source,
      notes,
      dateSolved,
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    const problems = await Problem.find().sort({ dateSolved: -1 }); // newest first
    // console.log(problems);

    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { message: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}
