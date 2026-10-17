// src/app/api/user/extension-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";

import { connectDB } from "@/database/connection";
import User from "@/database/User";

// ==========================
// GET: Fetch extension token
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

    const user = await User.findById(token.user.id).select("extensionToken");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      extensionToken: user.extensionToken ?? null,
    });
  } catch (err) {
    console.error("GET /api/user/extension-token error:", err);

    return NextResponse.json(
      { error: "Failed to fetch extension token" },
      { status: 500 },
    );
  }
}

// =====================================
// POST: Generate / Regenerate token
// =====================================
export async function POST(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(token.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 64-char hex token (system decieded that it is enough entropy ;)
    const extensionToken = crypto.randomBytes(32).toString("hex");

    user.extensionToken = extensionToken;

    await user.save();

    return NextResponse.json({
      success: true,
      extensionToken,
    });
  } catch (err) {
    console.error("POST /api/user/extension-token error:", err);

    return NextResponse.json(
      { error: "Failed to generate extension token" },
      { status: 500 },
    );
  }
}
