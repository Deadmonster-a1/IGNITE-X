"use client"

import { useState } from "react"
import { ChevronDown, MessageSquare } from "lucide-react"
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
    }
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="relative border-t border-accent/10 bg-background py-20 lg:py-28">
            <div className="absolute inset-0 bg-dots opacity-10" aria-hidden="true" />

            <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 text-accent">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-mono text-sm font-semibold uppercase tracking-wider">Intel</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "cyber-corner border bg-card transition-all duration-300",
                                    isOpen ? "border-accent/40 bg-accent/5" : "border-border hover:border-accent/20"
                                )}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    suppressHydrationWarning
                                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                                >
                                    <span className="font-bold text-foreground pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-5 w-5 shrink-0 text-accent transition-transform duration-300",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                                            <div className="h-px w-full bg-border mb-4" />
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
