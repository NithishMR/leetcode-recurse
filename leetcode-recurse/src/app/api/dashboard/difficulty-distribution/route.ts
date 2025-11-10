import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const [easy, medium, hard] = await Promise.all([
      Problem.countDocuments({ difficulty: "easy" }),
      Problem.countDocuments({ difficulty: "medium" }),
      Problem.countDocuments({ difficulty: "hard" }),
    ]);

    return NextResponse.json({
      easy,
      medium,
      hard,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ easy: 0, medium: 0, hard: 0 }, { status: 500 });
  }
}
