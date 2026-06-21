import mongoose from "mongoose";

const ExtensionRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// A request ID can only be processed once per user
ExtensionRequestSchema.index(
  {
    userId: 1,
    requestId: 1,
  },
  {
    unique: true,
  },
);

const ExtensionRequest =
  mongoose.models.ExtensionRequest ||
  mongoose.model("ExtensionRequest", ExtensionRequestSchema);

export default ExtensionRequest;
