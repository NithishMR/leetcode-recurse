import { connectDB } from "@/database/connection";
import User from "@/database/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

    const user = await User.findById(token.user.id);

    return NextResponse.json({
      isGithubConnected: !!user?.githubAccessToken,
      hasRepo: !!user?.repoName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 },
    );
  }
}
