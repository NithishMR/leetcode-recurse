import { NextRequest, NextResponse } from "next/server";
import extractDetailsfromURl from "@/utils/extractDetailsFromURL";

/**
 * In-memory cache (global for this server instance)
 */
type CachedProblem = {
  data: any;
  expiresAt: number;
};

const problemCache = new Map<string, CachedProblem>();

// 24 hours TTL
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const extracted = extractDetailsfromURl(url);

    if (!extracted) {
      return NextResponse.json(
        { error: "Unsupported or invalid URL" },
        { status: 400 }
      );
    }

    const cacheKey = `${extracted.platform}:${extracted.titleSlug}`;
    const now = Date.now();

    // 1️⃣ Check cache
    const cached = problemCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    // 2️⃣ Fetch from external API
    if (extracted.platform === "leetcode.com") {
      const res = await fetch(
        `https://alfa-leetcode-api.onrender.com/select?titleSlug=${extracted.titleSlug}`
      );

      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch from LeetCode" },
          { status: 502 }
        );
      }

      const data = await res.json();

      // Normalize response (VERY IMPORTANT)
      const normalized = {
        platform: extracted.platform,
        questionId: data.questionId,
        questionTitle: data.questionTitle,
        difficulty: data.difficulty,
      };

      // 3️⃣ Store in cache
      problemCache.set(cacheKey, {
        data: normalized,
        expiresAt: now + CACHE_TTL,
      });

      return NextResponse.json({
        ...normalized,
        cached: false,
      });
    }

    return NextResponse.json(
      { error: "Platform not supported yet" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
