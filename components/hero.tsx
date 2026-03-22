"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight, Play, Terminal, CheckCircle2, Sparkles, Zap, TrendingUp, Users, Star,
} from "lucide-react"
import { RobotDock } from "@/components/robot-dock"
import { createClient } from "@/utils/supabase/client"

const techStack = [
  "React", "Next.js", "TypeScript", "Node.js", "DSA", "System Design",
  "Python", "PostgreSQL", "Docker", "AWS",
]

const quickStats = [
  { value: "2.4K+", label: "Students", icon: Users },
  { value: "94%", label: "Placement", icon: TrendingUp },
  { value: "4.9", label: "Rating", icon: Star },
]

export function Hero() {
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const fetchUser = async () => {
      const bypassMatch = document.cookie.match(/(^| )demo_bypass=([^;]+)/)
      if (bypassMatch) { setUser({ email: 'demo@example.com' }); return }
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => { authListener.subscription.unsubscribe() }
  }, [supabase.auth])

  return (
    <section id="hero-section" className="relative min-h-[90vh] overflow-hidden flex flex-col justify-center bg-background py-16 lg:py-0">

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-30" aria-hidden="true" />
      <div className="noise-overlay pointer-events-none absolute inset-0 mix-blend-overlay" aria-hidden="true" />

      {/* Aurora ambient orbs */}
      <div className="aurora-orb aurora-orb-accent pointer-events-none absolute -left-40 top-1/4 h-96 w-96" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-info pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80" aria-hidden="true" />

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-6 top-6 h-12 w-12 border-l-2 border-t-2 border-accent/40 lg:left-10 lg:top-10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 border-accent/40 lg:bottom-10 lg:right-10" aria-hidden="true" />

      {/* HUD scan line */}
      <div className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent scan-line top-0" aria-hidden="true" />

      {/* Main content */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-12">

          {/* Left column */}
          <div className="relative z-20 flex flex-col lg:col-span-6 xl:col-span-7">

            {/* Badges row */}
            <div className="mb-8 flex flex-wrap items-center gap-3 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
              <span
                className="cyber-corner relative flex items-center gap-2 border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-bold text-accent tracking-wide uppercase hover:bg-accent/20 transition-colors"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" }}
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                Architect Edition
              </span>
              <span className="flex items-center gap-2 border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Now Enrolling
              </span>
              <span className="flex items-center gap-1.5 border border-info/30 bg-info/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-info">
                <div className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
                Live Cohort
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              <span className="cyber-glitch block">Architect</span>
              <span className="relative mt-2 block">
                the{" "}
                <span className="animate-gradient-text">Future</span>
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0" aria-hidden="true" />
              </span>
              <span className="mt-2 block text-foreground/90">of Code.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl animate-[fadeInUp_0.7s_ease-out_0.35s_both] border-l-2 border-accent/30 pl-4">
              Transcend basic tutorials. From core algorithms to production-grade distributed systems. Build, scale, and conquer technical interviews with elite 1-on-1 mentorship.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
              <Link
                href={mounted && user ? "/dashboard" : "/signup"}
                suppressHydrationWarning
                className="pointer-events-auto z-50 group relative flex items-center gap-3 animate-shimmer bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-[#050505] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,103,34,0.4)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
              >
                {mounted && user ? "Enter Dashboard" : "Initialize Sequence"}
                <Zap className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/programs"
                suppressHydrationWarning
                className="pointer-events-auto z-50 group flex items-center gap-3 border border-border bg-background/50 px-8 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/5"
              >
                <Play className="h-4 w-4 text-accent" />
                View Protocols
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-10 flex flex-wrap gap-4 animate-[fadeInUp_0.6s_ease-out_0.65s_both]">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-accent flex items-center gap-2.5 px-4 py-2.5 border border-accent/10"
                >
                  <stat.icon className="h-4 w-4 text-accent/70 shrink-0" />
                  <div>
                    <span className="block font-mono text-base font-black text-foreground">{stat.value}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech stack pills */}
            <div className="mt-8 flex flex-wrap gap-2 animate-[fadeInUp_0.6s_ease-out_0.8s_both]">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="cyber-underline border border-muted/30 bg-secondary/30 px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right column (Robot Canvas) */}
          <div className="relative z-10 flex h-[350px] w-full items-center justify-center lg:col-span-6 xl:col-span-5 sm:h-[450px] lg:h-[520px] animate-[fadeInRight_0.8s_ease-out_0.4s_both]">
            <div className="absolute inset-0 border border-accent/10 animate-[spin_60s_linear_infinite]" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
            <div className="absolute inset-8 border border-dashed border-accent/15 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-16 border border-accent/8 animate-[spin_80s_linear_infinite]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

            {/* HUD corner labels */}
            <div className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-accent/30 uppercase">UNIT:ASCI-001</div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] tracking-widest text-accent/30 uppercase">STATUS:ACTIVE</div>

            <RobotDock id="hero" className="relative h-full w-full max-w-[420px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
