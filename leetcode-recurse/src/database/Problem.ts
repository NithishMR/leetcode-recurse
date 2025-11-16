// src/database/Problem.ts
import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemName: { type: String, required: true },
    problemUrl: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    source: { type: String, required: true },

    notes: { type: String, default: "" },
    dateSolved: { type: Date, default: Date.now },
    timesSolved: { type: Number, default: 1 },
    nextReviewDate: { type: Date },
    lastEmailSentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;
