// src/database/Problem.ts
import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // important
    },
    calendarEventId: {
      type: String,
      default: null,
      index: true,
    },

    problemName: { type: String, required: true, index: true },
    problemUrl: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },

    source: { type: String, required: true, index: true },

    status: {
      type: String,
      enum: ["active", "pending", "overdue", "completed"],
      default: "active",
      index: true,
    },

    notes: { type: String, default: "" },
    dateSolved: { type: Date, default: Date.now },

    timesSolved: { type: Number, default: 1 },
    nextReviewDate: { type: Date, index: true },

    lastEmailSentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// COMPOUND INDEXES — Very Important
ProblemSchema.index({ userId: 1, nextReviewDate: 1 });
ProblemSchema.index({ userId: 1, status: 1 });
ProblemSchema.index({ userId: 1, difficulty: 1 });
ProblemSchema.index({ userId: 1, source: 1 });

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);

export default Problem;
