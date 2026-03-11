"use client"

import { Sparkles } from "lucide-react"

export function LandingMarquee() {
    return (
        <section className="relative overflow-hidden border-y bg-background py-16 transition-colors w-full border-accent/20">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
            <div className="animate-marquee flex whitespace-nowrap items-center w-max" style={{ animationDuration: '90s' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="mx-8 flex items-center gap-10">
                        {[
                            "COURSES", "PROGRESS", "ACHIEVEMENTS", "LEADERBOARD",
                            "COMMUNITY", "SYSTEM DESIGN", "ALGORITHMS", "CODE MASTERY"
                        ].map((t, idx) => (
                            <span key={t} className="flex items-center gap-10">
                                <span
                                    className={`text-3xl font-black uppercase tracking-widest transition-colors duration-500 hover:text-accent cursor-default sm:text-4xl lg:text-5xl ${idx % 2 === 0 ? 'text-transparent' : 'text-foreground'}`}
                                    style={idx % 2 === 0 ? { WebkitTextStroke: `1.5px rgba(168,85,247,0.4)` } : {}}
                                >
                                    {t}
                                </span>
                                <Sparkles className="w-8 h-8 opacity-50 transition-opacity hover:opacity-100 animate-pulse text-accent" />
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        </section>
    )
}
