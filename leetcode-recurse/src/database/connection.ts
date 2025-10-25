// src/database/connection.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(" MONGODB_URI is not defined in .env.local");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB (local)");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
