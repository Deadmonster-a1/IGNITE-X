import CallStackDive from "@/components/dsa/call-stack-dive";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Call Stack Simulator Sandbox | Archive_Core",
};

export default function SandboxCallStackPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-4 lg:p-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-[#f26722] transition-colors w-fit">
            <ArrowLeft size={16} />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Return to Mainframe</span>
        </Link>
        
        <div className="text-center sm:text-left space-y-2 mb-4">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight cyber-glitch">Recursion Engine</h1>
            <p className="text-sm font-mono text-zinc-500 max-w-2xl leading-relaxed">
                Dive deep into computer memory to visualize LIFO architecture in real-time. 
                Interact with the control deck to witness stack frames allocate, pause, and resolve dynamically.
            </p>
        </div>

        <CallStackDive />
      </div>

    </div>
  );
}
