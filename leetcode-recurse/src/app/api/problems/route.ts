import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse, NextRequest } from "next/server";
import ActivityLog from "@/database/ActivityLog";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = token.user.id;

    // Read body
    const body = await req.json();
    const {
      problemName,
      problemUrl,
      source,
      difficulty,
      dateSolved,
      notes,
      nextReviewDate,
    } = body;

    // Create the problem
    const problem = await Problem.create({
      userId, // <-- important!
      problemName,
      problemUrl,
      difficulty: difficulty.toLowerCase(),
      source,
      notes,
      dateSolved,
      nextReviewDate,
    });

    await ActivityLog.create({
      userId,
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

    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    await connectDB();

    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Problem.findOneAndDelete({ userId, _id });
    await ActivityLog.create({
      userId,
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
