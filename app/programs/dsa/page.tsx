import { Navbar } from "@/components/navbar"
import { DSAVisualizerWrapper } from "@/components/dsa-visualizer-wrapper"
import { DSAConcepts } from "@/components/dsa-concepts"
import { Footer } from "@/components/footer"
import { Terminal } from "lucide-react"

export default function DSAPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="border-b border-border bg-card/40 relative overflow-hidden">
                {/* Abstract Data Patterns Background */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-accent rounded-full blur-[100px]" />
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="dsaPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 40L40 0M0 0L40 40" stroke="currentColor" strokeWidth="0.5" className="text-accent" fill="none" />
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#dsaPattern)" />
                    </svg>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 lg:py-32 flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center border border-accent bg-accent/10" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                        <Terminal className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight md:text-6xl text-foreground">
                        DSA <span className="text-accent">Mastery</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Master algorithms and data structures with interactive visualizations. From Big-O to Dynamic Programming, break down complexities into executable patterns.
                    </p>
                </div>
            </div>

            <DSAVisualizerWrapper />
            <DSAConcepts />

            <Footer />
        </main>
    )
}
