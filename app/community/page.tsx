import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MessageSquare, Github } from "lucide-react"

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="h-[68px]" />

            <div className="flex-1 flex flex-col items-center justify-center py-24 px-5">
                <div className="mx-auto max-w-3xl text-center space-y-8">
                    <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl uppercase cyber-glitch">
                        <span className="text-accent">Global</span> Network
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Join thousands of elite developers in our private community. Share knowledge, build projects, and collaborate.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center p-8 bg-card border border-border hover:border-accent/50 transition-colors">
                            <MessageSquare className="w-12 h-12 mb-4 text-[#5865F2] group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-2">Discord Server</h3>
                            <p className="text-sm text-muted-foreground">Real-time chat, voice channels, and live events.</p>
                        </a>

                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center p-8 bg-card border border-border hover:border-foreground/50 transition-colors">
                            <Github className="w-12 h-12 mb-4 text-foreground group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-2">GitHub Org</h3>
                            <p className="text-sm text-muted-foreground">Contribute to open-source projects and assignments.</p>
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
