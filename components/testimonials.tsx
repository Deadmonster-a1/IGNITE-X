"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useScrollReveal } from "@/hooks/use-gsap"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import { Star, ChevronLeft, ChevronRight, Quote, Award, Plus, X, Loader2 } from "lucide-react"
import { getTestimonials, createTestimonial } from "@/app/actions/testimonials"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE II at Google",
    cohort: "Cohort 01",
    avatar: "PS",
    content:
      "The DSA track completely changed my approach to problem-solving. I went from struggling with medium LeetCode problems to getting offers from Google and Microsoft in 4 months.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Frontend Lead at Vercel",
    cohort: "Cohort 02",
    avatar: "AC",
    content:
      "The React & Next.js course taught me patterns I still use in production daily. The mentorship was invaluable -- my mentor reviewed every PR and gave actionable feedback.",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    role: "SDE at Amazon",
    cohort: "Cohort 03",
    avatar: "MR",
    content:
      "I came in knowing basic JavaScript and left shipping full-stack apps. The system design sessions were what really set me apart in my Amazon interviews.",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "Backend Engineer at Stripe",
    cohort: "Cohort 02",
    avatar: "JO",
    content:
      "Best investment in my career. The community aspect kept me accountable, and the career accelerator program helped me negotiate a 40% higher salary than my initial offer.",
    rating: 5,
  },
  {
    name: "Sarah Kim",
    role: "Founding Engineer at YC Startup",
    cohort: "Cohort 01",
    avatar: "SK",
    content:
      "The competitive programming track stretched me to my limits. Now I can solve hard graph problems in my sleep. That confidence translated directly to my startup role.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Senior SWE at Meta",
    cohort: "Cohort 03",
    avatar: "DP",
    content:
      "I was self-taught for 3 years before ASCI. The structured curriculum filled every gap in my knowledge. The mock interviews felt harder than the real Meta interview.",
    rating: 5,
  },
]

export function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 })
  const [activeIndex, setActiveIndex] = useState(0)
  const cardsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [liveTestimonials, setLiveTestimonials] = useState<any[]>(testimonials)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userHoverRating, setUserHoverRating] = useState(0)
  const [userRating, setUserRating] = useState(5)

  useEffect(() => {
    async function loadTestimonials() {
      const data = await getTestimonials()
      if (data && data.length > 0) {
        setLiveTestimonials(data)
      }
    }
    loadTestimonials()
  }, [])

  const prev = () => setActiveIndex((i) => (i - 1 + liveTestimonials.length) % liveTestimonials.length)
  const next = () => setActiveIndex((i) => (i + 1) % liveTestimonials.length)

  const getVisible = () => {
    if (liveTestimonials.length === 0) return []
    const result = []
    for (let i = 0; i < Math.min(3, liveTestimonials.length); i++) {
      result.push(liveTestimonials[(activeIndex + i) % liveTestimonials.length])
    }
    return result
  }

  useEffect(() => {
    if (!cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll(".testimonial-card")
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    )
  }, [activeIndex, liveTestimonials])

  const handleWriteReviewClick = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setIsModalOpen(true)
  }

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.append("rating", userRating.toString())

    const res = await createTestimonial(formData)
    setIsSubmitting(false)

    if (res.success) {
      setIsModalOpen(false)
      // Refresh the list immediately
      const data = await getTestimonials()
      if (data && data.length > 0) setLiveTestimonials(data)
    } else {
      alert(res.error || "Failed to submit review.")
    }
  }

  return (
    <section id="testimonials" className="relative py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" aria-hidden="true" />
      {/* Cyberpunk corners */}
      <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-accent/10" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-2 text-accent">
            <Award className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Results</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Student Stories
              </h2>
              <SectionBot variant="testimonials" className="hidden md:inline-flex mb-1" />
              <RobotDock
                id="testimonials"
                label="CHEER-BOT"
                className="hidden lg:flex h-[200px] w-[160px] shrink-0 mb-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWriteReviewClick}
                suppressHydrationWarning
                className="hidden sm:flex items-center gap-2 border border-accent/50 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
              >
                <Plus className="h-4 w-4" />
                Write a Review
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  suppressHydrationWarning
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent/30 hover:bg-secondary hover:text-foreground"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  suppressHydrationWarning
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent/30 hover:bg-secondary hover:text-foreground"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div ref={cardsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getVisible().map((t, i) => (
            <div
              key={`${t.name}-${activeIndex}`}
              className={`testimonial-card cyber-corner group relative flex flex-col overflow-hidden border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 ${i === 0 ? "" : i === 1 ? "hidden sm:flex" : "hidden lg:flex"
                }`}
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/10" />

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {`"${t.content}"`}
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center border border-accent/20 bg-accent/10 font-mono text-xs font-bold text-accent">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="ml-auto border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                  {t.cohort}
                </span>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
                <div className="h-full w-0 bg-accent transition-all duration-700 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="cyber-corner relative w-full max-w-lg border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Submit a Review</h3>
              <p className="text-sm text-muted-foreground mt-1">Share your experience with the community.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</label>
                <div className="flex gap-1" onMouseLeave={() => setUserHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setUserHoverRating(star)}
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${(userHoverRating || userRating) >= star ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="cohort" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cohort / Status</label>
                <input
                  id="cohort"
                  name="cohort"
                  type="text"
                  placeholder="e.g. Cohort 04, Self-Taught, etc."
                  defaultValue="Community Member"
                  required
                  className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="content" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Review</label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  placeholder="How did this platform help you?"
                  required
                  minLength={10}
                  className="w-full resize-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-border bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center min-w-[120px] bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
