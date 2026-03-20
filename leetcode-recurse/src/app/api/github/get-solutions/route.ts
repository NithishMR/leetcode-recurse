import { connectDB } from "@/database/connection";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/database/User";

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

    // ==========================
    // 2️⃣ DB + USER
    // ==========================
    await connectDB();

    const user = await User.findById(token.user.id);
    // console.log("user: ", user);
    if (!user?.githubAccessToken || !user?.githubUsername) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 },
      );
    }

    const { githubAccessToken, githubUsername } = user;
    const repoName = user.repoName || "anamnesis";

    // ==========================
    // 3️⃣ GET QUERY PARAM
    // ==========================
    const { searchParams } = new URL(req.url);
    const problemName = searchParams.get("problemName");
    // console.log(
    //   "searchParams:",
    //   searchParams,
    //   " githubaccesstoken :",
    //   githubAccessToken,
    // );
    if (!problemName) {
      return NextResponse.json(
        { error: "Missing problemName" },
        { status: 400 },
      );
    }

    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github+json",
    };

    const metadataPath = `leetcode/${problemName}/metadata.json`;

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
        const filePath = `leetcode/${problemName}/${item.file}`;

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
    // console.log("solutions: ", solutions);
    // remove nulls
    const validSolutions = solutions
      .filter(Boolean)
      .sort((a: any, b: any) => a.review - b.review);

    // ==========================
    // ✅ SUCCESS
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
