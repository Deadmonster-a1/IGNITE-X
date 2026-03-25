"use client"

import { useEffect, useRef, useState } from "react"
import { Users, BookOpen, TrendingUp, Globe } from "lucide-react"

const stats = [
  { value: 2400, suffix: "+", label: "Students Enrolled", sublabel: "Across 40+ countries", icon: Users },
  { value: 94, suffix: "%", label: "Placement Rate", sublabel: "At top-tier companies", icon: TrendingUp },
  { value: 12, suffix: "+", label: "Courses Available", sublabel: "Beginner to Expert", icon: BookOpen },
  { value: 40, suffix: "+", label: "Countries Reached", sublabel: "Global community", icon: Globe },
]

function useCountUpNumber(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const duration = 1600
    const step = 16
    const steps = duration / step
    const increment = target / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { clearInterval(timer); setCount(target); return }
      setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [target, active])
  return count
}

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUpNumber(stat.value, active)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(true)
    }, { threshold: 0.5 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="cyber-corner group relative flex flex-col border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(242,103,34,0.12)] card-interactive"
    >
      {/* Gradient top rail */}
      <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden bg-border">
        <div className="h-full w-0 bg-accent transition-all duration-700 group-hover:w-full" />
      </div>

      {/* Icon */}
      <div className="flex h-11 w-11 items-center justify-center border border-accent/20 bg-accent/10 transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent/20 group-hover:shadow-[0_0_16px_rgba(242,103,34,0.25)]">
        <stat.icon className="h-5 w-5 text-accent" />
      </div>

      {/* Number */}
      <div className="mt-5">
        <div className="flex items-end gap-0.5">
          <span className="font-mono text-4xl font-black text-gradient-accent leading-none">
            {count.toLocaleString()}
          </span>
          <span className="font-mono text-2xl font-black text-accent leading-none pb-0.5">{stat.suffix}</span>
        </div>
        <p className="mt-2 font-bold text-foreground text-sm">{stat.label}</p>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{stat.sublabel}</p>
      </div>
    </div>
  )
}

export function StatsCounter() {
  return (
    <section className="relative border-t border-b border-accent/10 bg-secondary/30 py-16 lg:py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-20" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-accent pointer-events-none absolute left-1/4 top-0 h-64 w-64 opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Platform Metrics</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
