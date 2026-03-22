"use client"

import Link from "next/link"
import { Braces, BookOpen, Zap, ArrowRight, Sparkles, Target, Code2, Lock } from "lucide-react"

export function FeaturedDSACourse() {
  return (
    <section className="relative py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Link
          href="/programs/dsa"
          className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden border border-accent/25 glass-accent backdrop-blur-sm transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_50px_rgba(242,103,34,0.12)] hover:-translate-y-0.5"
        >
          {/* Animated gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-accent/70 to-transparent animate-shimmer" />
          </div>

          {/* Left accent bar — animated */}
          <div className="hidden sm:block w-1.5 bg-gradient-to-b from-accent/80 via-[#f59e0b]/60 to-accent/40 group-hover:from-accent group-hover:to-[#f59e0b] transition-all duration-500 shrink-0" />

          {/* Content */}
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 p-6 sm:p-8">

            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 group-hover:bg-accent/20 group-hover:border-accent/60 group-hover:shadow-[0_0_20px_rgba(242,103,34,0.3)] transition-all duration-300">
              <Braces className="h-7 w-7 text-accent" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] font-bold uppercase tracking-widest animate-shimmer">
                  <Sparkles className="h-3 w-3" />
                  New Course
                </span>
                <span className="px-2 py-0.5 border border-success/30 bg-success/10 text-success font-mono text-[10px] font-bold uppercase tracking-widest">
                  Free
                </span>
                <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 border border-info/20 bg-info/10 text-info font-mono text-[10px] font-bold uppercase tracking-widest">
                  <div className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
                  10 Lessons
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors duration-300">
                DSA for Beginners — Chapter 1: Thinking Like a Programmer
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Learn to think in algorithms, write pseudocode, and draw flowcharts before writing a single line of code. 10 beginner-friendly lessons.
              </p>
            </div>

            {/* Stats + CTA */}
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> 10 lessons</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-[#f59e0b]" /> 300 XP</span>
                <span className="flex items-center gap-1"><Target className="h-3 w-3 text-success" /> Beginner</span>
              </div>
              <span className="flex items-center gap-2 font-mono text-xs font-bold text-accent uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* Corner HUD decorations */}
          <div className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-accent/30 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r border-accent/30 pointer-events-none" aria-hidden="true" />

          {/* Hover glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Bottom progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-accent to-[#f59e0b] group-hover:w-full transition-all duration-700" />
          </div>
        </Link>
      </div>
    </section>
  )
}
