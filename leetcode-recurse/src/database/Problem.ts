// src/database/Problem.ts
import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  problemName: { type: String, required: true },
  problemUrl: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },

  notes: { type: String, default: "" },
  dateSolved: { type: Date, default: Date.now },
  timesSolved: {
    type: Number,
    default: 1,
  },
  nextReviewDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  lastEmailSentDate: { type: Date, default: null },
});

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;
