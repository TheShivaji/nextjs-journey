import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected successfully! 🟢");
    } catch (error) {
        console.error("Database connection error: 🔴", error);
        throw new Error("Failed to connect to database");
    }
}
