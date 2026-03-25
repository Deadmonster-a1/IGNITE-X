"use client"

import { useEffect, useRef } from "react"
import { Globe } from "lucide-react"

const COMPANIES = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Stripe", "Vercel", "OpenAI", "Adobe", "Airbnb", "Tesla"
]

export function TrustedBy() {
    return (
        <section className="relative border-y border-accent/10 bg-secondary/15 py-12 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-10" aria-hidden="true" />
            
            <div className="relative mx-auto max-w-7xl px-5 mb-10">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex items-center gap-2 text-accent/60">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Global Network</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl opacity-90">
                        Engineers from ASCI now lead at:
                    </h2>
                </div>
            </div>

            <div className="marquee-wrapper relative flex w-full overflow-hidden">
                {/* Gradients for smooth fade out on edges */}
                <div className="absolute left-0 top-0 z-10 w-32 h-full bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute right-0 top-0 z-10 w-32 h-full bg-gradient-to-l from-background via-background/80 to-transparent" />

                <div
                    className="flex whitespace-nowrap animate-marquee items-center gap-16 px-8 py-4"
                    style={{ animationDuration: '50s' }}
                >
                    {[...COMPANIES, ...COMPANIES].map((company, idx) => (
                        <div 
                            key={`${company}-${idx}`} 
                            className="group flex items-center space-x-2 transition-all duration-500"
                        >
                            <span className="text-2xl md:text-3xl font-black tracking-tighter text-muted-foreground/30 transition-all duration-500 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(242,103,34,0.4)] cursor-default">
                                {company}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* HUD Decoration */}
            <div className="absolute bottom-2 left-6 right-6 flex items-center gap-4 opacity-20">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="font-mono text-[8px] tracking-[0.3em] text-accent uppercase">Verified Placement Data</div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
        </section>
    )
}
