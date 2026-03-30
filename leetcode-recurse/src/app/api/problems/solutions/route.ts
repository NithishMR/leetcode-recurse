import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function getReviewStage(timesSolved: number) {
  if (timesSolved === 0) return "Initial Solve";
  return `Review ${timesSolved}`;
}

export async function GET(req: NextRequest) {
  try {
    // ==========================
    // 1️⃣ AUTH
    // ==========================
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    await connectDB();

    // ==========================
    // 2️⃣ TODAY RANGE
    // ==========================
    const today = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ==========================
    // 3️⃣ FETCH DUE PROBLEMS
    // ==========================
    const problems = await Problem.find({
      userId,
      status: { $ne: "completed" },
      nextReviewDate: { $lte: endOfDay },
      timesSolved: { $lt: 4 }, // extra safety
    })
      .select("_id problemName source difficulty nextReviewDate timesSolved")
      .sort({ nextReviewDate: 1 });
    // console.log("problems:", problems);
    // ==========================
    // 4ADD REVIEW STAGE
    // ==========================
    const formattedProblems = problems.map((problem) => ({
      _id: problem._id,
      problemName: problem.problemName,
      source: problem.source,
      difficulty: problem.difficulty,
      nextReviewDate: problem.nextReviewDate,
      timesSolved: problem.timesSolved,
      reviewStage: getReviewStage(problem.timesSolved),
    }));

    // ==========================
    // 5️⃣ RESPONSE
    // ==========================
    return NextResponse.json({ reviews: formattedProblems }, { status: 200 });
  } catch (error) {
    console.error("Upcoming reviews error:", error);

    return NextResponse.json(
      { error: "Failed to fetch upcoming reviews" },
      { status: 500 },
    );
  }
}
