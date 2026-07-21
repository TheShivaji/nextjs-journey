import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Homeview from "@/components/home";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const plan = dbUser?.plan || "FREE";
  const isPremium = plan === "PREMIUM";

  const handleManage=async()=>{
    const res=await fetch ("/api/stripe/portal",{
      method:"POST",
      
    })
    const data =  await res.json()
    if(data.url){
      window.location.href=data.url
    }

  }
    

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome 👋
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your account and view your subscription status anytime.
            </p>
          </div>

          <Link
            href="/payment-plan"
            className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white transition ${
              isPremium
                ? "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200"
                : "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/30"
            }`}
          >
            {isPremium ? "Manage Plan ✨" : "Upgrade Plan"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
          <Homeview plan={plan} />
        </div>
      </div>
    </div>
  );
}