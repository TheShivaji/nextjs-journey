import mongoose from "mongoose";

export async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        await mongoose.connect(uri);
        console.log("Connection successful🟢")
    } catch (error) {
        throw new Error(error.message || error);
    }
}