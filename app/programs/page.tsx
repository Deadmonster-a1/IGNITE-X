import { Navbar } from "@/components/navbar"
import { Courses } from "@/components/courses"
import { Footer } from "@/components/footer"

export default function ProgramsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="py-24 px-5">
                <div className="mx-auto max-w-7xl text-center mb-16">
                    <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-6 cyber-glitch">
                        FULL CATALOG
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl uppercase">
                        Training <span className="text-accent">Programs</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Elite-tier curriculum designed to upgrade your skills to architecture level.
                    </p>
                </div>
            </div>

            <Courses />

            <Footer />
        </main>
    )
}
