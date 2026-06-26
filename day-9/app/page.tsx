"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, CreateUserInput } from "@/actions/userActions";
import Link from "next/link";

const GRADIENT_PRESETS = [
  { label: "Cyber Neon", value: "from-violet-600 via-fuchsia-600 to-pink-600" },
  { label: "Emerald Glow", value: "from-emerald-500 via-teal-600 to-cyan-600" },
  { label: "Sunset Fire", value: "from-amber-500 via-orange-600 to-red-600" },
  { label: "Oceanic Blue", value: "from-blue-600 via-indigo-600 to-violet-600" },
];

export default function Home() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateUserInput>({
    name: "",
    email: "",
    role: "Full Stack Developer",
    bio: "Passionate about building scalable modern web applications.",
    avatarColor: GRADIENT_PRESETS[0].value,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { data: usersList, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getUsers(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => await createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setFormData({
        name: "",
        email: "",
        role: "Full Stack Developer",
        bio: "Passionate about building scalable modern web applications.",
        avatarColor: GRADIENT_PRESETS[0].value,
      });
      setErrorMessage("");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Something went wrong while creating the card!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage("Please enter both Name and Email.");
      return;
    }
    setErrorMessage("");
    createMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-slate-950 text-slate-100 selection:bg-fuchsia-500 selection:text-white relative overflow-hidden">
      {/* Ambient Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[35%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl shadow-violet-500/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              Day 9 • Drizzle ORM + TanStack Query
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pb-2">
            User Card Studio
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Craft your custom developer profile card instantly. Click on any card to view detailed specs, edit specs, or delete.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Card Creation Form (Col 1-5) */}
          <section className="lg:col-span-5 bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-violet-500/20 text-violet-400 text-lg">⚡</span>
              Generate New Card
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Enter specs below to inject a new card via Server Actions & TanStack Query mutation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@acme.dev"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="What are you building today?"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-inner resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                  Card Aura Theme
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = formData.avatarColor === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarColor: preset.value })}
                        className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "bg-white/10 border-violet-400 scale-[1.02] shadow-lg shadow-violet-500/10"
                            : "bg-slate-800/40 border-white/5 hover:bg-slate-800/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${preset.value} shrink-0 shadow`} />
                        <span className="text-xs font-medium text-slate-200 truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold tracking-wide transition-all duration-200 shadow-xl shadow-fuchsia-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {createMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Injecting Card...
                  </>
                ) : (
                  <span>✨ Create Card Now</span>
                )}
              </button>
            </form>
          </section>

          {/* Cards Grid Section (Col 6-12) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎴 Active Cards Deck</span>
                {usersList && (
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
                    {usersList.length}
                  </span>
                )}
              </h2>
              <span className="text-xs text-slate-400">Click any card to inspect & manage</span>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 rounded-3xl bg-slate-900/50 border border-white/5 animate-pulse p-6 flex flex-col justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800/80 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-10 bg-slate-800/50 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center">
                <p className="text-rose-400 font-semibold mb-2">Failed to load cards deck</p>
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors"
                >
                  Try Refetching
                </button>
              </div>
            )}

            {usersList && usersList.length === 0 && (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/10 text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">No Cards Crafted Yet</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Use the studio form on the left to create your first dynamic user card.
                </p>
              </div>
            )}

            {usersList && usersList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {usersList.map((user: any) => {
                  const gradient = user.avatarColor || "from-violet-600 via-fuchsia-600 to-pink-600";
                  return (
                    <Link
                      key={user.id}
                      href={`/users/${user.id}`}
                      className="group relative bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-violet-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden backdrop-blur-md cursor-pointer"
                    >
                      {/* Top Gradient Banner Glow */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-25 rounded-full blur-2xl transition-opacity pointer-events-none`} />

                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} p-0.5 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-white tracking-tighter">
                              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                              {user.isActive ? "Active" : "Offline"}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                          {user.name}
                        </h3>
                        <p className="text-xs font-medium text-fuchsia-400 line-clamp-1 mb-2">
                          {user.role || "Developer"}
                        </p>
                        <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed mb-4">
                          {user.bio || "No bio provided."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-slate-500 truncate max-w-[150px] font-mono">
                          {user.email}
                        </span>
                        <span className="text-violet-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Inspect <span className="text-sm">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
