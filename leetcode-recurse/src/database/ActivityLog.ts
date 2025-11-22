// src/database/ActivityLog.ts
import mongoose, { Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["add", "review", "edit", "delete"],
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
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
  { timestamps: true }
);

// Important: faster cleanup (delete oldest)
ActivityLogSchema.index({ userId: 1, createdAt: 1 });

const ActivityLog =
  models.ActivityLog || model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
