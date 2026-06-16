import { getNotes, createNote } from "@/lib/controllers/note.controller";

export const GET = async (req) => {
    return await getNotes(req);
};

export const POST = async (req) => {
    return await createNote(req);
};
