"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { formHandler } from "@/actions/action";
import { User, Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const ContactForm = () => {
  const formRef = useRef(null);
  const [state, formAction, isPending] = useActionState(formHandler, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Premium Glassmorphic Card Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
        
        {/* Decorative Background Glows inside the card */}
        <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 -z-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="mb-8 text-center">
          <h2 className="bg-gradient-to-r from-indigo-200 via-violet-200 to-pink-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Drop us a message
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            We'd love to hear from you. Fill out the form below and we'll get right back to you.
          </p>
        </div>

        {/* Action feedback */}
        {state && (
          <div
            className={`mb-6 flex items-start space-x-3 rounded-2xl p-4 text-sm transition-all duration-300 ${
              state.success
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{state.success ? "Success" : "Error"}</p>
              <p className="mt-0.5 opacity-90">{state.message}</p>
            </div>
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <User className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isPending}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950/80 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
                placeholder="john@example.com"
                className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950/80 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Message
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-0 flex items-start pl-4 text-slate-500">
                <MessageSquare className="h-5 w-5" />
              </span>
              <textarea
                id="message"
                name="message"
                required
                disabled={isPending}
                rows={4}
                placeholder="Write your message here..."
                className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950/80 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="relative flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending Message...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Send Message</span>
                <Send className="h-4 w-4" />
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Modern Dashboard Navigation Button */}
      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-950/40 px-5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all duration-200"
        >
          <span>Go to Admin Dashboard</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default ContactForm;