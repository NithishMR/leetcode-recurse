import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = await Problem.countDocuments({
      nextReviewDate: { $lt: start },
    });

    return NextResponse.json({ overdue });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ overdue: 0 }, { status: 500 });
  }
}
