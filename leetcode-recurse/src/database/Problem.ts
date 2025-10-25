// src/database/Problem.ts
import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  problemName: { type: String, required: true },
  problemUrl: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },

  notes: { type: String, default: "" },
  dateSolved: { type: Date, default: Date.now },
  nextReviewDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  status: { type: String, default: "Active" },
});

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
export default Problem;
