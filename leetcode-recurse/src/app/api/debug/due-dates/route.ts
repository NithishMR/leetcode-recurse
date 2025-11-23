// // src/app/api/debug/due-dates/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/database/connection";
// import Problem from "@/database/Problem";
// import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     // auth
//     const token: any = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     if (!token?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // convert to ObjectId
//     const userId = new mongoose.Types.ObjectId(token.user.id);

//     // fetch all problems for this user
//     const problems = await Problem.find({ userId })
//       .select(
//         "problemName problemUrl difficulty source dateSolved timesSolved nextReviewDate lastEmailSentDate status"
//       )
//       .lean();

//     const now = new Date();

//     // Normalize day boundaries in UTC for consistent day calculation
//     const startOfToday = new Date(now);
//     startOfToday.setUTCHours(0, 0, 0, 0);

//     const endOfToday = new Date(now);
//     endOfToday.setUTCHours(23, 59, 59, 999);

//     const msPerDay = 1000 * 60 * 60 * 24;

//     const processed = problems.map((p: any) => {
//       const nr = p.nextReviewDate ? new Date(p.nextReviewDate) : null;

//       // daysUntil: rounded down toward zero (so fractional days become 0 .. use ceil for "days left")
//       let daysUntil: number | null = null;
//       let dueStatus = "no-next-review";

//       if (nr) {
//         // compute whole days difference (ceil so future partial day counts as 1)
//         const diffMs = nr.getTime() - now.getTime();
//         daysUntil = Math.ceil(diffMs / msPerDay);

//         if (nr < startOfToday) dueStatus = "overdue";
//         else if (nr >= startOfToday && nr <= endOfToday) dueStatus = "today";
//         else dueStatus = "upcoming";
//       }

//       return {
//         _id: p._id,
//         problemName: p.problemName,
//         problemUrl: p.problemUrl,
//         difficulty: p.difficulty,
//         source: p.source,
//         status: p.status,
//         dateSolved: p.dateSolved ? new Date(p.dateSolved).toISOString() : null,
//         timesSolved: p.timesSolved,
//         nextReviewDate: nr ? nr.toISOString() : null,
//         daysUntil, // null if no nextReviewDate
//         dueStatus,
//         lastEmailSentDate: p.lastEmailSentDate
//           ? new Date(p.lastEmailSentDate).toISOString()
//           : null,
//       };
//     });

//     // simple summary
//     const summary = {
//       totalProblems: processed.length,
//       overdue: processed.filter((p) => p.dueStatus === "overdue").length,
//       today: processed.filter((p) => p.dueStatus === "today").length,
//       upcoming: processed.filter((p) => p.dueStatus === "upcoming").length,
//       noNextReview: processed.filter((p) => p.dueStatus === "no-next-review")
//         .length,
//     };

//     return NextResponse.json({ summary, problems: processed }, { status: 200 });
//   } catch (err) {
//     console.error("Error in due-dates debug route:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch due dates" },
//       { status: 500 }
//     );
//   }
// }
