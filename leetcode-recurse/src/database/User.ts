import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },

    // OAuth-specific fields
    provider: { type: String }, // e.g. 'google'
    providerAccountId: { type: String }, // Google's user ID

    // You may add more fields later
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
