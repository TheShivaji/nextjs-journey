import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
    completed: z.boolean().default(false),
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
    completed: z.boolean().default(false),
});