import { connectDB } from "@/database/connection";
import User from "@/database/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function sanitizeProblemName(problemName: string) {
  return problemName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    // ==========================
    // 1️⃣ AUTH
    // ==========================
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemName } = await req.json();

    if (!problemName) {
      return NextResponse.json(
        { error: "Problem name is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(token.user.id);

    if (!user?.githubAccessToken || !user?.githubUsername || !user?.repoName) {
      return NextResponse.json(
        { error: "GitHub not connected or repo not initialized" },
        { status: 400 },
      );
    }

    const { githubAccessToken, githubUsername, repoName } = user;

    // ==========================
    // 2️⃣ BUILD FOLDER PATH
    // ==========================
    const safeProblemName = sanitizeProblemName(problemName);
    const folderPath = `leetcode/${safeProblemName}`;

    // ==========================
    // 3️⃣ LIST FILES IN FOLDER
    // ==========================
    const contentsRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${folderPath}`,
      {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (contentsRes.status === 404) {
      return NextResponse.json(
        { message: "GitHub folder not found, nothing to delete" },
        { status: 200 },
      );
    }

    if (!contentsRes.ok) {
      const err = await contentsRes.text();
      console.error("Failed to fetch folder contents:", err);

      return NextResponse.json(
        { error: "Failed to fetch GitHub folder contents" },
        { status: 500 },
      );
    }

    const files = await contentsRes.json();

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { message: "No files found in GitHub folder" },
        { status: 200 },
      );
    }

    // ==========================
    // 4️⃣ DELETE FILES ONE BY ONE
    // ==========================
    for (const file of files) {
      const deleteRes = await fetch(
        `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${file.path}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Delete ${file.name} for problem ${problemName}`,
            sha: file.sha,
          }),
        },
      );

      if (!deleteRes.ok) {
        const err = await deleteRes.text();
        console.error(`Failed to delete file ${file.path}:`, err);

        return NextResponse.json(
          { error: `Failed to delete file ${file.name} from GitHub` },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { message: "Problem folder deleted from GitHub successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("GitHub delete problem error:", error);

    return NextResponse.json(
      { error: "Failed to delete problem from GitHub" },
      { status: 500 },
    );
  }
}
