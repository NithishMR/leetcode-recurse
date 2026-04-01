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

export async function GET(req: NextRequest) {
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
    // 2️⃣ ENV (CENTRAL GITHUB)
    // ==========================
    const githubAccessToken = process.env.GITHUB_PAT!;
    const githubUsername = process.env.GITHUB_OWNER!;
    const repoName = process.env.GITHUB_REPO!;

    // ==========================
    // 3️⃣ GET QUERY PARAM
    // ==========================
    const { searchParams } = new URL(req.url);
    const rawProblemName = searchParams.get("problemName");

    if (!rawProblemName) {
      return NextResponse.json(
        { error: "Missing problemName" },
        { status: 400 },
      );
    }

    const safeProblemName = sanitizeProblemName(rawProblemName);
    const baseFolder = getProblemFolder(userId, safeProblemName);
    const metadataPath = `${baseFolder}/metadata.json`;

    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github+json",
    };

    // ==========================
    // 4️⃣ FETCH METADATA
    // ==========================
    const metadataRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${metadataPath}`,
      { headers },
    );

    if (!metadataRes.ok) {
      // no metadata = no solutions
      return NextResponse.json([], { status: 200 });
    }

    const metadataData = await metadataRes.json();

    const metadata = JSON.parse(
      Buffer.from(metadataData.content, "base64").toString(),
    );

    // ==========================
    // 5️⃣ FETCH ALL SOLUTIONS
    // ==========================
    const solutions = await Promise.all(
      metadata.map(async (item: any) => {
        const filePath = `${baseFolder}/${item.file}`;

        const fileRes = await fetch(
          `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`,
          { headers },
        );

        if (!fileRes.ok) {
          return null;
        }

        const fileData = await fileRes.json();
        const decodedCode = Buffer.from(fileData.content, "base64").toString();

        return {
          review: item.review,
          file: item.file,
          language: item.language,
          createdAt: item.createdAt,
          code: decodedCode,
        };
      }),
    );

    const validSolutions = solutions
      .filter(Boolean)
      .sort((a: any, b: any) => a.review - b.review);

    // ==========================
    // SUCCESS
    // ==========================
    return NextResponse.json(validSolutions, { status: 200 });
  } catch (error) {
    console.error("Get solutions error:", error);

    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 },
    );
  }
}
