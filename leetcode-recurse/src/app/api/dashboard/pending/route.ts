import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const pendingToday = await Problem.countDocuments({
      nextReviewDate: { $gte: start, $lt: end },
    });

    return NextResponse.json({ pendingToday });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ pendingToday: 0 }, { status: 500 });
  }
}
