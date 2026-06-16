import { Note } from "@/app/lib/models/note.models";
import { connectDB } from "@/app/lib/database";


export const POST = async (req) => {
    await connectDB();
    const { title, content } = await req.json();
    const createNote = await Note.create({
        title,
        content
    });

    return Response.json(
        { message: "Notes created successfully", note: createNote },
        { status: 201 }
    );
};

export const GET = async (req) => {
    await connectDB();
    const getNotes = await Note.find().sort({ createdAt: -1 });

    if (!getNotes) {
        return Response.json(
            { message: "Notes not found" },
            { status: 404 }
        );
    }

    return Response.json(getNotes, { status: 200 });
};

