import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { NextResponse, NextRequest } from "next/server";
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

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today 00:00
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // tomorrow 00:00

    const reviewedToday = await Problem.countDocuments({
      userId,
      dateSolved: { $gte: start, $lt: end }, // <-- ACCURATE FILTER
    });

    return NextResponse.json({ reviewedToday }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reviewedToday: 0 }, { status: 500 });
  }
}
