import { connectDB } from "@/app/lib/database";
import { Note } from "@/app/lib/models/note.models";

export const DELETE = async (req, { params }) => {
    await connectDB();
    const { id } = await params;

    await Note.findByIdAndDelete(id);

    return Response.json(
        { message: "Note deleted successfully" },
        { status: 200 }
    )
}

export const PUT = async (req, { params }) => {
    await connectDB();
    const { id } = await params;
    const { title, content } = await req.json()
    const note = await Note.findByIdAndUpdate(id, { title, content }, { returnDocument: "after" });

    return Response.json({ message: "Note updated successfully" , note}, { status: 200 })
}