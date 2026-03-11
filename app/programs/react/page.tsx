import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Code2, ArrowRight } from "lucide-react"

export default function ReactProgramPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            React & <span className="text-accent">Next.js</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Build high-performance, SEO-optimized web applications with the power of React 18, Next.js 14 App Router, NextAuth, and Tailwind CSS.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-none bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex items-center gap-2"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                            >
                                Enroll Now <ArrowRight className="w-4 h-4" />
                            </a>
                            <a href="#" className="flex items-center gap-2 text-sm font-semibold leading-6 text-white hover:text-accent transition-colors">
                                <Code2 className="w-4 h-4" /> View Syllabus
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
