import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import ActivityLog from "@/database/ActivityLog";

export async function GET() {
  try {
    await connectDB();

    const logs = await ActivityLog.find().sort({ timestamp: -1 }); // get latest 10 actions

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}
