// src/app/api/extension/add-problem/route.ts

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/database/connection";
import User from "@/database/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authorization token",
        },
        { status: 401 },
      );
    }

    const extensionToken = authHeader.replace("Bearer ", "");

    const user = await User.findOne({
      extensionToken,
    }).select("_id name email");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid extension token",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      userId: user._id,
      userName: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("POST /api/extension/add-problem error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
