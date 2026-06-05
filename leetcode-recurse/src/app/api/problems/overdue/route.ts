import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const overdueReviews = await Problem.find(
      {
        userId,
        nextReviewDate: {
          $lt: startOfToday,
        },
        status: { $ne: "completed" },
      },
      {
        problemName: 1,
        source: 1,
        difficulty: 1,
        nextReviewDate: 1,
      },
    ).sort({ nextReviewDate: 1 }); // oldest missed first

    const reviews = overdueReviews.map((problem) => {
      const daysOverdue = Math.floor(
        (startOfToday.getTime() - new Date(problem.nextReviewDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        ...problem.toObject(),
        daysOverdue,
      };
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching overdue reviews:", error);

    return NextResponse.json(
      { message: "Failed to fetch overdue reviews" },
      { status: 500 },
    );
  }
}
