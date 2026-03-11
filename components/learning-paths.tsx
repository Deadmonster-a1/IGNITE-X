"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useScrollReveal } from "@/hooks/use-gsap"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import {
  Route, CheckCircle2, ArrowRight, Clock,
  Braces, Code2, Globe, Rocket,
  Database, Server, Cpu, BrainCircuit,
  Layout, Smartphone, Blocks
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const roadmaps = {
  fullstack: {
    id: "fullstack",
    name: "Full-Stack Engineer",
    description: "A structured 24-week path from fundamentals to getting hired.",
    phases: [
      {
        phase: "Phase 1", title: "Foundations", weeks: "Weeks 1-4",
        topics: ["JavaScript / TypeScript", "Data Structures Basics", "Arrays & Strings", "Git & GitHub"],
        icon: Code2, color: "text-info", borderColor: "border-info/30"
      },
      {
        phase: "Phase 2", title: "Core DSA", weeks: "Weeks 5-10",
        topics: ["Trees & Graphs", "Dynamic Programming", "Sorting & Searching", "Recursion & Backtracking"],
        icon: Braces, color: "text-accent", borderColor: "border-accent/30"
      },
      {
        phase: "Phase 3", title: "Full-Stack Web", weeks: "Weeks 11-18",
        topics: ["React & Next.js", "Node.js & APIs", "Databases & Auth", "Deployment & CI/CD"],
        icon: Globe, color: "text-success", borderColor: "border-success/30"
      },
      {
        phase: "Phase 4", title: "Interview Ready", weeks: "Weeks 19-24",
        topics: ["System Design", "Mock Interviews", "Portfolio Projects", "Career Coaching"],
        icon: Rocket, color: "text-accent", borderColor: "border-accent/30"
      }
    ]
  },
  frontend: {
    id: "frontend",
    name: "Frontend Architect",
    description: "Master modern UI development, performance, and interactive web experiences.",
    phases: [
      {
        phase: "Phase 1", title: "UI Fundamentals", weeks: "Weeks 1-4",
        topics: ["Semantic HTML & CSS3", "Modern JavaScript", "Responsive Design", "Accessibility (a11y)"],
        icon: Layout, color: "text-info", borderColor: "border-info/30"
      },
      {
        phase: "Phase 2", title: "React Ecosystem", weeks: "Weeks 5-10",
        topics: ["React Hooks & Context", "Next.js App Router", "State Management", "Tailwind CSS"],
        icon: Code2, color: "text-accent", borderColor: "border-accent/30"
      },
      {
        phase: "Phase 3", title: "Interactive Web", weeks: "Weeks 11-16",
        topics: ["GSAP Animations", "Framer Motion", "WebGL & Three.js", "Micro-interactions"],
        icon: Smartphone, color: "text-success", borderColor: "border-success/30"
      },
      {
        phase: "Phase 4", title: "Architecture & Perf", weeks: "Weeks 17-20",
        topics: ["Core Web Vitals", "Testing (Jest/Cypress)", "Micro-frontends", "CI/CD & Edge"],
        icon: Rocket, color: "text-accent", borderColor: "border-accent/30"
      }
    ]
  },
  backend: {
    id: "backend",
    name: "Backend Systems",
    description: "Build highly scalable, secure, and distributed server-side applications.",
    phases: [
      {
        phase: "Phase 1", title: "Backend Core", weeks: "Weeks 1-4",
        topics: ["Node.js & Express / Go", "RESTful APIs", "Authentication (JWT)", "Memory Management"],
        icon: Server, color: "text-info", borderColor: "border-info/30"
      },
      {
        phase: "Phase 2", title: "Data Engineering", weeks: "Weeks 5-10",
        topics: ["PostgreSQL & Prisma", "NoSQL (MongoDB)", "Redis Caching", "Query Optimization"],
        icon: Database, color: "text-accent", borderColor: "border-accent/30"
      },
      {
        phase: "Phase 3", title: "Distributed Systems", weeks: "Weeks 11-16",
        topics: ["Microservices", "Message Queues (Kafka)", "Docker & Containers", "gRPC & WebSockets"],
        icon: Blocks, color: "text-success", borderColor: "border-success/30"
      },
      {
        phase: "Phase 4", title: "Scale & Security", weeks: "Weeks 17-20",
        topics: ["Kubernetes", "Load Balancing", "Cloud (AWS/GCP)", "System Design Interviews"],
        icon: Cpu, color: "text-accent", borderColor: "border-accent/30"
      }
    ]
  },
  ai: {
    id: "ai",
    name: "AI & Machine Learning",
    description: "From Python fundamentals to deploying production-ready LLM agents.",
    phases: [
      {
        phase: "Phase 1", title: "Python & Data Math", weeks: "Weeks 1-5",
        topics: ["Advanced Python", "Linear Algebra & Calculus", "Pandas & NumPy", "Data Visualization"],
        icon: Code2, color: "text-info", borderColor: "border-info/30"
      },
      {
        phase: "Phase 2", title: "Core ML Algorithms", weeks: "Weeks 6-12",
        topics: ["Supervised/Unsupervised", "Regression & Trees", "Scikit-Learn", "Model Evaluation"],
        icon: BrainCircuit, color: "text-accent", borderColor: "border-accent/30"
      },
      {
        phase: "Phase 3", title: "Deep Learning", weeks: "Weeks 13-18",
        topics: ["Neural Networks", "PyTorch / TensorFlow", "CNNs & Computer Vision", "Transformers Basics"],
        icon: Cpu, color: "text-success", borderColor: "border-success/30"
      },
      {
        phase: "Phase 4", title: "Applied GenAI", weeks: "Weeks 19-24",
        topics: ["LLM Fine-tuning", "RAG Systems", "LangChain & Agents", "Deploying AI Models"],
        icon: Rocket, color: "text-accent", borderColor: "border-accent/30"
      }
    ]
  }
}

