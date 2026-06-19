import mongoose from "mongoose";

export const connnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};