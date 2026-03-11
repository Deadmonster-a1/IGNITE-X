"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, ChevronRight, ChevronDown, BookOpen, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllCourses, getCourseContent } from "@/app/actions/courses"
import { getUserProfile } from "@/app/actions/user"
import { Navbar } from "@/components/navbar"
import { useState, useEffect, use } from "react"

export default function CourseLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)
    const pathname = usePathname()
    const [openModule, setOpenModule] = useState<string>("")
    const [courseModules, setCourseModules] = useState<any[] | null>(null)

    const [userProfile, setUserProfile] = useState<any>(null)

    // Load dynamic course structuring and user info
    useEffect(() => {
        async function loadLayoutData() {
            try {
                const profile = await getUserProfile()
                if (profile) setUserProfile(profile)

                const allCourses = await getAllCourses()
                if (allCourses && allCourses.length > 0) {
                    // Match the course by the slug from params, fallback to first if not found
                    const course = allCourses.find((c: any) => c.slug === slug) || allCourses[0]
                    const fullCourse = await getCourseContent(course.id)
                    if (fullCourse && fullCourse.modules) {
                        setCourseModules(fullCourse.modules)
                        // Auto-open current
                        const foundModule = fullCourse.modules.find((m: any) => pathname.includes(m.id))
                        if (foundModule) setOpenModule(foundModule.id)
                        else if (fullCourse.modules.length > 0) setOpenModule(fullCourse.modules[0].id)
                    }
                }
            } catch (error) {
                console.error("Failed to load layout tree", error)
            }
        }
        loadLayoutData()
    }, [pathname])

    // XP Math
    const currentXp = userProfile?.xp || 0
    const rank = userProfile?.rank || "Initiate"
    let nextTierXp = 500
    if (currentXp >= 500) nextTierXp = 2000
    if (currentXp >= 2000) nextTierXp = 5000
    if (currentXp >= 5000) nextTierXp = 10000
    if (currentXp >= 10000) nextTierXp = 50000

    // Relative progress for the bar
    let prevTierXp = 0
    if (currentXp >= 10000) prevTierXp = 10000
    else if (currentXp >= 5000) prevTierXp = 5000
    else if (currentXp >= 2000) prevTierXp = 2000
    else if (currentXp >= 500) prevTierXp = 500

    const relativeXpInTier = currentXp - prevTierXp
    const relativeTierSize = nextTierXp - prevTierXp
    const xpPercent = Math.max(0, Math.min(100, (relativeXpInTier / relativeTierSize) * 100))

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Global LMS Navigation */}
            <Navbar />

            <div className="flex flex-1 flex-col lg:flex-row mt-[68px]">
                {/* HUD Sidebar Navigation */}
                <aside className="w-full shrink-0 border-r border-border/50 bg-[#0d1117] lg:w-80 flex flex-col h-full lg:min-h-[calc(100vh-68px)]">

                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-border/30 p-5 bg-gradient-to-br from-background to-[#0d1117]">
                        <div className="bg-accent/10 p-2 rounded-md border border-accent/20">
                            <Terminal className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-mono text-sm font-black uppercase tracking-widest text-foreground">
                                {slug.replace("-", " ")} Syllabus
                            </h2>
                            <p className="text-[10px] uppercase font-mono text-muted-foreground/60 tracking-widest">ARC . SYS.INDEX</p>
                        </div>
                    </div>

                    {/* Gamified Persistent XP Tracker */}
                    <div className="px-5 py-4 border-b border-border/50 bg-accent/5 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-black">Current Rank</span>
                            <span className="font-mono text-xs font-bold text-accent">{rank}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-black tracking-tighter text-foreground">{currentXp}</span>
                            <span className="text-xs font-bold text-muted-foreground/50">/ {nextTierXp} XP</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-1.5 w-full bg-[#050505] overflow-hidden rounded-full shadow-inner border border-border/30">
                            <div className="h-full bg-accent relative transition-all duration-1000 ease-out" style={{ width: `${xpPercent}%`, boxShadow: '0 0 10px rgba(168,85,247,0.8)' }}>
                                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/40 blur-[1px]" />
                            </div>
                        </div>
                        <p className="mt-2 text-[9px] font-mono text-muted-foreground uppercase opacity-70 tracking-widest leading-relaxed">System Optimization Level Progress</p>
                    </div>

                    {/* Accordion Curriculum List */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-2">
                        {!courseModules ? (
                            <div className="flex justify-center p-5 opacity-50"><Terminal className="h-5 w-5 animate-pulse text-accent" /></div>
                        ) : courseModules.map((module: any) => {
                            const isOpen = openModule === module.id;

                            return (
                                <div key={module.id} className="rounded-md overflow-hidden bg-background/50 border border-border/30 transition-colors hover:border-border/60">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => setOpenModule(isOpen ? "" : module.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 text-left transition-colors",
                                            isOpen ? "bg-secondary/40" : "hover:bg-secondary/20"
                                        )}
                                    >
                                        <div>
                                            <h3 className={cn(
                                                "text-xs font-black uppercase tracking-widest font-mono",
                                                isOpen ? "text-accent" : "text-foreground"
                                            )}>
                                                {module.title}
                                            </h3>
                                            {!isOpen && (
                                                <p className="text-[10px] text-muted-foreground/60 mt-1 truncate max-w-[200px]">{module.description}</p>
                                            )}
                                        </div>
                                        <ChevronDown className={cn(
                                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                            isOpen && "transform rotate-180 text-accent"
                                        )} />
                                    </button>

                                    {/* Accordion Body (Lessons) */}
                                    {isOpen && (
                                        <div className="bg-[#050505] border-t border-border/30 p-2 border-l-2 border-l-accent/50">
                                            <ul className="space-y-0.5">
                                                {module.lessons.map((lesson: any) => {
                                                    const href = `/courses/${slug}/learn/${module.id}/${lesson.id}`
                                                    const isActive = pathname === href

                                                    return (
                                                        <li key={lesson.id}>
                                                            <Link
                                                                href={href}
                                                                className={cn(
                                                                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-xs transition-all",
                                                                    isActive
                                                                        ? "bg-accent/10 font-bold text-foreground border border-accent/20 shadow-[0_0_10px_rgba(168,85,247,0.05)]"
                                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground/90 font-medium"
                                                                )}
                                                            >
                                                                {isActive ? (
                                                                    <ChevronRight className="h-3.5 w-3.5 text-accent animate-pulse" />
                                                                ) : (
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-accent/50 transition-colors ml-1" />
                                                                )}
                                                                <span className="truncate">{lesson.title}</span>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 relative overflow-hidden flex flex-col bg-background">
                    {children}
                </main>
            </div>
        </div>
    )
}
