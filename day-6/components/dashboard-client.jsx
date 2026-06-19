"use client";

import React, { useState, useTransition } from "react";
import { updateStatus } from "@/actions/action";
import {
  ArrowLeft,
  Inbox,
  CheckCircle2,
  Clock,
  Search,
  Mail,
  User,
  MessageSquare,
  Calendar,
  Check,
  Loader2,
  Filter
} from "lucide-react";
import Link from "next/link";

const DashboardClient = ({ initialSubmissions }) => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'completed'
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);

  // Statistics calculation
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status !== "completed").length;
  const completedCount = submissions.filter((s) => s.status === "completed").length;

  // Filter and search logic
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && s.status !== "completed") ||
      (statusFilter === "completed" && s.status === "completed");

    return matchesSearch && matchesStatus;
  });

  const handleMarkCompleted = async (id) => {
    setUpdatingId(id);
    startTransition(async () => {
      const updatedForm = await updateStatus(id);
      if (updatedForm) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status: "completed" } : s))
        );
      }
      setUpdatingId(null);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Submissions Inbox
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Total Submissions */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400">
            <Inbox className="h-16 w-16" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Submissions</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{totalCount}</p>
          <div className="mt-2 h-1 w-12 rounded-full bg-indigo-500" />
        </div>

        {/* Pending Submissions */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-400">
            <Clock className="h-16 w-16" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{pendingCount}</p>
          <div className="mt-2 h-1 w-12 rounded-full bg-amber-500" />
        </div>

        {/* Completed Submissions */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{completedCount}</p>
          <div className="mt-2 h-1 w-12 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-slate-400 mr-2 flex items-center text-xs font-semibold uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 mr-1 text-slate-500" /> Filters:
        </span>
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            statusFilter === "all"
              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          All Messages
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            statusFilter === "pending"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            statusFilter === "completed"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Submissions List Container */}
      {filteredSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-850 bg-slate-900/10 py-16 text-center backdrop-blur-sm">
          <Inbox className="h-12 w-12 text-slate-650 mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No submissions found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {searchQuery
              ? `We couldn't find any results matching "${searchQuery}".`
              : "No submissions are currently in this inbox."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubmissions.map((submission) => {
            const isCompleted = submission.status === "completed";
            const isUpdating = updatingId === submission._id;

            return (
              <div
                key={submission._id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-md p-6 ${
                  isCompleted
                    ? "bg-slate-900/10 border-slate-900/80 hover:border-slate-800/80"
                    : "bg-slate-900/50 border-slate-800 hover:border-indigo-500/30"
                }`}
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="h-3 w-3 mr-1" /> Completed
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </>
                      )}
                    </span>

                    {/* Date */}
                    <div className="flex items-center text-slate-500 text-xs">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>

                  {/* Sender Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm font-semibold text-slate-200">
                      <User className="h-4 w-4 mr-2 text-indigo-400 shrink-0" />
                      {submission.name}
                    </div>
                    <div className="flex items-center text-xs text-slate-400 hover:text-slate-300">
                      <Mail className="h-4 w-4 mr-2 text-slate-500 shrink-0" />
                      <a href={`mailto:${submission.email}`} className="hover:underline">
                        {submission.email}
                      </a>
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="relative rounded-xl bg-slate-950/40 p-4 border border-slate-900 text-sm text-slate-300 mb-6 leading-relaxed">
                    <MessageSquare className="absolute top-4 right-4 h-4 w-4 text-slate-800 pointer-events-none" />
                    <p className="whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-2">
                  {!isCompleted ? (
                    <button
                      onClick={() => handleMarkCompleted(submission._id)}
                      disabled={isUpdating}
                      className="flex items-center space-x-2 rounded-xl bg-slate-955 hover:bg-emerald-500 hover:text-white border border-slate-800 hover:border-emerald-500 px-4 py-2 text-xs font-semibold text-slate-300 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Completed</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />
                      <span>Handled</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardClient;
