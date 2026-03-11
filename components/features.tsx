"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useScrollReveal } from "@/hooks/use-gsap"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import {
  Users,
  Rocket,
  Monitor,
  Briefcase,
  MessageCircle,
  Braces,
  Target,
  Lightbulb,
} from "lucide-react"

interface PlatformStats {
  avgRating: string
  members: string
  projects: string
  paths: string
}

export function Features({ stats }: { stats?: PlatformStats }) {
  const features = [
    {
      id: "01",
      title: "1-on-1 Mentorship",
      description:
        "Weekly personalized sessions with senior engineers from Google, Meta, and Stripe. Get code reviews, career guidance, and real accountability.",
      icon: Users,
      metric: stats?.avgRating || "4.9/5",
      metricLabel: "Avg. Rating",
    },
    {
      id: "02",
      title: "DSA Interview Prep",
      description:
        "200+ curated problems with video walkthroughs covering arrays, trees, graphs, DP, and more. Mock interviews with real FAANG interviewers.",
      icon: Braces,
      metric: "200+",
      metricLabel: "Problems",
    },
    {
      id: "03",
      title: "Real-World Projects",
      description:
        "Build production apps from day one. Deploy to Vercel, integrate Stripe payments, implement auth, and handle real user traffic.",
      icon: Rocket,
      metric: stats?.projects || "12+",
      metricLabel: "Shipped Apps",
    },
    {
      id: "04",
      title: "Live Coding Sessions",
      description:
        "Daily live-coding workshops where instructors build features in real-time. Pair-program, ask questions, learn debugging techniques.",
      icon: Monitor,
      metric: "5x",
      metricLabel: "Per Week",
    },
    {
      id: "05",
      title: "Career Accelerator",
      description:
        "Resume reviews, mock interviews, portfolio building, and direct introductions to hiring managers at top-tier companies.",
      icon: Briefcase,
      metric: "94%",
      metricLabel: "Placement",
    },
    {
      id: "06",
      title: "Community Network",
      description:
        "Join a private cohort of ambitious developers. Collaborate on projects, share knowledge, and build lifelong professional connections.",
      icon: MessageCircle,
      metric: stats?.members || "2.4K+",
      metricLabel: "Members",
    },
    {
      id: "07",
      title: "Algorithm Visualizer",
      description:
        "Interactive visual tool to step through sorting algorithms, graph traversals, and tree operations at your own pace.",
      icon: Target,
      metric: "50+",
      metricLabel: "Visualizations",
    },
    {
      id: "08",
      title: "Learning Paths",
      description:
        "Personalized roadmaps that adapt to your skill level, career goals, and learning pace. Never wonder what to learn next.",
      icon: Lightbulb,
      metric: stats?.paths || "8",
      metricLabel: "Paths",
    },
  ]

  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 })
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".feature-card")
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" className="scan-line relative border-y border-accent/10 bg-secondary/30 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-30" aria-hidden="true" />
      {/* Cyberpunk corners */}
      <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-accent/15" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-accent/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-2 text-accent">
            <Target className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Experience</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Why ASCI Works
              </h2>
              <SectionBot variant="features" className="hidden md:inline-flex mb-1" />
              <RobotDock
                id="features"
                label="SCAN-BOT"
                className="hidden lg:flex h-[200px] w-[160px] shrink-0 mb-1"
              />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Everything you need to go from beginner to hired engineer, in one cohort-based program.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const isWide = i < 2
            return (
              <div
                key={feature.id}
                className={`feature-card cyber-corner group relative flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(242,103,34,0.15)] hover:border-accent/50 z-10 hover:z-20 ${isWide ? "lg:col-span-2" : ""
                  }`}
              >
                {/* ID watermark */}
                <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted-foreground/20">
                  [{feature.id}]
                </div>

                <div className={`flex flex-1 flex-col ${isWide ? "p-6 lg:p-8" : "p-5"}`}>
                  {/* Top row: icon + metric */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center border border-accent/20 bg-accent/10 transition-all group-hover:bg-accent/15 group-hover:border-accent/50">
                      <feature.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold text-foreground ${isWide ? "text-2xl" : "text-lg"}`}>
                        {feature.metric}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {feature.metricLabel}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <h3 className={`font-bold tracking-tight text-foreground ${isWide ? "text-xl" : "text-base"}`}>
                      {feature.title}
                    </h3>
                    <p className={`mt-2 leading-relaxed text-muted-foreground ${isWide ? "text-sm" : "text-xs"}`}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Accent bar at bottom */}
                  <div className="mt-auto pt-5">
                    <div className="h-0.5 w-full overflow-hidden bg-border">
                      <div className="h-full w-0 bg-accent transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
