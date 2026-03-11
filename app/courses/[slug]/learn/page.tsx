"use client"

import { usePathname } from "next/navigation"
import { ShieldCheck, ArrowRight, Play, Terminal } from "lucide-react"
import { use } from "react"

export default function LearnDashboard({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    return (
        <div className="flex-1 flex flex-col h-full bg-[#050505] p-6 lg:p-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-cyber opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl relative z-10 mt-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                        <Terminal className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent font-black">System Ready</h2>
                        <p className="text-sm font-medium text-muted-foreground">Architect Terminal Online</p>
                    </div>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-8">
                    Welcome to <span className="text-accent cyber-glitch" data-text="the grid">the grid</span>.
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground/80 font-mono mb-10 leading-relaxed max-w-2xl">
                    You have successfully established an uplink to the {slug.replace("-", " ")} Architect training sequence. To begin your journey, select a module from the syllabus on the left.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                    <div className="p-5 border border-border/30 bg-[#090c10] rounded-lg">
                        <Terminal className="h-6 w-6 text-accent mb-3" />
                        <h3 className="font-bold text-foreground mb-1">Interactive Console</h3>
                        <p className="text-xs text-muted-foreground">Execute Python code directly in your browser using our WebAssembly runtime.</p>
                    </div>
                    <div className="p-5 border border-border/30 bg-[#090c10] rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-success mb-3" />
                        <h3 className="font-bold text-foreground mb-1">Automated Validation</h3>
                        <p className="text-xs text-muted-foreground">Challenges are verified against secure test cases to ensure architectural integrity.</p>
                    </div>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm font-mono text-muted-foreground/50 border-t border-border/20 pt-6">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        Connection Stable
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }} />
                        Modules Loaded
                    </div>
                </div>
            </div>
        </div>
    )
}
