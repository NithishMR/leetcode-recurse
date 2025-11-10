import mongoose, { Schema, models, model } from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["add", "review", "edit", "delete"],
      required: true,
    },
    problemId: {
      type: mongoose.Schema.ObjectId,
      ref: "Problem",
      required: true,
    },
    problemName: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const ActivityLog =
  models.ActivityLog || model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
