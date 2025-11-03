import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the promise

  try {
    await connectDB();
    const problem = await Problem.findById(id);

    if (!problem) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
