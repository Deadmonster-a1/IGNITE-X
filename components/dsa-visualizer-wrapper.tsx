"use client"

import dynamic from "next/dynamic"

export const DSAVisualizerWrapper = dynamic(
    () => import("@/components/dsa-visualizer").then((mod) => mod.DSAVisualizer),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[600px] w-full bg-secondary/30 border-y border-accent/10 animate-pulse flex items-center justify-center p-20">
                <span className="text-accent font-mono text-sm">INITIALIZING VISUALIZER...</span>
            </div>
        )
    }
)
