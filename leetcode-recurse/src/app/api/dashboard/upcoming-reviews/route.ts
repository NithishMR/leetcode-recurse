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

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Only upcoming reviews for THIS user in the next 7 days
    const reviews = await Problem.find(
      {
        userId,
        nextReviewDate: { $gte: tomorrow, $lte: nextWeek },
      },
      {
        problemName: 1,
        source: 1,
        difficulty: 1,
        nextReviewDate: 1,
      }
    )
      .sort({ nextReviewDate: 1 })
      .limit(10);

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching upcoming reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch upcoming reviews" },
      { status: 500 }
    );
  }
}
