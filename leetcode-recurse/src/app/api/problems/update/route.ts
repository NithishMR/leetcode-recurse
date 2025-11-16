import ActivityLog from "@/database/ActivityLog";
import { connectDB } from "@/database/connection";
import Problem from "@/database/Problem";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // Auth check
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.user || !token.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = token.user.id;

    const body = await req.json();
    const { _id, problemName, problemUrl, difficulty, source, notes } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    // Build update object ONLY with fields that exist
    const updateData: any = {};
    if (clean(problemName) !== undefined)
      updateData.problemName = clean(problemName);
    if (clean(problemUrl) !== undefined)
      updateData.problemUrl = clean(problemUrl);
    if (clean(difficulty) !== undefined)
      updateData.difficulty = clean(difficulty);
    if (clean(source) !== undefined) updateData.source = clean(source);
    if (clean(notes) !== undefined) updateData.notes = clean(notes);

    // Update only fields that were provided
    const updatedProblem = await Problem.findOneAndUpdate(
      { _id, userId },
      { $set: updateData }, // <-- IMPORTANT FIX
      { new: true }
    );

    if (!updatedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    await ActivityLog.create({
      userId,
      type: "edit",
      problemId: updatedProblem._id,
      problemName: updatedProblem.problemName,
    });

    return NextResponse.json(updatedProblem, { status: 200 });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Failed to update problem" },
      { status: 500 }
    );
  }
}

const clean = (value: any) => (value === "" ? undefined : value);
