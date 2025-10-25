import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { problemName, problemUrl, source, difficulty, dateSolved, notes } =
      body;

    // Create a new problem document
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
