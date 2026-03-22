"use client"

import { useState } from "react"
import { ChevronDown, MessageSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    question: "Do I need prior coding experience?",
    answer: "Yes. This is not a 'hello world' bootcamp. You should be comfortable with basic programming concepts (loops, functions, variables) in at least one language. We start at intermediate and go straight to advanced."
  },
  {
    question: "How much time do I need to commit?",
    answer: "Expect to spend 15-20 hours per week. This includes watching lessons, participating in live sessions, solving DSA problems, and building projects. It's intense, but that's why it works."
  },
  {
    question: "Is there a guarantee I'll get a job?",
    answer: "No program can guarantee a job. However, we have a 94% placement rate at top-tier companies. We provide the mentorship, projects, and interview prep you need to be undeniable."
  },
  {
    question: "Do I get 1-on-1 time with mentors?",
    answer: "Yes. Every student gets a dedicated senior engineer mentor. You'll meet weekly for code reviews, architecture discussions, and career coaching."
  },
  {
    question: "What if I fall behind?",
    answer: "You have lifetime access to the curriculum. Even if you fall off the pace of the live cohort, you can complete the materials and projects at your own speed and still access community support."
  },
  {
    question: "Can I switch learning paths after enrolling?",
    answer: "Absolutely. Your subscription gives you access to all learning paths. You can focus on multiple paths simultaneously or switch between them as your interests and career goals evolve."
  },
  {
    question: "Are the live sessions recorded?",
    answer: "Yes. All live coding sessions and workshops are recorded and available within 2 hours of the session ending. You will never miss out due to timezone differences."
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? FAQS.filter(f => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase()))
    : FAQS

  return (
    <section className="relative border-t border-accent/10 bg-background py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-10" aria-hidden="true" />
      {/* Corner accents */}
      <div className="pointer-events-none absolute left-4 bottom-4 h-12 w-12 border-l-2 border-b-2 border-accent/15" aria-hidden="true" />
      <div className="pointer-events-none absolute right-4 top-4 h-12 w-12 border-r-2 border-t-2 border-accent/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-accent">
            <MessageSquare className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Intel</span>
          </div>
          <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {FAQS.length} questions. No fluff, just facts.
          </p>

          {/* Search bar */}
          <div className="relative mt-8 mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              suppressHydrationWarning
              className="w-full border border-border bg-card pl-10 pr-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
            />
            {/* Animated focus accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
              <div className="h-full w-0 bg-accent transition-all duration-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-mono text-sm">
              No questions match your search. <button onClick={() => setSearch("")} className="text-accent hover:underline">Clear search</button>
            </div>
          )}
          {filtered.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={cn(
                  "cyber-corner relative border transition-all duration-300",
                  isOpen
                    ? "border-accent/40 bg-accent/5 shadow-[0_4px_20px_rgba(242,103,34,0.08)]"
                    : "border-border bg-card hover:border-accent/25 hover:bg-card/80"
                )}
              >
                {/* Left accent bar when open */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 ${isOpen ? "bg-accent" : "bg-transparent"}`} />

                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  suppressHydrationWarning
                  className="flex w-full items-center justify-between px-5 pl-6 py-5 text-left gap-4"
                >
                  <span className="font-bold text-foreground pr-4 text-sm sm:text-base">{faq.question}</span>
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-300",
                    isOpen
                      ? "border-accent/50 bg-accent/20 text-accent rotate-180"
                      : "border-border text-muted-foreground hover:border-accent/30"
                  )}>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pl-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      <div className="h-px w-full bg-border/50 mb-4" />
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
