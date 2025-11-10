import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const reviews = await Problem.find(
      { nextReviewDate: { $gte: tomorrow, $lte: nextWeek } },
      { problemName: 1, source: 1, difficulty: 1, nextReviewDate: 1 }
    )
      .sort({ nextReviewDate: 1 })
      .limit(10); // when user presses the view all the upcoming reviews in a week
    // make a seperate route and just remove the limit

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching upcoming reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch upcoming reviews" },
      { status: 500 }
    );
  }
}