type RoadmapKey = keyof typeof roadmaps

export function LearningPaths() {
  const [activeTab, setActiveTab] = useState<RoadmapKey>("fullstack")
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 })
  const timelineRef = useRef<HTMLDivElement>(null)

  const activeRoadmap = roadmaps[activeTab]

  // Track initial render vs tab switch
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!timelineRef.current) return
    const cards = timelineRef.current.querySelectorAll(".path-card")

    const ctx = gsap.context(() => {
      // If we are just switching tabs, do a quick crossfade instead of full scroll setup
      if (hasAnimated) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        )
      } else {
        // Initial scroll-based staggered reveal
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
            }
          )
        })
        setHasAnimated(true)
      }
    }, timelineRef)

    return () => ctx.revert()
  }, [activeTab, hasAnimated])

  const handleTabChange = (key: RoadmapKey) => {
    if (key === activeTab) return
    // Simple fade out current cards before state change is optional,
    // but React's immediate re-render paired with GSAP's fromTo makes a good slide-in effect.
    setActiveTab(key)
  }

  return (
    <section id="learning-paths" className="relative py-20 lg:py-28 min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" aria-hidden="true" />
      {/* Cyberpunk corner accents */}
      <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 border-r-2 border-t-2 border-accent/10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-14 w-14 border-b-2 border-l-2 border-accent/10" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-accent">
            <Route className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Roadmap</span>
          </div>
          <h2 className="mt-3 cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Your Learning Journey
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground h-10 transition-all duration-300">
            {activeRoadmap.description}
          </p>
          <div className="mt-2 flex items-center justify-center gap-6">
            <SectionBot variant="paths" className="mb-2" />
            <RobotDock
              id="paths"
              label="NAV-BOT"
              className="hidden lg:flex h-[150px] w-[150px] shrink-0"
            />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-secondary/50 p-2 border border-border/50 rounded-sm backdrop-blur-md">
            {(Object.keys(roadmaps) as RoadmapKey[]).map((key) => {
              const roadmap = roadmaps[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`relative px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-accent shadow-[0_0_15px_rgba(242,103,34,0.4)]" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }} />
                  )}
                  <span className="relative z-10">{roadmap.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mt-8">
          {/* Center line -- dashed cyberpunk */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 border-l border-dashed border-accent/20 lg:block" aria-hidden="true" />

          <div className="flex flex-col gap-6 lg:gap-0">
            {activeRoadmap.phases.map((path, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={path.phase} className="path-card relative lg:py-6">
                  {/* Dot on center line */}
                  <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 border-2 border-accent bg-background lg:block shadow-[0_0_10px_rgba(242,103,34,0.5)]" aria-hidden="true" />

                  <div className={`flex lg:w-1/2 ${isLeft ? "lg:pr-12" : "lg:ml-auto lg:pl-12"}`}>
                    <div className={`cyber-corner flex w-full flex-col overflow-hidden border ${path.borderColor} bg-card transition-all duration-300 hover:border-accent/80 hover:shadow-[0_10px_30px_rgba(242,103,34,0.1)] hover:-translate-y-1`}>
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/30 px-5 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/20 bg-accent/10">
                          <path.icon className={`h-5 w-5 ${path.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
                            {path.phase}
                          </p>
                          <h3 className="text-lg font-bold text-foreground truncate">{path.title}</h3>
                        </div>
                        <div className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[10px] sm:text-xs text-muted-foreground bg-background px-2 py-1 border border-border/50">
                          <Clock className="h-3 w-3" />
                          {path.weeks}
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-col gap-3 px-5 py-5 bg-card/50">
                        {path.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-3 text-sm text-muted-foreground/90 font-medium group">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent/70 transition-colors group-hover:text-accent" />
                            <span className="transition-colors group-hover:text-foreground">{topic}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom accent */}
                      <div className="h-1 w-full bg-border/50">
                        <div className="h-full w-1/3 bg-accent/50 transition-all duration-700 group-hover:w-full group-hover:bg-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 flex justify-center">
            <a
              href="/programs"
              className="group flex items-center gap-3 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-accent-foreground shadow-[0_0_20px_rgba(242,103,34,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,103,34,0.4)]"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" }}
            >
              Start {activeRoadmap.name} Journey
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
