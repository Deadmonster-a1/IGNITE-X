"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Menu,
  X,
  Terminal,
  ChevronDown,
  BookOpen,
  Code2,
  Layers,
  Server,
  Braces,
  Zap,
  Lock,
  User,
  Shield,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"


const navLinks = [
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "DSA Mastery", icon: Braces, href: "/programs/dsa" },
      { label: "React & Next.js", icon: Code2, href: "/programs/react" },
      { label: "System Design", icon: Layers, href: "/programs/system-design" },
      { label: "Backend Engineering", icon: Server, href: "/programs/backend" },
    ],
  },
  { label: "Experience", href: "/experience" },
  { label: "Results", href: "/results" },
  { label: "Community", href: "/community" },
]

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // User Auth State
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })

    // Auth Listener
    const fetchUser = async () => {
      const bypassMatch = document.cookie.match(/(^| )demo_bypass=([^;]+)/)
      if (bypassMatch) {
        setUser({ email: 'demo@example.com' })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setIsAdmin(profile?.role === 'admin' || profile?.role === 'super_admin')
      }
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setIsAdmin(profile?.role === 'admin' || profile?.role === 'super_admin')
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled
        ? "border-b border-border bg-background/95 backdrop-blur-xl"
        : "bg-transparent"
        }`}
    >
      {/* Top accent bar -- cyberpunk style */}
      <div className="relative h-0.5 w-full bg-accent">
        <div className="absolute left-0 top-0 h-full w-8 bg-accent brightness-150" style={{ animation: "border-flow 3s linear infinite" }} />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center bg-accent transition-transform group-hover:scale-105" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
            <Terminal className="h-4.5 w-4.5 text-accent-foreground" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black tracking-tight text-foreground cyber-glitch">ASCI</span>
            <span className="border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-accent">
              LMS
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className="cyber-underline flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                {link.children && <ChevronDown className="h-3 w-3 opacity-50" />}
              </Link>

              {/* Dropdown */}
              {link.children && activeDropdown === link.label && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <div className="w-64 border border-border bg-card p-2 shadow-lg shadow-accent/5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-accent/5 hover:text-foreground"
                      >
                        <div className="flex h-8 w-8 items-center justify-center border border-accent/20 bg-accent/10">
                          <child.icon className="h-4 w-4 text-accent" />
                        </div>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {/* Status indicator */}
          <div className="hidden items-center gap-1.5 pr-3 lg:flex">
            <span className={`h-1.5 w-1.5 rounded-full ${user ? 'bg-success' : 'bg-muted-foreground'} animate-pulse`} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
              {user ? 'Authenticated' : 'Offline'}
            </span>
          </div>

          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-all hover:border-accent/30 hover:bg-secondary hover:text-foreground"
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            {mounted ? (
              resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 border border-[#FF3131]/40 bg-[#FF3131]/10 px-3 py-2 text-sm font-semibold text-[#FF3131] transition-all hover:bg-[#FF3131]/20"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
              >
                <Terminal className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                suppressHydrationWarning
                className="flex items-center gap-2 border border-accent/50 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent/20"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)" }}
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              suppressHydrationWarning
              className="hidden items-center gap-2 border border-accent/50 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent/20 md:flex"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 88% 100%, 0 100%)" }}
            >
              <Lock className="h-3.5 w-3.5" />
              Initialize
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            suppressHydrationWarning
            className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-background/98 px-5 py-5 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-accent/20 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <child.icon className="h-3.5 w-3.5 text-accent" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 border-t border-border pt-3 space-y-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 border border-[#FF3131]/40 bg-[#FF3131]/10 px-4 py-3 text-sm font-semibold text-[#FF3131]"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <Link
                href="/programs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 95% 100%, 0 100%)" }}
              >
                <Zap className="h-4 w-4" />
                Start Learning
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
