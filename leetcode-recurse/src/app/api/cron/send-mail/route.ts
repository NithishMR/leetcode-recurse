import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import User from "@/database/User";
import { sendEmailSummary } from "@/utils/email";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    // const startOfDayUTC = new Date(
    //   Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    // );
    // const endOfDayUTC = new Date(
    //   Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    // );
    // const startOfDayUTC = new Date(now);
    // startOfDayUTC.setUTCHours(0, 0, 0, 0);

    // const endOfDayUTC = new Date(now);
    // endOfDayUTC.setUTCHours(23, 59, 59, 999);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // logs
    // console.log("startOfDayUTC:", startOfDayUTC.toISOString());
    // console.log("endOfDayUTC:", endOfDayUTC.toISOString());

    // 1) Get all problems due today
    // const problemsDueToday = await Problem.find({
    //   nextReviewDate: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    // });
    const problemsDueToday = await Problem.find({
      nextReviewDate: { $gte: startOfDay, $lt: endOfDay },
    });

    if (problemsDueToday.length === 0) {
      return NextResponse.json({ message: "No problems due today" });
    }

    // 2) Exclude problems already mailed today
    const pendingForEmail = problemsDueToday.filter(
      (p) => !p.lastEmailSentDate || p.lastEmailSentDate < startOfDay
    );

    if (pendingForEmail.length === 0) {
      return NextResponse.json({
        message: "All problems already emailed today",
      });
    }

    // 3) Group by user
    const problemsByUser = pendingForEmail.reduce((map, p) => {
      const uid = (p.userId as mongoose.Types.ObjectId).toString();
      if (!map.has(uid)) map.set(uid, []);
      map.get(uid)!.push(p);
      return map;
    }, new Map<string, typeof pendingForEmail>());

    // 4) Fetch user emails only once
    const userIds = [...problemsByUser.keys()];
    const users = await User.find(
      { _id: { $in: userIds } },
      { email: 1, name: 1 }
    );

    const userEmailMap = new Map(
      users.map((u) => [
        u._id.toString(),
        { email: u.email, name: u.name || "" },
      ])
    );

    // 5) Send email to each user with their due problems
    for (const [uid, userProblems] of problemsByUser.entries()) {
      const user = userEmailMap.get(uid);
      if (!user?.email) continue;

      await sendEmailSummary({
        to: user.email,
        problems: userProblems.map((p: any) => ({
          problemName: p.problemName,
          problemUrl: p.problemUrl,
          difficulty: p.difficulty,
          source: p.source,
        })),
      });

      // Update each problem's email timestamp
      await Problem.updateMany(
        { _id: { $in: userProblems.map((p: any) => p._id) } },
        { $set: { lastEmailSentDate: now } }
      );
    }

    return NextResponse.json({ message: "Email summaries sent successfully" });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
