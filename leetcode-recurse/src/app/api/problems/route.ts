import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";
import ActivityLog from "@/database/ActivityLog";
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      problemName,
      problemUrl,
      source,
      difficulty,
      dateSolved,
      notes,
      nextReviewDate,
    } = body;

    const problem = await Problem.create({
      problemName,
      problemUrl,
      difficulty: difficulty.toLowerCase(),
      source,
      notes,
      dateSolved,
      nextReviewDate,
    });
    await ActivityLog.create({
      type: "add",
      problemId: problem._id,
      problemName: problem.problemName,
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

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const problems = await Problem.find()
      .sort({ dateSolved: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Problem.countDocuments();

    return NextResponse.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Problem.findByIdAndDelete(_id);
    await ActivityLog.create({
      type: "delete",
      problemId: deleted._id,
      problemName: deleted.problemName,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
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
