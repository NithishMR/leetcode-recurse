import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

//  Update a particular problem
export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, problemName, problemUrl, difficulty, source, notes } = body;

    // ✅ Check if ID exists
    if (!id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    // Find and update problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        problemName,
        problemUrl,
        difficulty,
        source,
        notes,
      },
      { new: true } // return updated document
    );

    // ✅ If no document found
    if (!updatedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProblem, { status: 200 });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Failed to update problem" },
      { status: 500 }
    );
  }
}
