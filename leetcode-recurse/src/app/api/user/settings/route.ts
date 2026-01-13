import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/database/connection";
import User from "@/database/User";

// ==========================
// GET: Fetch user settings
// ==========================
export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(token.user.id).select(
      "wantEmailReminder wantCalendarReminder"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      wantEmailReminder: !!user.wantEmailReminder,
      wantCalendarReminder: !!user.wantCalendarReminder,
    });
  } catch (err) {
    console.error("GET /api/user/settings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ==========================
// PATCH: Update user settings
// ==========================
export async function PATCH(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const update: any = {};

    // Only update fields that are present in request body
    if (typeof body.wantEmailReminder === "boolean") {
      update.wantEmailReminder = body.wantEmailReminder;
    }

    if (typeof body.wantCalendarReminder === "boolean") {
      update.wantCalendarReminder = body.wantCalendarReminder;
    }

    // If nothing valid was sent
    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid settings provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(token.user.id, update, {
      new: true,
    }).select("wantEmailReminder wantCalendarReminder");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Settings updated",
      wantEmailReminder: !!user.wantEmailReminder,
      wantCalendarReminder: !!user.wantCalendarReminder,
    });
  } catch (err) {
    console.error("PATCH /api/user/settings error:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
