import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    await connectDB();

    const [easy, medium, hard] = await Promise.all([
      Problem.countDocuments({ userId, difficulty: "easy" }),
      Problem.countDocuments({ userId, difficulty: "medium" }),
      Problem.countDocuments({ userId, difficulty: "hard" }),
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
