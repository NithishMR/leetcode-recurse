import { connectDB } from "@/database/connection";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/database/User";

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

    if (!user?.githubAccessToken || !user?.githubUsername) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 },
      );
    }

    const { githubAccessToken, githubUsername } = user;

    const repoName = "anamnesis";

    // ==========================
    // 2️⃣ CHECK IF REPO EXISTS
    // ==========================
    const checkRepo = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}`,
      {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      },
    );

    if (checkRepo.ok) {
      console.log("Repo already exists");

      user.repoName = repoName;
      await user.save();

      return NextResponse.json(
        { message: "Repo already exists" },
        { status: 200 },
      );
    }

    // ==========================
    // 3️⃣ CREATE REPO
    // ==========================
    const createRepo = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        private: false,
        description: "Anamnesis LeetCode solutions",
      }),
    });

    if (!createRepo.ok) {
      const err = await createRepo.json();
      console.error("Repo creation failed:", err);

      return NextResponse.json(
        { error: "Failed to create repo" },
        { status: 500 },
      );
    }

    // ==========================
    // 4️⃣ SAVE REPO NAME
    // ==========================
    user.repoName = repoName;
    await user.save();

    console.log("Repo created successfully");

    return NextResponse.json(
      { message: "Repo created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Init repo error:", error);

    return NextResponse.json(
      { error: "Failed to initialize repo" },
      { status: 500 },
    );
  }
}
