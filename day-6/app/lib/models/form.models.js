import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export const Form = mongoose.models.Form || mongoose.model("Form", FormSchema);