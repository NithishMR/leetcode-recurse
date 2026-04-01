import { connectDB } from "@/database/connection";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// 🔥 helper (you can move this later to utils/github.ts)
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
    const { problemName, reviewCount, code, language } = await req.json();

    if (!problemName || !reviewCount || !code || !language) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ==========================
    // 3️⃣ ENV (CENTRAL GITHUB)
    // ==========================
    const githubAccessToken = process.env.GITHUB_PAT!;
    const githubUsername = process.env.GITHUB_OWNER!;
    const repoName = process.env.GITHUB_REPO!;

    // ==========================
    // 4️⃣ FILE PREP
    // ==========================
    const extensionMap: Record<string, string> = {
      java: "java",
      python: "py",
      cpp: "cpp",
      javascript: "js",
      typescript: "ts",
      csharp: "cs",
      go: "go",
      rust: "rs",
      kotlin: "kt",
      swift: "swift",
    };

    const extension = extensionMap[language] || "txt";

    const safeProblemName = sanitizeProblemName(problemName);

    const fileName = `${safeProblemName}_review${reviewCount}.${extension}`;

    // 🔥 NEW PATH (WITH USERID)
    const baseFolder = getProblemFolder(userId, problemName);

    const solutionPath = `${baseFolder}/${fileName}`;
    const metadataPath = `${baseFolder}/metadata.json`;

    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };

    // ==========================
    // 5️⃣ PUSH SOLUTION
    // ==========================
    const encodedCode = Buffer.from(code).toString("base64");

    let existingSolutionSha = null;

    const existingFileRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${solutionPath}`,
      { headers },
    );

    if (existingFileRes.ok) {
      const existingData = await existingFileRes.json();
      existingSolutionSha = existingData.sha;
    }

    const solutionRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${solutionPath}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Add solution for ${problemName} review ${reviewCount}`,
          content: encodedCode,
          ...(existingSolutionSha && { sha: existingSolutionSha }),
        }),
      },
    );

    const solutionData = await solutionRes.json();

    if (!solutionRes.ok) {
      console.error("Solution push failed:", solutionData);
      return NextResponse.json(
        { error: "Failed to push solution", details: solutionData },
        { status: 500 },
      );
    }

    // ==========================
    // 6️⃣ METADATA
    // ==========================
    let metadata: any[] = [];
    let metadataSha = null;

    const metadataRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${metadataPath}`,
      { headers },
    );

    if (metadataRes.ok) {
      const existing = await metadataRes.json();

      metadata = JSON.parse(Buffer.from(existing.content, "base64").toString());

      metadataSha = existing.sha;
    }

    metadata.push({
      review: reviewCount,
      file: fileName,
      language,
      createdAt: new Date().toISOString(),
    });

    const encodedMetadata = Buffer.from(
      JSON.stringify(metadata, null, 2),
    ).toString("base64");

    const metadataPushRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${metadataPath}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Update metadata for ${problemName}`,
          content: encodedMetadata,
          ...(metadataSha && { sha: metadataSha }),
        }),
      },
    );

    const metadataData = await metadataPushRes.json();

    if (!metadataPushRes.ok) {
      console.error("Metadata push failed:", metadataData);
      return NextResponse.json(
        { error: "Metadata update failed", details: metadataData },
        { status: 500 },
      );
    }

    // ==========================
    // ✅ SUCCESS
    // ==========================
    return NextResponse.json(
      { message: "Solution pushed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Push route error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
