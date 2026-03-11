import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Server, ArrowRight } from "lucide-react"

export default function BackendEngineeringPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute inset-0 z-0">
                    <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20" />
                    </svg>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
                        <div className="mb-8 p-4 bg-secondary border border-border rounded-lg shadow-[0_0_15px_rgba(var(--foreground),0.1)]">
                            <Server className="h-10 w-10 text-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Backend <span className="text-accent">Engineering</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Build robust APIs, handle massive databases, and master cloud deployments. Node.js, Python, PostgreSQL, Redis, and more.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-none bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
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
