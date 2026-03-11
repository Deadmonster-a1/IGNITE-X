import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function ExperiencePage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="py-24 px-5 bg-card/50">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl uppercase border-b-2 border-accent/20 pb-6 inline-block">
                        The Learning <span className="text-accent">Experience</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Immerse yourself in a cyberpunk-themed, code-first environment. Our platform is built by developers, for developers.
                    </p>
                </div>
            </div>

            <Features />

            <Footer />
        </main>
    )
}
