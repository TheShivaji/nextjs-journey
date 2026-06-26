"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser, deleteUser, UpdateUserInput } from "@/actions/userActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GRADIENT_PRESETS = [
  { label: "Cyber Neon", value: "from-violet-600 via-fuchsia-600 to-pink-600" },
  { label: "Emerald Glow", value: "from-emerald-500 via-teal-600 to-cyan-600" },
  { label: "Sunset Fire", value: "from-amber-500 via-orange-600 to-red-600" },
  { label: "Oceanic Blue", value: "from-blue-600 via-indigo-600 to-violet-600" },
];

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserInput>({});
  const [errorMessage, setErrorMessage] = useState("");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const data = await getUserById(userId);
      if (data) {
        setEditForm({
          name: data.name,
          email: data.email,
          role: data.role || "",
          bio: data.bio || "",
          avatarColor: data.avatarColor || GRADIENT_PRESETS[0].value,
          isActive: data.isActive ?? true,
        });
      }
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: UpdateUserInput) => await updateUser(userId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditing(false);
      setErrorMessage("");
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "Failed to update card details");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => await deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/");
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "Failed to delete user card");
    },
  });

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    updateMutation.mutate(editForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-3xl bg-violet-600/30 animate-spin" />
          <p className="text-slate-400 font-mono text-sm">Inspecting Developer Card Specs...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-2xl font-bold text-white mb-2">Card Not Found</h1>
        <p className="text-slate-400 mb-6 max-w-md">
          The requested developer card doesn't exist in the Neon database or has been purged.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-2"
        >
          ← Return to Deck
        </Link>
      </div>
    );
  }

  const gradient = user.avatarColor || "from-violet-600 via-fuchsia-600 to-pink-600";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500 selection:text-white relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b ${gradient} opacity-15 blur-[160px]`} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Navigation Bar */}
        <nav className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          >
            <span>←</span> Back to Studio
          </Link>
          <div className="text-xs font-mono text-slate-500">
            CARD_ID // #{user.id}
          </div>
        </nav>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-6">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Hero Card Presentation */}
        <div className="bg-slate-900/70 border border-white/15 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl relative">
          {/* Top Gradient Header Banner */}
          <div className={`h-48 w-full bg-gradient-to-r ${gradient} relative p-8 flex items-end justify-between`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <div className="relative z-10 flex items-center gap-6 translate-y-12">
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${gradient} p-1 shadow-2xl shrink-0`}>
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-black text-4xl text-white tracking-tighter shadow-inner">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
              </div>
              <div className="pb-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow">
                  {user.role || "Developer"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight drop-shadow-md">
                  {user.name}
                </h1>
              </div>
            </div>

            <div className="relative z-10 mb-2">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                user.isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-slate-900/60 text-slate-400 border border-slate-700"
              }`}>
                <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                {user.isActive ? "Active Status" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="pt-20 pb-8 px-8 sm:px-12 space-y-8">
            {!isEditing ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">About / Biography</h3>
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light bg-slate-800/40 p-6 rounded-2xl border border-white/5">
                    {user.bio || "No developer biography provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Endpoint</span>
                    <span className="text-sm font-mono text-violet-300 break-all">{user.email}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Created At</span>
                    <span className="text-sm text-slate-200">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Last Updated</span>
                    <span className="text-sm text-slate-200">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Management Buttons */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 rounded-2xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    ✏️ Edit Card Specs
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Are you certain you wish to permanently purge this card?")) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Purging..." : "🗑️ Delete Card"}
                  </button>
                </div>
              </>
            ) : (
              /* Inline Edit Mode */
              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚡ Modifying Card Parameters</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={editForm.role || ""}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="relative flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-slate-800/60 border border-white/10 w-full">
                      <input
                        type="checkbox"
                        checked={editForm.isActive ?? true}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                        className="w-5 h-5 rounded accent-violet-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-200">
                        Card Active Status (Visible in deck)
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                    Developer Bio
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.bio || ""}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Aura Gradient Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GRADIENT_PRESETS.map((preset) => {
                      const isSelected = editForm.avatarColor === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, avatarColor: preset.value })}
                          className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white/15 border-violet-400 scale-[1.02] shadow-lg shadow-violet-500/10"
                              : "bg-slate-800/40 border-white/5 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${preset.value} shrink-0 shadow`} />
                          <span className="text-xs font-medium text-slate-200 truncate">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
