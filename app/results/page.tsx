import { Navbar } from "@/components/navbar"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function ResultsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="h-[68px]" />

            <div className="py-24 px-5">
                <div className="mx-auto max-w-7xl text-center">
                    <div className="inline-flex items-center rounded border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success mb-6 tracking-widest uppercase">
                        System Outputs
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl uppercase">
                        Proven <span className="text-success">Results</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        See how our advanced training protocols have upgraded the careers of engineers worldwide.
                    </p>
                </div>
            </div>

            <Testimonials />

            <Footer />
        </main>
    )
}
