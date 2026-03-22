"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Code2, Server, Layers, Globe, Cloud, Zap, Braces, Clock, BarChart3, BookOpen, TerminalSquare } from "lucide-react"
import { useStaggerReveal, useScrollReveal } from "@/hooks/use-gsap"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import { createClient } from "@/utils/supabase/client"
import { useRealtimeData } from "@/hooks/use-realtime-data"

const categories = ["All", "DSA", "Frontend", "Backend", "Fullstack", "DevOps"]

const courses = [
  { id: "CRS-001", category: "DSA", title: "DSA Mastery", level: "Beginner to Advanced", weeks: "12 weeks", lessons: 86, projects: 15, description: "Arrays, Trees, Graphs, Dynamic Programming, and 200+ interview problems with video solutions.", icon: Braces, popular: true },
  { id: "CRS-002", category: "Frontend", title: "React & Next.js", level: "Beginner", weeks: "8 weeks", lessons: 54, projects: 8, description: "Modern frontend with React 19, Server Components, App Router, and production patterns.", icon: Code2, popular: true },
  { id: "CRS-003", category: "Fullstack", title: "Fullstack Next.js", level: "Intermediate", weeks: "10 weeks", lessons: 68, projects: 10, description: "Server actions, database integration, Supabase auth, Stripe payments, and deployment.", icon: Layers, popular: false },
  { id: "CRS-004", category: "Backend", title: "System Design", level: "Advanced", weeks: "12 weeks", lessons: 42, projects: 6, description: "Scalable patterns, microservices, message queues, load balancing for production.", icon: Globe, popular: false },
  { id: "CRS-005", category: "Backend", title: "Node.js & APIs", level: "Intermediate", weeks: "8 weeks", lessons: 58, projects: 9, description: "REST, GraphQL, WebSockets, authentication, and microservice patterns with Node.js.", icon: Server, popular: false },
  { id: "CRS-006", category: "DevOps", title: "CI/CD & Cloud", level: "Advanced", weeks: "10 weeks", lessons: 44, projects: 7, description: "AWS, Docker, Kubernetes, GitHub Actions, and automated pipeline engineering.", icon: Cloud, popular: false },
  { id: "CRS-007", category: "DSA", title: "Competitive Programming", level: "Expert", weeks: "16 weeks", lessons: 120, projects: 25, description: "Advanced DSA, contest strategies, segment trees, suffix arrays, and Codeforces prep.", icon: Zap, popular: false },
  { id: "CRS-008", category: "Fullstack", title: "Performance Engineering", level: "Expert", weeks: "8 weeks", lessons: 36, projects: 5, description: "Profiling, optimization, edge computing, Web Vitals mastery, and production debugging.", icon: BarChart3, popular: false },
]

