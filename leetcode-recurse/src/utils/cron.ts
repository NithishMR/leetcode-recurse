import cron from "node-cron";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { sendEmailSummary } from "./email";

cron.schedule("*/10 * * * * *", async () => {
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

    const problemsDueToday = await Problem.find({
      nextReviewDate: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    });

    console.log("Problems due today:", problemsDueToday);

    if (problemsDueToday.length === 0) return;

    //  Filter out problems already mailed today
    const pendingForEmail = problemsDueToday.filter(
      (p) => !p.lastEmailSentDate || p.lastEmailSentDate < startOfDayUTC // last sent before today
    );

    if (pendingForEmail.length === 0) {
      console.log(" All problems already mailed today.");
      return;
    }

    //  Send single summary email
    await sendEmailSummary({
      to: "nithishmr.takemytickets@gmail.com",
      problems: pendingForEmail.map((p) => ({
        problemName: p.problemName,
        problemUrl: p.problemUrl,
        difficulty: p.difficulty,
        source: p.source,
      })),
    });

    //  Update lastEmailSentDate for each
    for (const p of pendingForEmail) {
      p.lastEmailSentDate = now;
      await p.save();
    }

    console.log(" Email sent & updated lastEmailSentDate");
  } catch (error) {
    console.error("Cron error:", error);
  }
});
