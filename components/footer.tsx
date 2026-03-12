"use client"

import { ArrowRight, Terminal, Github, Twitter, Linkedin, Youtube, Zap } from "lucide-react"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const footerColumns = [
  {
    heading: "Programs",
    links: [
      { label: "DSA Mastery", href: "/programs" },
      { label: "React & Next.js", href: "/programs" },
      { label: "System Design", href: "/programs" },
      { label: "Node.js & APIs", href: "/programs" },
      { label: "Competitive Programming", href: "/programs" },
      { label: "CI/CD & Cloud", href: "/programs" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Algorithm Visualizer", href: "/experience" },
      { label: "Code Playground", href: "/experience" },
      { label: "Mock Interviews", href: "/experience" },
      { label: "Learning Paths", href: "/#courses" },
      { label: "Progress Tracker", href: "/dashboard" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Discord Server", href: "https://discord.com", external: true },
      { label: "GitHub Org", href: "https://github.com", external: true },
      { label: "Alumni Network", href: "/community" },
      { label: "Blog", href: "/community" },
      { label: "Events", href: "/community" },
      { label: "Mentorship", href: "/community" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/results" },
      { label: "Careers", href: "mailto:careers@asci.dev" },
      { label: "Contact", href: "mailto:hello@asci.dev" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
]

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
]

export function Footer({ showCTA = false }: { showCTA?: boolean }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, { y: 50, opacity: 0, scale: 0.97 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none none" },
        })
      }
      if (linksRef.current) {
        const cols = linksRef.current.querySelectorAll(".footer-col")
        gsap.fromTo(cols, { y: 25, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: linksRef.current, start: "top 85%", toggleActions: "play none none none" },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail("")
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer id="footer" className="relative border-t border-accent/10 bg-card">
      <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-10" aria-hidden="true" />
      {/* Cyberpunk corners */}
      <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-accent/10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-accent/10" aria-hidden="true" />

      {/* CTA / Waitlist — only on landing page */}
      {showCTA && (
        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div ref={ctaRef} className="cyber-corner relative mx-auto max-w-2xl overflow-hidden border border-border bg-background p-8 sm:p-12">
            {/* Accent glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
            {/* HUD corners */}
            <div className="absolute left-2 top-2 h-4 w-4 border-l border-t border-accent/30" aria-hidden="true" />
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-accent/30" aria-hidden="true" />

            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center bg-accent" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
                <Terminal className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-mono text-sm font-semibold uppercase tracking-wider text-accent">
                Join the Waitlist
              </span>
            </div>

            <h2 className="cyber-glitch text-balance text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
              Enter your email to secure your spot in the next cohort. Limited to 30 students for personalized attention.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@email.com"
                required
                suppressHydrationWarning
                className="flex-1 border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="group flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:shadow-accent/40 hover:brightness-110"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)" }}
              >
                {submitted ? "Joined!" : "Join"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {submitted && (
              <p className="mt-3 font-mono text-sm font-medium text-success animate-count-up">
                You are on the waitlist! We will reach out soon.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer links grid */}
      <div ref={linksRef} className="relative mx-auto max-w-7xl border-t border-border px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.heading} className="footer-col">
              <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="cyber-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-accent" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
              <Terminal className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight text-foreground cyber-glitch">ASCI</span>
            <span className="border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-accent">
              LMS
            </span>
            <SectionBot variant="footer" className="hidden sm:inline-flex ml-2" />
            <RobotDock
              id="footer"
              label="SLEEP-BOT"
              className="hidden lg:flex h-[160px] w-[130px] shrink-0 ml-4"
            />
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent/30 hover:bg-secondary hover:text-foreground"
                aria-label={s.label}
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            2026 ASCI. Built for developers, by developers.
          </p>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 w-full bg-accent" />
    </footer>
  )
}
