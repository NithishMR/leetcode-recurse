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

    // ✅ UTC day boundaries (CRITICAL FIX)
    const startOfDayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
    );

    const endOfDayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );

    // 1️⃣ Get problems due today (UTC-safe)
    const problemsDueToday = await Problem.find({
      nextReviewDate: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    });
    console.log(problemsDueToday);
    if (problemsDueToday.length === 0) {
      return NextResponse.json({ message: "No problems due today" });
    }

    // 2️⃣ Exclude problems already emailed today
    const pendingForEmail = problemsDueToday.filter(
      (p) => !p.lastEmailSentDate || p.lastEmailSentDate < startOfDayUTC
    );

    if (pendingForEmail.length === 0) {
      return NextResponse.json({
        message: "All problems already emailed today",
      });
    }

    // 3️⃣ Group by user
    const problemsByUser = pendingForEmail.reduce((map, p) => {
      const uid = (p.userId as mongoose.Types.ObjectId).toString();
      if (!map.has(uid)) map.set(uid, []);
      map.get(uid)!.push(p);
      return map;
    }, new Map<string, typeof pendingForEmail>());

    // 4️⃣ Fetch user emails
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

    // 5️⃣ Send emails
    for (const [uid, userProblems] of problemsByUser.entries()) {
      const user = userEmailMap.get(uid);
      if (!user?.email) continue;

      try {
        await sendEmailSummary({
          to: user.email,
          problems: userProblems.map((p: any) => ({
            _id: p._id,
            problemName: p.problemName,
            problemUrl: p.problemUrl,
            difficulty: p.difficulty,
            source: p.source,
          })),
        });
      } catch (e) {
        console.error("Email failed for user:", user.email, e);
        continue;
      }

      // 6️⃣ Update email sent date (store actual timestamp)
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
