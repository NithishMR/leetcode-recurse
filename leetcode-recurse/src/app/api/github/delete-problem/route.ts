import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// 🔥 helper (move later to utils/github.ts)
function sanitizeProblemName(problemName: string) {
  return problemName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getProblemFolder(userId: string, problemName: string) {
  const safeName = sanitizeProblemName(problemName);
  return `data/${userId}/leetcode/${safeName}`;
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

    const userId = token.user.id;

    // ==========================
    // 2️⃣ BODY
    // ==========================
    const { problemName } = await req.json();

    if (!problemName) {
      return NextResponse.json(
        { error: "Problem name is required" },
        { status: 400 },
      );
    }

    // ==========================
    // 3️⃣ ENV (CENTRAL GITHUB)
    // ==========================
    const githubAccessToken = process.env.GITHUB_PAT!;
    const githubUsername = process.env.GITHUB_OWNER!;
    const repoName = process.env.GITHUB_REPO!;

    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };

    // ==========================
    // 4️⃣ BUILD FOLDER PATH
    // ==========================
    const folderPath = getProblemFolder(userId, problemName);

    // ==========================
    // 5️⃣ LIST FILES
    // ==========================
    const contentsRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${folderPath}`,
      { headers },
    );

    if (contentsRes.status === 404) {
      return NextResponse.json(
        { message: "Folder not found, nothing to delete" },
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
        { message: "No files found in folder" },
        { status: 200 },
      );
    }

    // ==========================
    // 6️⃣ DELETE FILES
    // ==========================
    for (const file of files) {
      const deleteRes = await fetch(
        `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${file.path}`,
        {
          method: "DELETE",
          headers,
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
          { error: `Failed to delete ${file.name}` },
          { status: 500 },
        );
      }
    }

    // ==========================
    //  SUCCESS
    // ==========================
    return NextResponse.json(
      { message: "Problem folder deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete route error:", error);

    return NextResponse.json(
      { error: "Failed to delete problem folder" },
      { status: 500 },
    );
  }
}
