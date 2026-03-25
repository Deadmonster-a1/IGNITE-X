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

if (typeof window !== "undefined") { gsap.registerPlugin(ScrollTrigger) }

const testimonials = [
  { name: "Priya Sharma", role: "SDE II at Google", cohort: "Cohort 01", avatar: "PS", content: "The DSA track completely changed my approach to problem-solving. I went from struggling with medium LeetCode problems to getting offers from Google and Microsoft in 4 months.", rating: 5 },
  { name: "Alex Chen", role: "Frontend Lead at Vercel", cohort: "Cohort 02", avatar: "AC", content: "The React & Next.js course taught me patterns I still use in production daily. The mentorship was invaluable — my mentor reviewed every PR and gave actionable feedback.", rating: 5 },
  { name: "Maria Rodriguez", role: "SDE at Amazon", cohort: "Cohort 03", avatar: "MR", content: "I came in knowing basic JavaScript and left shipping full-stack apps. The system design sessions were what really set me apart in my Amazon interviews.", rating: 5 },
  { name: "James Okafor", role: "Backend Engineer at Stripe", cohort: "Cohort 02", avatar: "JO", content: "Best investment in my career. The community aspect kept me accountable, and the career accelerator program helped me negotiate a 40% higher salary than my initial offer.", rating: 5 },
  { name: "Sarah Kim", role: "Founding Engineer at YC Startup", cohort: "Cohort 01", avatar: "SK", content: "The competitive programming track stretched me to my limits. Now I can solve hard graph problems in my sleep. That confidence translated directly to my startup role.", rating: 5 },
  { name: "David Park", role: "Senior SWE at Meta", cohort: "Cohort 03", avatar: "DP", content: "I was self-taught for 3 years before ASCI. The structured curriculum filled every gap in my knowledge. The mock interviews felt harder than the real Meta interview.", rating: 5 },
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % liveTestimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [liveTestimonials.length])

  useEffect(() => {
    async function loadTestimonials() {
      const data = await getTestimonials()
      if (data && data.length > 0) setLiveTestimonials(data)
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
    gsap.fromTo(cards, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" })
  }, [activeIndex, liveTestimonials])

  const handleWriteReviewClick = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
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
      const data = await getTestimonials()
      if (data && data.length > 0) setLiveTestimonials(data)
    } else { alert(res.error || "Failed to submit review.") }
  }

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-2 text-accent">
            <Award className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Results</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Student Stories
              </h2>
              <SectionBot variant="testimonials" className="hidden md:inline-flex mb-1" />
              <RobotDock id="testimonials" label="CHEER-BOT" className="hidden lg:flex h-[200px] w-[160px] shrink-0 mb-1" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWriteReviewClick}
                suppressHydrationWarning
                className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Write a Review
              </button>
              <div className="flex items-center gap-2">
                <button onClick={prev} suppressHydrationWarning className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground" aria-label="Previous">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} suppressHydrationWarning className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground" aria-label="Next">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getVisible().map((t, i) => (
            <div
              key={`${t.name}-${activeIndex}`}
              className={`testimonial-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 ${
                  i === 0 ? "" : i === 1 ? "hidden sm:flex" : "hidden lg:flex"
              }`}
            >
              {/* Top gradient accent */}
              <div className="h-0.5 w-full overflow-hidden bg-border">
                <div className="h-full w-0 bg-gradient-to-r from-accent/60 to-accent/20 transition-all duration-700 group-hover:w-full" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/8" />

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
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-xs font-bold text-foreground transition-all">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground">
                    {t.cohort}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="mt-8 flex justify-center gap-2">
          {liveTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              suppressHydrationWarning
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-foreground" : "w-1.5 bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-background/95 p-6 shadow-2xl backdrop-blur-xl animate-[scaleIn_0.2s_ease-out_both]">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
            <div className="mb-2 h-[2px] w-full bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full" />
            <div className="mb-6 mt-4">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Submit a Review</h3>
              <p className="text-sm text-muted-foreground mt-1">Share your experience with the community.</p>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</label>
                <div className="flex gap-1" onMouseLeave={() => setUserHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onMouseEnter={() => setUserHoverRating(star)} onClick={() => setUserRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
                      <Star className={`h-6 w-6 ${(userHoverRating || userRating) >= star ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="cohort" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cohort / Status</label>
                <input id="cohort" name="cohort" type="text" placeholder="e.g. Cohort 04, Self-Taught, etc." defaultValue="Community Member" required className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50" />
              </div>
              <div>
                <label htmlFor="content" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Review</label>
                <textarea id="content" name="content" rows={4} placeholder="How did this platform help you?" required minLength={10} className="w-full resize-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50" />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-semibold hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center min-w-[120px] rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:scale-105 disabled:opacity-50 transition-all">
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
