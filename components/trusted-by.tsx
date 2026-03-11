"use client"

import { useEffect, useRef } from "react"

const COMPANIES = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Stripe", "Vercel", "OpenAI"
]

export function TrustedBy() {
    const marqueeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Simple clone for infinite scroll
        if (marqueeRef.current) {
            const content = marqueeRef.current.innerHTML
            marqueeRef.current.innerHTML = content + content
        }
    }, [])

    return (
        <section className="border-y border-border bg-background py-8 overflow-hidden">
            <div className="mx-auto max-w-7xl px-5 text-center mb-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Our alumni engineer at world-class companies
                </p>
            </div>

            <div className="relative flex w-full overflow-hidden">
                {/* Gradients for smooth fade out on edges */}
                <div className="absolute left-0 top-0 z-10 w-24 h-full bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 z-10 w-24 h-full bg-gradient-to-l from-background to-transparent" />

                <div
                    ref={marqueeRef}
                    className="flex whitespace-nowrap animate-marquee items-center gap-16 px-8"
                    style={{ animationDuration: '40s' }}
                >
                    {COMPANIES.map((company) => (
                        <div key={company} className="flex items-center space-x-2 grayscale opacity-40 transition-opacity hover:grayscale-0 hover:opacity-100">
                            <span className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                                {company}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
