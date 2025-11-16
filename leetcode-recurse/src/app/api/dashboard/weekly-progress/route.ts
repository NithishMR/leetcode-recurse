import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    const uid = new mongoose.Types.ObjectId(userId); // <-- FIX

    // -----------------------------
    // 1️⃣ Aggregate SOLVED per week
    // -----------------------------
    const solvedData = await Problem.aggregate([
      { $match: { userId: uid, dateSolved: { $ne: null } } },
      {
        $addFields: {
          week: { $isoWeek: "$dateSolved" },
          year: { $isoWeekYear: "$dateSolved" },
        },
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          solved: { $sum: 1 },
        },
      },
    ]);

    // -----------------------------
    // 2️⃣ Aggregate PENDING per week
    // -----------------------------
    const pendingData = await Problem.aggregate([
      { $match: { userId: uid, nextReviewDate: { $ne: null } } },
      {
        $addFields: {
          week: { $isoWeek: "$nextReviewDate" },
          year: { $isoWeekYear: "$nextReviewDate" },
        },
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          pending: { $sum: 1 },
        },
      },
    ]);

    // -----------------------------
    // 3️⃣ Merge both results
    // -----------------------------
    const combinedMap = new Map();

    for (const entry of solvedData) {
      if (entry._id.year == null || entry._id.week == null) continue;
      const key = `${entry._id.year}-W${entry._id.week}`;
      combinedMap.set(key, {
        weekLabel: key,
        solved: entry.solved,
        pending: 0,
      });
    }

    for (const entry of pendingData) {
      if (entry._id.year == null || entry._id.week == null) continue;
      const key = `${entry._id.year}-W${entry._id.week}`;
      if (combinedMap.has(key)) {
        combinedMap.get(key)!.pending = entry.pending;
      } else {
        combinedMap.set(key, {
          weekLabel: key,
          solved: 0,
          pending: entry.pending,
        });
      }
    }

    const combinedData = Array.from(combinedMap.values()).sort((a, b) =>
      a.weekLabel > b.weekLabel ? 1 : -1
    );

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error("Error in weekly progress aggregation:", error);
    return NextResponse.json(
      { error: "Failed to aggregate weekly data" },
      { status: 500 }
    );
  }
}
