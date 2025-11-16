// import { connectDB } from "@/database/connection";
// import Problem from "@/database/Problem";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();
//     const problemCount = await Problem.countDocuments({});
//     console.log("ProblemCount:", problemCount);
//     return NextResponse.json({ problemCount: problemCount }, { status: 200 });
//   } catch (error) {
//     NextResponse.json({ reviewedToday: 0 }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Problem from "@/database/Problem";
import { connectDB } from "@/database/connection";

export async function GET(req: NextRequest) {
  try {
    // Token typed as any to avoid TS complaints
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    // console.log(userId);
    await connectDB();

    const problemCount = await Problem.countDocuments({ userId });

    return NextResponse.json({ problemCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user problem count:", error);
    return NextResponse.json(
      { problemCount: 0, error: "Failed to fetch problem count" },
      { status: 500 }
    );
  }
}
