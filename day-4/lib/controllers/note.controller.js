import { connectDB } from "../db";
import { Note } from "../models/note.model";

// @desc    Get all notes
// @route   GET /api/notes
export async function getNotes(req) {
    try {
        await connectDB();
        const notes = await Note.find().sort({ createdAt: -1 });
        return Response.json(notes, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Failed to fetch notes", error: error.message }, { status: 500 });
    }
}

// @desc    Create a new note
// @route   POST /api/notes
export async function createNote(req) {
    try {
        await connectDB();
        const { title, content } = await req.json();
        
        if (!title || !content) {
            return Response.json({ message: "Title and content are required" }, { status: 400 });
        }

        const newNote = await Note.create({ title, content });
        return Response.json({ message: "Note created successfully", note: newNote }, { status: 201 });
    } catch (error) {
        return Response.json({ message: "Failed to create note", error: error.message }, { status: 500 });
    }
}

// @desc    Update a note
// @route   PUT /api/notes/[id]
export async function updateNote(req, id) {
    try {
        await connectDB();
        const { title, content } = await req.json();

        if (!title || !content) {
            return Response.json({ message: "Title and content are required" }, { status: 400 });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return Response.json({ message: "Note not found" }, { status: 404 });
        }

        return Response.json({ message: "Note updated successfully", note: updatedNote }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Failed to update note", error: error.message }, { status: 500 });
    }
}

// @desc    Delete a note
// @route   DELETE /api/notes/[id]
export async function deleteNote(req, id) {
    try {
        await connectDB();
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return Response.json({ message: "Note not found" }, { status: 404 });
        }

        return Response.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Failed to delete note", error: error.message }, { status: 500 });
    }
}
