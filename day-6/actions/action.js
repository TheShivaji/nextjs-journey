"use server";
import { connnectDB } from "@/app/lib/database";
import { Form } from "@/app/lib/models/form.models";
import { revalidatePath } from "next/cache";

export const formHandler = async (prevState, formData) => {
    try {
        await connnectDB();
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        if (!name || !email || !message) {
            return { success: false, message: "All fields are required." };
        }

        await Form.create({
            name: name,
            email: email,
            message: message,
            status: "pending"
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Your message has been sent successfully!" };
    } catch (error) {
        console.error("Error creating form submission:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

export const getFormsData = async () => {
    try {
        await connnectDB();
        const forms = await Form.find({}).sort({ createdAt: -1 }).lean();
        return forms.map(doc => ({
            ...doc,
            _id: doc._id.toString(),
            createdAt: doc.createdAt ? doc.createdAt.toISOString() : null
        }));
    } catch (error) {
        console.error("Error fetching forms data:", error);
        return [];
    }
};

export const updateStatus = async (id) => {
    try {
        await connnectDB();
        const form = await Form.findByIdAndUpdate(id, { status: "completed" }, { new: true }).lean();
        revalidatePath("/dashboard");
        if (!form) return null;
        return {
            ...form,
            _id: form._id.toString(),
            createdAt: form.createdAt ? form.createdAt.toISOString() : null
        };
    } catch (error) {
        console.error("Error updating status:", error);
        return null;
    }
};

