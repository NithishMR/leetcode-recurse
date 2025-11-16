import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import ActivityLog from "@/database/ActivityLog";
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

    // Fetch latest 10 logs for THIS user only
    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}
