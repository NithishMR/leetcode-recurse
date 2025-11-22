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

    // Normalize to start of day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfNextWeek = new Date(startOfToday);
    startOfNextWeek.setDate(startOfToday.getDate() + 7);

    // ⛳ FIX HERE → include today:
    const reviews = await Problem.find(
      {
        userId,
        nextReviewDate: {
          $gte: startOfToday, // include TODAY
          $lt: startOfNextWeek, // include next 7 days
        },
        status: { $ne: "completed" },
      },
      {
        problemName: 1,
        source: 1,
        difficulty: 1,
        nextReviewDate: 1,
      }
    ).sort({ nextReviewDate: 1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching upcoming reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch upcoming reviews" },
      { status: 500 }
    );
  }
}
