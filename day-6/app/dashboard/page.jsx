import React from "react";
import { getFormsData } from "@/actions/action";
import DashboardClient from "@/components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const submissions = await getFormsData();

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[125px] -z-10 pointer-events-none" />

      <DashboardClient initialSubmissions={submissions} />
    </main>
  );
}