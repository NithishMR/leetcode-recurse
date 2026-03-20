import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

    // start of today
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // end of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // ==========================
    // 3️⃣ FETCH PROBLEMS
    // ==========================
    const problems = await Problem.find({
      userId,
      status: { $ne: "completed" },
      nextReviewDate: {
        $lte: endOfDay,
      },
    })
      .select("_id problemName source difficulty nextReviewDate")
      .sort({ nextReviewDate: 1 });

    // ==========================
    // 4️⃣ RESPONSE
    // ==========================
    return NextResponse.json({ reviews: problems }, { status: 200 });
  } catch (error) {
    console.error("Upcoming reviews error:", error);

    return NextResponse.json(
      { error: "Failed to fetch upcoming reviews" },
      { status: 500 },
    );
  }
}
