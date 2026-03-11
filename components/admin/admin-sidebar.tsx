"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import {
    LayoutDashboard, Users, BookOpen, MessageSquare, Settings,
    Megaphone, Terminal, Shield, ChevronLeft, ChevronRight,
    LogOut, ExternalLink, BarChart3, GraduationCap
} from "lucide-react"

const navLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href
        return pathname.startsWith(href)
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    return (
        <>
            {/* Mobile overlay — full top bar on mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-[#f26722]/20 z-40 flex items-center px-4 gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-[#f26722]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
                    <Terminal className="h-4 w-4 text-[#050505]" />
                </div>
                <span className="font-black text-lg tracking-widest text-white">ASCI</span>
                <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-[#f26722]/60">ADMIN</span>
                <div className="flex gap-1">
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href}
                            className={`p-2 transition-colors ${isActive(l.href, l.exact) ? "text-[#f26722]" : "text-[#555] hover:text-[#aaa]"}`}
                            title={l.name}
                        >
                            <l.icon className="h-4 w-4" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside className={`hidden md:flex fixed top-0 left-0 h-screen flex-col bg-[#080808] border-r border-[#1a1a1a] z-50 transition-all duration-300 ${collapsed ? "w-[60px]" : "w-64"}`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-[#1a1a1a] flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group flex-1 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center bg-[#f26722] flex-shrink-0 group-hover:brightness-110 transition-all"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
                            <Terminal className="h-4 w-4 text-[#050505]" />
                        </div>
                        {!collapsed && (
                            <div>
                                <div className="font-black text-white tracking-widest text-base leading-none group-hover:text-[#f26722] transition-colors">ASCI</div>
                                <div className="text-[9px] font-mono text-[#f26722]/60 tracking-[4px] mt-0.5">ADMIN PANEL</div>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(v => !v)}
                        className="ml-auto text-[#333] hover:text-[#f26722] transition-colors"
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                </div>

                {/* User badge */}
                {!collapsed && (
                    <div className="mx-3 mt-4 mb-2 p-3 bg-[#f26722]/5 border border-[#f26722]/15">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center bg-[#f26722]/10 border border-[#f26722]/20 text-[#f26722] text-xs font-black flex-shrink-0">
                                {(userName?.[0] || "A").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-semibold text-[#EDEDED] truncate">{userName}</div>
                                <div className="text-[9px] font-mono text-[#f26722]/70 uppercase tracking-widest flex items-center gap-1">
                                    <Shield className="h-2.5 w-2.5" />
                                    {userRole}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav links */}
                <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-[9px] font-mono uppercase tracking-widest text-[#333] px-2 py-2">Navigation</p>
                    )}
                    {navLinks.map(link => {
                        const active = isActive(link.href, link.exact)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                title={collapsed ? link.name : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all group relative ${active
                                    ? "bg-[#f26722]/10 text-[#f26722] border-l-2 border-[#f26722]"
                                    : "text-[#666] hover:text-[#EDEDED] hover:bg-[#111] border-l-2 border-transparent"
                                    }`}
                            >
                                <link.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#f26722]" : "text-[#444] group-hover:text-[#aaa]"}`} />
                                {!collapsed && <span className="font-mono text-xs uppercase tracking-wider">{link.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="border-t border-[#1a1a1a] p-2 space-y-1 flex-shrink-0">
                    <Link href="/" target="_blank"
                        className="flex items-center gap-3 px-3 py-2 text-[#444] hover:text-[#aaa] transition-colors group"
                        title={collapsed ? "View Site" : undefined}
                    >
                        <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover:text-[#f26722]" />
                        {!collapsed && <span className="text-xs font-mono uppercase tracking-wider">View Site</span>}
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[#444] hover:text-[#FF3131] transition-colors group"
                        title={collapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-xs font-mono uppercase tracking-wider">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile top-bar spacer */}
            <div className="md:hidden h-14" />
        </>
    )
}
