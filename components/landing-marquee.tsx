"use client"

import { Sparkles, Zap } from "lucide-react"

const items = [
  "COURSES", "PROGRESS", "ACHIEVEMENTS", "LEADERBOARD",
  "COMMUNITY", "SYSTEM DESIGN", "ALGORITHMS", "CODE MASTERY",
  "LIVE SESSIONS", "1-ON-1 MENTORSHIP",
]

export function LandingMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-accent/15 bg-secondary/20 py-4 w-full marquee-wrapper">
      {/* Gradient fades */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />

      {/* Top row — left to right */}
      <div className="animate-marquee flex whitespace-nowrap items-center w-max py-2" style={{ animationDuration: '60s' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            {items.map((t, idx) => (
              <span key={t + idx} className="flex items-center gap-8">
                <span
                  className={`text-2xl font-black uppercase tracking-widest transition-colors duration-300 hover:text-accent cursor-default sm:text-3xl lg:text-4xl ${
                    idx % 3 === 0
                      ? "text-transparent"
                      : idx % 3 === 1
                      ? "text-foreground/70"
                      : "text-foreground/40"
                  }`}
                  style={idx % 3 === 0 ? { WebkitTextStroke: "1.5px rgba(242,103,34,0.4)" } : {}}
                >
                  {t}
                </span>
                {idx % 2 === 0
                  ? <Sparkles className="w-5 h-5 opacity-40 text-accent flex-shrink-0" />
                  : <div className="w-1.5 h-1.5 border border-accent/40 rotate-45 flex-shrink-0" />
                }
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* Bottom row — right to left */}
      <div className="animate-marquee-reverse flex whitespace-nowrap items-center w-max py-2" style={{ animationDuration: '75s' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            {[...items].reverse().map((t, idx) => (
              <span key={t + idx} className="flex items-center gap-8">
                <span
                  className={`text-xl font-black uppercase tracking-widest transition-colors duration-300 hover:text-accent cursor-default sm:text-2xl ${
                    idx % 2 === 0 ? "text-muted-foreground/30" : "text-transparent"
                  }`}
                  style={idx % 2 !== 0 ? { WebkitTextStroke: "1px rgba(242,103,34,0.25)" } : {}}
                >
                  {t}
                </span>
                <Zap className="w-4 h-4 opacity-25 text-accent/60 flex-shrink-0" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  )
}
