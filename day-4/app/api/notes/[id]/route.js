import { updateNote, deleteNote } from "@/lib/controllers/note.controller";

export const PUT = async (req, { params }) => {
    const { id } = await params;
    return await updateNote(req, id);
};

export const DELETE = async (req, { params }) => {
    const { id } = await params;
    return await deleteNote(req, id);
};
