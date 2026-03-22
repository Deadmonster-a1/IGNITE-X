import Link from "next/link"
import { Terminal, BookOpen, ChevronRight, Target, Zap, TrendingUp, Sparkles, Server } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { javaCourseCurriculum, javaCourseInfo } from "@/lib/java-course-data"

export default function JavaLandingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground" style={{ '--accent': '#a855f7' } as React.CSSProperties}>
            <Navbar />
            <div className="h-[68px]" />

            {/* ════════ HERO SECTION ════════ */}
            <section className="relative overflow-hidden border-b border-border">
                {/* Background layers */}
                <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/8 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                {/* Corner decorations */}
                <div className="pointer-events-none absolute left-6 top-6 h-12 w-12 border-l-2 border-t-2 border-accent/20" />
                <div className="pointer-events-none absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2 border-accent/20" />

                <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Left: Text */}
                        <div className="flex-1 text-center lg:text-left animate-[fadeInUp_0.8s_ease-out]">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-accent/30 bg-accent/10 text-accent font-mono text-xs font-bold uppercase tracking-widest"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" }}>
                                <BookOpen className="h-3.5 w-3.5" />
                                Free Course • {javaCourseInfo.totalLessons} Lessons
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                                <span className="text-foreground">Java for</span>
                                <br />
                                <span className="relative inline-block mt-2">
                                    <span className="bg-gradient-to-r from-accent via-[#c084fc] to-accent bg-clip-text text-transparent">
                                        Beginners
                                    </span>
                                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0" />
                                </span>
                            </h1>

                            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed lg:border-l-2 lg:border-accent/20 lg:pl-4">
                                {javaCourseInfo.subtitle}
                            </p>

                            {/* CTA */}
                            <div className="mt-10 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/programs/java/course"
                                    className="group relative flex items-center gap-3 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                                >
                                    <Terminal className="h-4 w-4" />
                                    Start Learning
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                                </Link>
                                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                    No signup needed
                                </span>
                            </div>
                        </div>

                        {/* Right: Stats card */}
                        <div className="w-full max-w-sm lg:max-w-md animate-[fadeInRight_0.8s_ease-out_0.3s_both]">
                            <div className="relative border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
                                {/* Glow */}
                                <div className="absolute -right-10 -top-10 h-32 w-32 bg-accent/15 blur-[60px] rounded-full" />
                                <div className="absolute -left-10 -bottom-10 h-24 w-24 bg-[#c084fc]/10 blur-[50px] rounded-full" />

                                {/* Header */}
                                <div className="border-b border-border/50 bg-secondary/30 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center border border-accent/30 bg-accent/10">
                                                <Server className="h-5 w-5 text-accent" />
                                            </div>
                                            <div>
                                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">Core Module</span>
                                                <span className="text-sm font-bold text-foreground">Java Engine</span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 border border-success/20 bg-success/10 text-success font-mono text-[10px] font-bold uppercase tracking-widest">
                                            Free
                                        </span>
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-[1px] bg-border/30">
                                    {[
                                        { icon: BookOpen, label: "Lessons", value: javaCourseInfo.totalLessons.toString(), color: "text-accent" },
                                        { icon: Target, label: "Difficulty", value: javaCourseInfo.difficulty, color: "text-success" },
                                        { icon: Zap, label: "Projects", value: "1", color: "text-[#c084fc]" },
                                        { icon: TrendingUp, label: "Duration", value: javaCourseInfo.estimatedTime, color: "text-info" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-card/80 p-4 flex items-center gap-3 group hover:bg-secondary/30 transition-colors">
                                            <stat.icon className={`h-4 w-4 \${stat.color} shrink-0`} />
                                            <div>
                                                <span className="block font-mono text-[9px] uppercase text-muted-foreground tracking-widest">{stat.label}</span>
                                                <span className="text-sm font-bold text-foreground">{stat.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Topics preview */}
                                <div className="px-6 py-4 border-t border-border/30">
                                    <span className="font-mono text-[9px] uppercase text-muted-foreground tracking-widest block mb-3">What You'll Learn</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["JDK/JVM", "OOP", "Data Types", "Arrays", "Control Flow", "Methods", "Recursion", "Strings"].map(tag => (
                                            <span key={tag} className="px-2 py-1 border border-border bg-secondary/30 font-mono text-[10px] text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom accent */}
                                <div className="h-1 w-full bg-gradient-to-r from-accent via-[#c084fc] to-accent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ CHAPTER OVERVIEW CARDS ════════ */}
            <section className="relative bg-secondary/10 py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent block mb-4">Complete Syllabus</span>
                        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            {javaCourseInfo.totalLessons} Lessons across {javaCourseCurriculum[0].chapters.length} Chapters
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {javaCourseCurriculum[0].chapters.map((chapter, i) => (
                            <Link
                                href="/programs/java/course"
                                key={chapter.id}
                                className="group relative flex flex-col p-6 border border-border bg-card/50 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-accent/20"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary/50 px-2 py-1">Phase {i + 1}</span>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">{chapter.title.split('—')[1]?.trim() || chapter.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                                    {chapter.concepts.length} Concepts • {chapter.problems?.length || 0 + (chapter.missions?.length || 0)} Practice Problems
                                </p>

                                {/* Bottom accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                                    <div className="h-full w-0 group-hover:w-full transition-all duration-500 bg-accent" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ START LEARNING BOTTOM CTA ════════ */}
            <section className="relative py-20 border-t border-border bg-background">
                <div className="mx-auto max-w-4xl px-5 text-center">
                    <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Ready to Master Java?</h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        Jump into Chapter 1 and explore the power of object-oriented programming. The course is free and open to everyone.
                    </p>
                    <Link
                        href="/programs/java/course"
                        className="inline-flex items-center gap-3 bg-accent px-10 py-5 text-sm font-black uppercase tracking-widest text-[#050505] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%)" }}
                    >
                        <Sparkles className="h-5 w-5" />
                        Enter Course Viewer
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
