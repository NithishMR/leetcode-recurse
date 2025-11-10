import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const reviewedToday = await Problem.countDocuments({
      updatedAt: { $gte: start, $lt: end },
    });
    console.log(reviewedToday);
    return NextResponse.json({ reviewedToday });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reviewedToday: 0 }, { status: 500 });
  }
}
