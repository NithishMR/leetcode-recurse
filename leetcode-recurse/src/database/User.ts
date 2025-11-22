// src/database/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },

    provider: { type: String },
    providerAccountId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
