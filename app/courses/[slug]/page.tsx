"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TerminalSquare, BookOpen, Layers, Laptop, Code2, Youtube, GraduationCap, ChevronRight, Zap } from "lucide-react"
import { PythonConcepts } from "@/components/python-concepts"
import { useStaggerReveal, useScrollReveal } from "@/hooks/use-gsap"
import { ScrollRobotWrapper } from "@/components/scroll-robot-wrapper"
import Link from "next/link"
import { use } from "react"

const resources = [
    {
        category: "Beginner Friendly (Clear, Structured, Practical)",
        icon: BookOpen,
        color: "#38bdf8", // info
        links: [
            { name: "Real Python", url: "https://realpython.com", desc: "Project tutorials that actually build usable apps." },
            { name: "Python.org Official Docs", url: "https://docs.python.org/3/tutorial/", desc: "The canonical place to learn syntax and core concepts." },
            { name: "W3Schools Python", url: "https://www.w3schools.com/python/", desc: "Simple, interactive, perfect when you're new and confused." },
        ]
    },
    {
        category: "Interactive & Hands-On",
        icon: Laptop,
        color: "#a855f7", // accent
        links: [
            { name: "Codecademy", url: "https://www.codecademy.com/learn/learn-python-3", desc: "Interactive in-browser practice with instant feedback." },
            { name: "SoloLearn", url: "https://www.sololearn.com/Course/Python/", desc: "Bite-sized lessons + community quizzes you can do on phone." },
            { name: "DataCamp", url: "https://www.datacamp.com/courses/intro-to-python-for-data-science", desc: "Interactive plus focus on Data Science; great for portfolio skills." },
        ]
    },
    {
        category: "Courses with Certificates",
        icon: GraduationCap,
        color: "#22c55e", // success
        links: [
            { name: "Coursera (Python for Everybody)", url: "https://www.coursera.org", desc: "University of Michigan. Highly rated beginner series." },
            { name: "edX (Intro to Python)", url: "https://www.edx.org", desc: "University-level curriculum with verified completion options." },
            { name: "Udemy (Complete Python Bootcamp)", url: "https://www.udemy.com", desc: "One-time purchase, lifetime access, tons of projects." },
        ]
    },
    {
        category: "Advanced / Specialized Python",
        icon: Code2,
        color: "#ef4444", // error
        links: [
            { name: "LeetCode", url: "https://leetcode.com", desc: "Algorithms & interview prep with Python." },
            { name: "Project Euler", url: "https://projecteuler.net", desc: "Math + logic problems to level up Python thinking." },
            { name: "Kaggle Learn Python", url: "https://www.kaggle.com/learn/python", desc: "Focused on Data Science + ML — free micro-courses with datasets." },
        ]
    },
    {
        category: "Books & Video Channels",
        icon: Youtube,
        color: "#f59e0b", // warning/yellow
        links: [
            { name: "Automate the Boring Stuff (Al Sweigart)", url: "#", desc: "Great for real tasks (web scraping, automation)." },
            { name: "Fluent Python (Luciano Ramalho)", url: "#", desc: "Advanced topics for pros." },
            { name: "YouTube Channels", url: "#", desc: "CS Dojo, Corey Schafer, Tech With Tim, Sentdex." },
        ]
    },
]

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const heroRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.8 })
    const blueprintsRef = useStaggerReveal<HTMLDivElement>(".resource-card", {
        y: 40,
        duration: 0.6,
        stagger: 0.1,
    })
    const clearanceRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.8 })

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent overflow-x-hidden">
            <Navbar />
            <div className="h-[68px]" />

            {/* Hero Header */}
            <section className="relative overflow-hidden border-b border-border bg-card/30 backdrop-blur-sm py-24 lg:py-32">
                <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-[0.2]" aria-hidden="true" />
                <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div ref={heroRef} className="relative mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-[#facc15]/10 border border-[#facc15]/20 shadow-[0_0_50px_rgba(250,204,21,0.15)] group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#facc15]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <TerminalSquare className="h-12 w-12 text-[#facc15] relative z-10" />
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6 animate-pulse">
                            <Zap className="h-3 w-3 fill-accent" />
                            Access Granted: Senior Tier
                        </div>

                        <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-6xl lg:text-8xl">
                            <span className="text-foreground inline-block">THE {slug.replace("-", " ")}</span>{" "}
                            <span className="bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent block mt-4 text-3xl lg:text-5xl tracking-widest font-mono">
                                [ Architect Edition ]
                            </span>
                        </h1>

                        <p className="mt-8 max-w-3xl text-xl text-muted-foreground leading-relaxed">
                            This is not a beginner tutorial series. It is a systems-building roadmap that transforms you from learning syntax to architecting, deploying, and scaling production-ready applications.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                            <Link
                                href={`/courses/${slug}/learn`}
                                className="group relative inline-flex items-center gap-3 overflow-hidden bg-accent px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest text-accent-foreground transition-all hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                            >
                                <TerminalSquare className="h-5 w-5" />
                                Enter The Spawn Point
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                            </Link>

                            <a href="#blueprints" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-border pb-1">
                                Study The Blueprints
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Blueprints Grid */}
            <section id="blueprints" className="relative py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-accent" />
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">Intelligence Grid</span>
                        </div>
                        <h2 className="flex items-center gap-4 font-mono text-3xl font-black uppercase tracking-tight text-foreground">
                            <Layers className="h-8 w-8 text-accent" />
                            System Blueprints
                        </h2>
                        <p className="mt-4 text-base text-muted-foreground max-w-2xl">
                            Curated intelligence categorized by operation type. Before you build, study the architecture of modern software ecosystems.
                        </p>
                    </div>

                    <div ref={blueprintsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((res, i) => (
                            <div
                                key={i}
                                className="resource-card group relative flex flex-col border border-border bg-card/50 backdrop-blur-md p-8 transition-all hover:border-accent/40 hover:bg-card/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] shadow-sm"
                            >
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 border border-border group-hover:border-accent/30 transition-colors">
                                        <res.icon className="h-6 w-6" style={{ color: res.color }} />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-accent transition-colors">{res.category}</h3>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {res.links.map((link, j) => (
                                        <div key={j} className="flex flex-col gap-2 relative pl-4 border-l border-border group-hover/link:border-accent transition-colors">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link font-mono text-sm font-bold flex items-center gap-2 hover:text-white transition-colors"
                                                style={{ color: res.color }}
                                            >
                                                {link.name}
                                                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-white" />
                                            </a>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{link.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full" style={{ backgroundColor: res.color }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Concepts Interactive Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <PythonConcepts />
            </div>

            {/* Clearance Levels Section */}
            <section className="relative border-t border-border bg-[#050505] py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-cyber opacity-05 pointer-events-none" />
                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-full bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

                <div ref={clearanceRef} className="relative mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mb-20 text-center">
                        <span className="font-mono text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4 block">Operation Protocol</span>
                        <h2 className="font-mono text-4xl lg:text-6xl font-black uppercase tracking-tighter text-foreground mb-6">
                            Architect Clearance Levels
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-border" />
                            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-widest px-4 py-2 bg-secondary/30 border border-border/50">
                                [ Mandatory Mastery Required ]
                            </p>
                            <div className="h-[1px] w-12 bg-border" />
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Clearance 1 */}
                        <div className="clearance-card relative border border-info/20 bg-card/60 backdrop-blur-md p-8 border-t-4 border-t-info hover:bg-card transition-all transform hover:-translate-y-2 shadow-2xl group overflow-hidden">
                            <div className="absolute -right-8 -top-8 h-24 w-24 bg-info/10 blur-[40px] rounded-full group-hover:bg-info/20 transition-colors" />
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <TerminalSquare className="h-8 w-8 text-info" />
                            </div>
                            <span className="font-mono text-[11px] font-black text-info uppercase tracking-widest bg-info/10 px-3 py-1.5 rounded-sm inline-block">LVL 01</span>
                            <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-foreground">System Operator</h3>
                            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-info/50 to-transparent" />
                            <ul className="mt-8 space-y-4 font-mono text-xs text-muted-foreground">
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-info font-bold animate-pulse">{'>'}</span> Command Line Calculator
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-info font-bold animate-pulse">{'>'}</span> File State Automation
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-info font-bold animate-pulse">{'>'}</span> Terminal Output Engine
                                </li>
                            </ul>
                        </div>

                        {/* Clearance 2 */}
                        <div className="clearance-card relative border border-accent/20 bg-card/60 backdrop-blur-md p-8 border-t-4 border-t-accent hover:bg-card transition-all transform hover:-translate-y-3 shadow-2xl group overflow-hidden lg:-mt-4">
                            <div className="absolute -right-8 -top-8 h-24 w-24 bg-accent/10 blur-[40px] rounded-full group-hover:bg-accent/20 transition-colors" />
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Zap className="h-8 w-8 text-accent" />
                            </div>
                            <div className="absolute -right-10 bottom-10 rotate-12 opacity-[0.03] pointer-events-none">
                                <Zap className="h-64 w-64 text-accent fill-accent" />
                            </div>
                            <span className="font-mono text-[11px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-sm inline-block">LVL 02</span>
                            <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-foreground">Integration Node</h3>
                            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-accent/50 to-transparent" />
                            <ul className="mt-8 space-y-4 font-mono text-xs text-muted-foreground">
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-accent font-bold animate-pulse">{'>'}</span> Autonomous Scraping Bots
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-accent font-bold animate-pulse">{'>'}</span> FastAPI Micro-Routing
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-accent font-bold animate-pulse">{'>'}</span> SQLite Data Persistence
                                </li>
                            </ul>
                        </div>

                        {/* Clearance 3 */}
                        <div className="clearance-card relative border border-error/20 bg-card/60 backdrop-blur-md p-8 border-t-4 border-t-error hover:bg-card transition-all transform hover:-translate-y-2 shadow-2xl group overflow-hidden">
                            <div className="absolute -right-8 -top-8 h-24 w-24 bg-error/10 blur-[40px] rounded-full group-hover:bg-error/20 transition-colors" />
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Layers className="h-8 w-8 text-error" />
                            </div>
                            <span className="font-mono text-[11px] font-black text-error uppercase tracking-widest bg-error/10 px-3 py-1.5 rounded-sm inline-block">LVL 03</span>
                            <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-foreground">Master Architect</h3>
                            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-error/50 to-transparent" />
                            <ul className="mt-8 space-y-4 font-mono text-xs text-muted-foreground">
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-error font-bold animate-pulse">{'>'}</span> Predictive ML Models
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-error font-bold animate-pulse">{'>'}</span> Concurrent Event Loops
                                </li>
                                <li className="flex items-center gap-3 transition-colors group-hover:text-foreground">
                                    <span className="text-error font-bold animate-pulse">{'>'}</span> Dockerized API Fleets
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <ScrollRobotWrapper />
            <Footer />
        </main>
    )
}
