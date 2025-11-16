import cron from "node-cron";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import User from "@/database/User";
import { sendEmailSummary } from "./email";
import mongoose from "mongoose";

cron.schedule("*/10 * * * * *", async () => {
  console.log("schedulin");
  try {
    await connectDB();
    console.log("Cron job running...");

    const now = new Date();

    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    const endOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
        0
      )
    );

    // 1) Find all problems due today (for all users)
    const problemsDueToday = await Problem.find({
      nextReviewDate: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    });

    console.log("Problems due today:", problemsDueToday.length);

    if (problemsDueToday.length === 0) return;

    // 2) Filter out problems already mailed today
    const pendingForEmail = problemsDueToday.filter(
      (p) => !p.lastEmailSentDate || p.lastEmailSentDate < startOfDayUTC
    );

    if (pendingForEmail.length === 0) {
      console.log("All problems already mailed today.");
      return;
    }

    // 3) Group problems by userId
    const problemsByUser = new Map<string, typeof pendingForEmail>();

    for (const p of pendingForEmail) {
      const uid = (p.userId as mongoose.Types.ObjectId).toString();
      if (!problemsByUser.has(uid)) {
        problemsByUser.set(uid, []);
      }
      problemsByUser.get(uid)!.push(p);
    }

    // 4) Fetch all users involved (to get their emails)
    const userIds = Array.from(problemsByUser.keys());
    const users = await User.find(
      { _id: { $in: userIds } },
      { email: 1, name: 1 }
    );

    const userMap = new Map<string, { email: string; name?: string }>();
    for (const u of users) {
      userMap.set(u._id.toString(), { email: u.email, name: u.name });
    }

    // 5) For each user, send a summary email with THEIR problems only
    for (const [uid, userProblems] of problemsByUser.entries()) {
      const userInfo = userMap.get(uid);
      if (!userInfo?.email) {
        console.log(`Skipping user ${uid} — no email found.`);
        continue;
      }

      console.log(
        `Sending email to ${userInfo.email} with ${userProblems.length} problems`
      );

      await sendEmailSummary({
        to: userInfo.email,
        problems: userProblems.map((p) => ({
          problemName: p.problemName,
          problemUrl: p.problemUrl,
          difficulty: p.difficulty,
          source: p.source,
        })),
      });

      // 6) Update lastEmailSentDate for this user's problems
      for (const p of userProblems) {
        p.lastEmailSentDate = now;
        await p.save();
      }
    }

    console.log("Email(s) sent & lastEmailSentDate updated");
  } catch (error) {
    console.error("Cron error:", error);
  }
});
