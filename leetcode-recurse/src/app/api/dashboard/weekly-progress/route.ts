import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";

export async function GET() {
  try {
    await connectDB();

    // 1Aggregate solved counts
    const solvedData = await Problem.aggregate([
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

    // 2Aggregate pending counts
    const pendingData = await Problem.aggregate([
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

    //  Merge both arrays into one combined structure
    const combinedMap = new Map();

    for (const entry of solvedData) {
      if (entry._id.year == null || entry._id.week == null) {
        continue;
      }
      const key = `${entry._id.year}-W${entry._id.week}`;
      combinedMap.set(key, {
        weekLabel: key,
        solved: entry.solved,
        pending: 0,
      });
    }

    for (const entry of pendingData) {
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
