import mongoose from "mongoose";

export async function connectDB(url: string) {
  return mongoose.connect(url);
}
