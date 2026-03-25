"use client"

import dynamic from "next/dynamic"
import { Loader2, Terminal } from "lucide-react"

export const DSAVisualizerWrapper = dynamic(
    () => import("@/components/dsa-visualizer").then((mod) => mod.DSAVisualizer),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[600px] w-full bg-secondary/15 border-y border-accent/10 flex flex-col items-center justify-center p-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-cyber opacity-10" aria-hidden="true" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center border border-accent/30 bg-accent/10 animate-pulse">
                        <Terminal className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase animate-shimmer">
                            Initializing Visualizer Core
                        </span>
                        <div className="mt-4 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 text-accent/60 animate-spin" />
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Loading modules...</span>
                        </div>
                    </div>
                </div>
                {/* Scan line effect */}
                <div className="absolute inset-0 scan-line pointer-events-none opacity-20" aria-hidden="true" />
            </div>
        )
    }
)
