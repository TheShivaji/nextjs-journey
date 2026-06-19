import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-slate-950 overflow-hidden">
      {/* Dynamic Ambient Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[130px] animate-pulse" />
      </div>

      <div className="z-10 w-full flex flex-col items-center">
        {/* Logo / Brand Header */}
        <div className="mb-8 flex items-center space-x-2 text-indigo-400">
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-sm font-bold uppercase tracking-widest text-indigo-400/80">Next.js Server Actions</span>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
