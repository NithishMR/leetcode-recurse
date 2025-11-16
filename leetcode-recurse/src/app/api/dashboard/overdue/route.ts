import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = await Problem.countDocuments({
      userId,
      nextReviewDate: { $lt: start, $ne: null }, // <-- fix added
    });

    return NextResponse.json({ overdue });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ overdue: 0 }, { status: 500 });
  }
}
