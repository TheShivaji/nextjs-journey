"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/drizzle";
import { eq, desc } from "drizzle-orm";

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
  bio?: string;
  avatarColor?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  avatarColor?: string;
  isActive?: boolean;
}

// Helper to auto-retry intermittent serverless fetch failed connection glitches
async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isFetchError =
        error?.message?.includes("fetch") ||
        error?.cause?.message?.includes("fetch") ||
        error?.name === "TypeError";
      if (isFetchError && i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 700 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Database fetch operation failed after retries");
}

export async function getUsers() {
  try {
    const allUsers = await withRetry(() =>
      db.select().from(users).orderBy(desc(users.createdAt))
    );
    return allUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users deck");
  }
}

export async function getUserById(id: number) {
  try {
    const userList = await withRetry(() =>
      db.select().from(users).where(eq(users.id, id))
    );
    if (!userList || userList.length === 0) return null;
    return userList[0];
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    throw new Error(`Failed to inspect user ${id}`);
  }
}

export async function createUser(data: CreateUserInput) {
  try {
    const newUser = await withRetry(() =>
      db.insert(users).values({
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role || "Software Engineer",
        bio: data.bio || "Passionate developer crafting modern web experiences.",
        avatarColor: data.avatarColor || "from-violet-500 to-fuchsia-500",
      }).returning()
    );
    return newUser[0];
  } catch (error: any) {
    console.error("Failed to create user:", error);
    if (error?.code === "23505" || error?.message?.includes("unique")) {
      throw new Error("User with this email endpoint already exists!");
    }
    throw new Error(error?.message || "Failed to create developer card");
  }
}

export async function updateUser(id: number, data: UpdateUserInput) {
  try {
    const updated = await withRetry(() =>
      db.update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning()
    );
    return updated[0];
  } catch (error: any) {
    console.error(`Failed to update user ${id}:`, error);
    throw new Error(error?.message || "Failed to save updated parameters");
  }
}

export async function deleteUser(id: number) {
  try {
    await withRetry(() => db.delete(users).where(eq(users.id, id)));
    return { success: true, id };
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw new Error("Failed to permanently purge card");
  }
}
