import Link from "next/link"
import { ArrowLeft, TerminalSquare, BookOpen, Trophy } from "lucide-react"

export default function JavaBeginnersLearnPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-[50px]">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Programs
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center border border-[#ff4b00]/30 bg-[#ff4b00]/10 shrink-0">
              <TerminalSquare className="h-6 w-6 text-[#ff4b00]" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#ff4b00]/80">MODULE 1 • BEGINNER</span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Java for Beginners</h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            This is a mock template for the Java for Beginners course. Here, students would typically see their active curriculum, coding environment, and progress tracking.
          </p>
        </div>

        {/* Mock Content */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-border bg-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Lesson 1.1: Hello, World!
              </h2>
              <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
                <p>Welcome to the programming world! We'll start with the classic "Hello World" program.</p>
                <p>In Java, every program must be wrapped in a <code>class</code>, and execution always begins in the <code>main</code> method.</p>
                
                <pre className="bg-secondary/50 p-4 rounded-md border border-border mt-4 overflow-x-auto">
                  <code className="text-sm">
{`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
                  </code>
                </pre>
              </div>
            </div>
            
            <div className="border border-[#ff4b00]/20 bg-[#ff4b00]/5 p-6 relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-[#ff4b00]/10 rounded-full blur-3xl" />
               <h3 className="font-bold text-[#ff4b00] mb-2 font-mono flex items-center gap-2 text-sm">
                 <TerminalSquare className="h-4 w-4" /> 
                 SYSTEM.OUT.CHALLENGE
               </h3>
               <p className="text-sm text-foreground mb-4">Print the exact string <code>Hello, Beginner!</code> to the console.</p>
               <button className="bg-[#ff4b00] text-white text-sm font-semibold px-4 py-2 hover:bg-[#ff4b00]/90 transition-colors" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}>
                 Initialize Editor
               </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border bg-card p-4">
               <h3 className="font-bold mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                 <Trophy className="h-4 w-4 text-accent" /> 
                 Course Progress
               </h3>
               
               <div className="space-y-3">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-muted-foreground">Completion</span>
                   <span className="font-bold">0%</span>
                 </div>
                 <div className="h-2 w-full bg-secondary border border-border overflow-hidden">
                   <div className="h-full w-[0%] bg-accent" />
                 </div>
               </div>
            </div>
            
            <div className="border border-border bg-card p-4">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide pb-2 border-b border-border">Syllabus</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full border border-[#ff4b00] flex-shrink-0 mt-0.5 relative">
                    <div className="absolute inset-0.5 bg-[#ff4b00] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground block">1.1 Hello, World!</span>
                    <span className="text-xs text-muted-foreground">In Progress • 10 XP</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 opacity-50">
                  <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">1.2 Variables & Data</span>
                    <span className="text-xs">Locked • 20 XP</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 opacity-50">
                  <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">2.1 If/Else Statements</span>
                    <span className="text-xs">Locked • 30 XP</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
