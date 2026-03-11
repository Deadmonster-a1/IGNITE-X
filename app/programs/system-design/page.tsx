import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Layers, ArrowRight } from "lucide-react"

export default function SystemDesignPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="relative flex h-16 w-16 items-center justify-center bg-card border border-accent/50 shadow-[0_0_30px_rgba(var(--accent),0.2)]">
                                <Layers className="h-8 w-8 text-accent" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            System <span className="text-accent">Design</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Architect scalable, distributed, and fault-tolerant systems. Learn to design systems that handle millions of users with ease.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-none bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex items-center gap-2"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                            >
                                Enroll Now <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
