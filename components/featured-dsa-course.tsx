"use client"

import Link from "next/link"
import { Braces, BookOpen, Zap, ArrowRight, Sparkles, Target } from "lucide-react"

export function FeaturedDSACourse() {
    return (
        <section className="relative py-8 lg:py-12">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <Link
                    href="/programs/dsa"
                    className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden border border-accent/20 bg-card/60 backdrop-blur-sm transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(242,103,34,0.08)] hover:-translate-y-0.5"
                >
                    {/* Left accent bar */}
                    <div className="hidden sm:block w-1.5 bg-gradient-to-b from-accent via-[#f59e0b] to-accent shrink-0" />

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 p-6 sm:p-8">

                        {/* Icon */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                            <Braces className="h-7 w-7 text-accent" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                    <Sparkles className="h-3 w-3" />
                                    New Course
                                </span>
                                <span className="px-2 py-0.5 border border-success/20 bg-success/10 text-success font-mono text-[10px] font-bold uppercase tracking-widest">
                                    Free
                                </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors">
                                DSA for Beginners — Chapter 1: Thinking Like a Programmer
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                Learn to think in algorithms, write pseudocode, and draw flowcharts before writing a single line of code. 10 beginner-friendly lessons.
                            </p>
                        </div>

                        {/* Stats + CTA */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 shrink-0">
                            {/* Mini stats */}
                            <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> 10 lessons</span>
                                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-[#f59e0b]" /> 300 XP</span>
                                <span className="flex items-center gap-1"><Target className="h-3 w-3 text-success" /> Beginner</span>
                            </div>

                            {/* CTA */}
                            <span className="flex items-center gap-2 font-mono text-xs font-bold text-accent uppercase tracking-widest group-hover:gap-3 transition-all">
                                Start Learning
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Bottom progress line animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                        <div className="h-full w-0 bg-gradient-to-r from-accent to-[#f59e0b] group-hover:w-full transition-all duration-700" />
                    </div>
                </Link>
            </div>
        </section>
    )
}