export function Courses() {
  const [filter, setFilter] = useState("All")
  const [initialCourses, setInitialCourses] = useState<CourseType[]>([])
  const supabase = createClient()

  const { data: liveCourses } = useRealtimeData<CourseType>("courses", initialCourses)
  const [userTier, setUserTier] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single()
        setUserTier(profile?.subscription_tier || "free")
      }
      const { data, error } = await supabase.from("courses").select("*, modules(count)").eq("is_published", true)
      const safeData = data || []
      const mapped = safeData.map(c => ({
        ...c, category: c.category || "Programming", level: c.difficulty || "Self-Paced",
        weeks: `${c.duration_hours} hours`, lessons: 0, projects: 0, icon: TerminalSquare
      }))
      mapped.unshift({ id: "java", title: "Java for Beginners", description: "Master the fundamentals of Java, from variables and control flow to object-oriented programming concepts.", category: "languages", level: "Beginner", weeks: "10 Weeks", lessons: 26, projects: 1, icon: TerminalSquare, is_premium: false, slug: "java" } as any)
      mapped.unshift({ id: "java-advanced", title: "Java Advanced: Architecture & Frameworks", description: "Master Design Patterns, Concurrency, JVM Internals, and Spring Boot to engineer production-ready Java applications.", category: "languages", level: "Advanced", weeks: "14 Weeks", lessons: 28, projects: 3, icon: TerminalSquare, is_premium: false, slug: "java-advanced" } as any)
      mapped.unshift({ id: "java-intermediate", title: "Java Intermediate: Core & DSA", description: "Deep dive into Core Java architectures, Generics, Collections Framework, and Data Structures & Algorithms.", category: "languages", level: "Intermediate", weeks: "12 Weeks", lessons: 30, projects: 2, icon: TerminalSquare, is_premium: false, slug: "java-intermediate" } as any)
      mapped.unshift({ id: "DSA-H-001", title: "DSA for Beginners", description: "Start your DSA journey from scratch. Chapter 1 teaches you to think like a programmer — algorithms, pseudocode, and flowcharts.", category: "DSA", level: "Beginner", weeks: "Self-Paced", lessons: 10, projects: 0, icon: Braces, is_premium: false, slug: "dsa-custom" } as any)
      mapped.unshift({ id: "DSA-H-002", title: "DSA Intermediate: Core Data Structures", description: "Master the foundational structures that power scalable systems. Covers Linked Lists, Hash Tables, Trees, Graphs, and Greedy Algorithms.", category: "DSA", level: "Intermediate", weeks: "Self-Paced", lessons: 54, projects: 0, icon: Braces, is_premium: false, slug: "dsa-intermediate" } as any)
      mapped.unshift({ id: "DSA-H-003", title: "DSA Advanced: Algorithmic Paradigms", description: "Conquer Dynamic Programming, Trees, Graphs, and master Technical Interviews.", category: "DSA", level: "Advanced", weeks: "Self-Paced", lessons: 47, projects: 0, icon: Braces, is_premium: false, slug: "dsa-advanced" } as any)
      setInitialCourses(mapped as any)
    }
    fetchCourses()
  }, [supabase])

  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 })
  const gridRef = useStaggerReveal<HTMLDivElement>(".course-card", { y: 40, duration: 0.6, stagger: 0.08 })

  const filtered = filter === "All" ? liveCourses : liveCourses.filter((c) => c.category === filter)

  return (
    <section id="courses" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" aria-hidden="true" />
      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2 border-accent/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-2 text-accent">
            <BookOpen className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Programs</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Our Curriculum
              </h2>
              <SectionBot variant="courses" className="hidden md:inline-flex mb-1" />
              <RobotDock id="courses" label="STUDY-BOT" className="hidden lg:flex h-[200px] w-[160px] shrink-0 mb-1" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              <span className="font-mono font-bold text-accent">{filtered.length}</span> courses designed by senior engineers to take you from fundamentals to production.
            </p>
          </div>

          {/* Filter pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                suppressHydrationWarning
                className={`relative px-4 py-2 font-mono text-sm font-medium transition-all duration-200 ${filter === cat
                    ? "text-accent-foreground"
                    : "border border-border bg-secondary/50 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  }`}
              >
                {filter === cat && (
                  <span className="absolute inset-0 bg-accent shadow-[0_0_12px_rgba(242,103,34,0.3)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)" }} />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} userTier={userTier} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface CourseType {
  id: string; title: string; description: string; is_premium?: boolean; thumbnail?: string;
  category?: string; level?: string; weeks?: string; lessons?: number; projects?: number;
  icon?: React.ComponentType<{ className?: string }>
}

function CourseCard({ course, userTier }: { course: CourseType; userTier: string | null }) {
  const isPython = Boolean(course.title?.toLowerCase().includes("py"))
  const isJava = Boolean(course.title?.toLowerCase().includes("java"))
  const isPremiumLocked = course.is_premium && userTier !== "architect"
  const courseSlug = (course as any).slug || course.id
  const href = isPremiumLocked ? "/pricing" : (
    courseSlug === "dsa-custom" ? "/programs/dsa" :
      courseSlug === "dsa-intermediate" ? "/programs/dsa-intermediate" :
        courseSlug === "dsa-advanced" ? "/programs/dsa-advanced" :
          courseSlug === "java" ? "/programs/java" :
            courseSlug === "java-intermediate" ? "/programs/java-intermediate" :
              courseSlug === "java-advanced" ? "/programs/java-advanced" :
                `/courses/${courseSlug}/learn`
  )

  const accentColor = isJava ? "#a855f7" : isPython ? "#facc15" : "#f26722"
  const borderClass = isJava ? "border-[#a855f7]/40 hover:border-[#a855f7]/70" : isPython ? "border-[#facc15]/40 hover:border-[#facc15]/70" : "border-border hover:border-accent/50"

  return (
    <Link
      href={href}
      className={`course-card cyber-corner group relative flex flex-col overflow-hidden border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-card card-interactive block ${borderClass}`}
    >
      <CardBody course={course} isPython={isPython} isJava={isJava} isPremiumLocked={!!isPremiumLocked} accentColor={accentColor} />
    </Link>
  )
}

function CardBody({ course, isPython, isJava, isPremiumLocked, accentColor }: {
  course: CourseType; isPython: boolean; isJava?: boolean; isPremiumLocked?: boolean; accentColor: string
}) {
  const IconComponent = course.icon || TerminalSquare
  const iconColor = isJava ? "text-[#a855f7]" : isPython ? "text-[#facc15]" : "text-accent"
  const iconBg = isJava ? "border-[#a855f7]/30 bg-[#a855f7]/10 group-hover:bg-[#a855f7]/20" : isPython ? "border-[#facc15]/30 bg-[#facc15]/10 group-hover:bg-[#facc15]/20" : "border-accent/20 bg-accent/10 group-hover:bg-accent/20"
  const categoryColor = isJava ? "text-[#a855f7]/80" : isPython ? "text-[#facc15]/80" : "text-muted-foreground"
  const borderBottom = isJava ? "border-[#a855f7]/20" : isPython ? "border-[#facc15]/20" : "border-border"

  return (
    <>
      {/* Gradient top accent */}
      <div className="h-0.5 w-full overflow-hidden" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}>
        <div className="h-full w-0 transition-all duration-700 group-hover:w-full" style={{ background: accentColor }} />
      </div>

      {/* Premium badge */}
      {course.is_premium && (
        <div
          className={`absolute right-0 top-3 z-10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isPremiumLocked ? "bg-muted-foreground/20 text-muted-foreground" : isJava ? "bg-[#a855f7] text-white" : isPython ? "bg-[#facc15] text-black" : "bg-accent text-accent-foreground"}`}
          style={{ clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          {isPremiumLocked ? "🔒 Locked" : "Premium"}
        </div>
      )}

      {/* ID tag */}
      <div className="absolute left-3 top-3 font-mono text-[9px] text-muted-foreground/25">{course.id}</div>

      {/* Icon header */}
      <div className={`flex items-center gap-3 border-b px-5 py-4 pt-8 ${borderBottom}`}>
        <div className={`flex h-10 w-10 items-center justify-center border transition-all duration-300 shrink-0 ${iconBg}`}>
          <IconComponent className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="w-full min-w-0">
          <span className={`block font-mono text-[10px] font-semibold uppercase tracking-widest ${categoryColor}`}>{course.category}</span>
          <h3 className="text-sm font-bold text-foreground group-hover:text-foreground transition-colors truncate">{course.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.weeks}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons}</span>
          <span className="flex items-center gap-1"><Code2 className="h-3 w-3" />{course.projects}</span>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between border-t px-5 py-3 ${borderBottom}`}>
        <span className={`px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${isJava ? "border border-[#a855f7]/30 bg-[#a855f7]/10 text-[#a855f7]" :
            isPython ? "border border-[#facc15]/30 bg-[#facc15]/10 text-[#facc15]" :
              course.level === "Beginner" || course.level === "Beginner to Advanced" ? "border border-success/20 bg-success/10 text-success" :
                course.level === "Intermediate" ? "border border-info/20 bg-info/10 text-info" :
                  course.level === "Advanced" ? "border border-accent/20 bg-accent/10 text-accent" :
                    "border border-foreground/20 bg-foreground/10 text-foreground"
          }`}>
          {course.level}
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2 ${iconColor}`}>
          Enroll <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {/* Bottom accent slide */}
      <div className="h-0.5 w-full overflow-hidden">
        <div className="h-full w-0 transition-all duration-700 group-hover:w-full" style={{ background: accentColor }} />
      </div>
    </>
  )
}
