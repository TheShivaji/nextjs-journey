"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      if (editingId) {
        const res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (res.ok) {
          await fetchNotes();
          setEditingId(null);
          setTitle("");
          setContent("");
          alert("Note updated");
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (res.ok) {
          await fetchNotes();
          setTitle("");
          setContent("");
          alert("Note created");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-yellow-950 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Notes App
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Create, manage and organize your notes
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl">
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <label className="block text-yellow-400 font-medium mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="mb-5">
              <label className="block text-yellow-400 font-medium mb-2">
                Content
              </label>

              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : editingId
                  ? "Update Note"
                  : "Add Note"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-20">
              <div className="text-7xl mb-4">📝</div>

              <h2 className="text-2xl font-semibold text-white">
                No Notes Yet
              </h2>

              <p className="text-gray-400 mt-2">
                Create your first note to get started.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="
                  bg-white/5
                  backdrop-blur-lg
                  border
                  border-white/10
                  rounded-2xl
                  p-6
                  hover:border-yellow-500
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                <h2 className="text-xl font-bold text-yellow-400 mb-3">
                  {note.title}
                </h2>

                <p className="text-gray-300 mb-4 line-clamp-4">
                  {note.content}
                </p>

                <p className="text-xs text-gray-500 mb-5">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}