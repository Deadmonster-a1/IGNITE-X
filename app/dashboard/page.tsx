"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/client"
import { useUserSettings } from "@/context/user-settings-context"
import {
    Terminal, Shield, Cpu, Code, Database, Clock, PlayCircle,
    Star, Unlock, Activity, Zap, TrendingUp, BookOpen, Award,
    ArrowRight, Sparkles, User
} from "lucide-react"
import { motion } from "framer-motion"
import { RobotDock } from "@/components/robot-dock"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
}
const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "brightness(0.5) blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "brightness(1) blur(0px)", transition: { duration: 0.4 } }
}

import { getUserProfile, getUserEnrollmentsWithProgress } from "@/app/actions/user"
import { useAuthSession } from "@/hooks/useAuthSession"

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuthSession({ redirectTo: "/login" })
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [favorites, setFavorites] = useState<any[]>([])
    const [enrollments, setEnrollments] = useState<any[]>([])

    const { settings } = useUserSettings()
    const accent = settings.accentColor

    useEffect(() => {
        if (!user) return // wait for auth hook

        const init = async () => {
            // Check demo bypass cookie first
            const bypassMatch = document.cookie.match(/(^| )demo_bypass=([^;]+)/)
            const demoRole = bypassMatch ? bypassMatch[2] : null
            if (demoRole) {
                setProfile({ name: demoRole === 'admin' ? 'Demo Admin' : 'Demo Student', role: demoRole, xp: 4500, streak: 12, rank: 'Architect' })
                setFavorites([])
                setEnrollments([])
                setIsLoading(false)
                return
            }

            const supabase = createClient()
            // ✅ Fetch all data in parallel — eliminates sequential waterfall delays
            const [userProfile, userEnrollments, favsResult] = await Promise.all([
                getUserProfile(),
                getUserEnrollmentsWithProgress(),
                supabase.from("favorites").select("course_id, courses(title, is_premium)").eq("user_id", user.id),
            ])

            setProfile(userProfile)
            setEnrollments(userEnrollments)
            setFavorites(favsResult.data || [])
            setIsLoading(false)
        }
        init()
    }, [user])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] text-[#EDEDED]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
                    {/* Fake header */}
                    <div className="h-8 w-48 bg-white/5 rounded mb-3" />
                    <div className="h-4 w-72 bg-white/5 rounded mb-12" />
                    {/* Fake stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-28 bg-white/5 border border-white/5 rounded" />
                        ))}
                    </div>
                    {/* Fake content rows */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-64 bg-white/5 border border-white/5 rounded" />
                        <div className="h-64 bg-white/5 border border-white/5 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Operative"
    const isMaxClearance = profile?.role === 'admin' || profile?.role === 'super_admin'
    const rank = profile?.rank || "Initiate"

    const activeNodes = enrollments.length > 0 ? enrollments : []

    const achievements = [
        { icon: Terminal, label: "CLI Mastery", tier: "Bronze" },
        { icon: Shield, label: "Net Security", tier: "Silver" },
        { icon: Database, label: "Data Modeling", tier: "Gold" },
        { icon: Cpu, label: "Optimization", tier: "Locked" },
        { icon: Code, label: "Refactoring", tier: "Locked" },
    ]

    return (
        <main className="min-h-screen bg-[#050505] text-[#EDEDED] overflow-hidden selection:text-[#050505]">
            <Navbar />
            <div className="h-[68px]" />

            {/* Background layers — dynamic accent glow */}
            <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-40" aria-hidden="true" />
            <div className="noise-overlay pointer-events-none fixed inset-0" aria-hidden="true" />
            <div className="pointer-events-none fixed -right-40 top-20 h-[600px] w-[600px] rounded-full opacity-[0.08] blur-3xl" style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }} aria-hidden="true" />
            <div className="pointer-events-none fixed -left-60 top-1/2 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, rgba(242,103,34,0.4), transparent 70%)" }} aria-hidden="true" />

            {/* Corner decorations */}
            <div className="pointer-events-none fixed left-6 top-24 h-12 w-12 border-l-2 border-t-2 z-10" style={{ borderColor: `${accent}33` }} aria-hidden="true" />
            <div className="pointer-events-none fixed bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 z-10" style={{ borderColor: `${accent}33` }} aria-hidden="true" />

            {/* CRT Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

            <motion.div className="max-w-7xl mx-auto px-5 py-12 relative z-10" variants={containerVariants} initial="hidden" animate="visible">
                {/* Hero Header */}
                <motion.div variants={itemVariants} className="border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm relative p-8 mb-8 group transition-colors overflow-hidden" style={{ ['--hover-border' as any]: `${accent}4D` }}>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: `${accent}66` }} />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: `${accent}66` }} />

                    {/* Decorative large number */}
                    <div className="absolute right-8 top-0 text-[120px] font-black leading-none select-none pointer-events-none" style={{ color: `${accent}08` }}>01</div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6 w-full lg:w-auto">
                            {/* Avatar with XP ring */}
                            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: `${accent}4D`, backgroundColor: `${accent}0D`, clipPath: "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)" }}>
                                {settings.avatar ? (
                                    <Image src={settings.avatar} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-2 border rounded-full flex items-center justify-center" style={{ borderColor: `${accent}33` }}>
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="2" fill="none" className="text-[#1a1a1a]" />
                                            <circle cx="50%" cy="50%" r="45%" stroke={accent} strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="40" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute font-mono text-xs font-bold" style={{ color: accent }}>Lv.1</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">Operative Alias:</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 border" style={{ borderColor: isMaxClearance ? '#FF3131' : accent, color: isMaxClearance ? '#FF3131' : accent, backgroundColor: isMaxClearance ? '#FF313119' : `${accent}19` }}>
                                        {isMaxClearance ? 'CLEARANCE MAX' : rank.toUpperCase()}
                                    </span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight cyber-glitch" data-text={userName}>
                                    {userName}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <Link href="/profile" className="flex items-center gap-2 border px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all" style={{ borderColor: `${accent}4D`, backgroundColor: `${accent}0D`, color: accent }}>
                                        <Sparkles className="w-3 h-3" />
                                        Edit Profile
                                    </Link>
                                    {isMaxClearance && (
                                        <Link href="/admin" className="flex items-center gap-2 border border-[#FF3131]/30 bg-[#FF3131]/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#FF3131] hover:bg-[#FF3131]/10 transition-all">
                                            <Shield className="w-3 h-3" />
                                            Admin Panel
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <RobotDock id="dashboard-user" className="hidden lg:block w-28 h-28" />
                    </div>
                </motion.div>

                {/* Quick Stats Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Zap, value: profile?.xp || 0, label: "Total XP", iconColor: accent },
                        { icon: TrendingUp, value: `${profile?.streak_count || 0}d`, label: "Streak", iconColor: "#f97316" },
                        { icon: BookOpen, value: enrollments.length.toString(), label: "Active", iconColor: "#3b82f6" },
                        { icon: Award, value: rank, label: "Rank", iconColor: "#facc15" },
                    ].map((stat) => (
                        <div key={stat.label} className="border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-5 group transition-colors relative overflow-hidden" style={{ ['--hover-border' as any]: `${accent}33` }}>
                            <div className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, transparent, ${accent}1A, transparent)` }} />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center border border-[#1a1a1a] bg-[#050505]">
                                    <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
                                </div>
                                <div>
                                    <p className="font-mono text-xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Favorited Transmissions */}
                        {favorites.length > 0 && (
                            <div className="space-y-4">
                                <motion.h2 variants={itemVariants} className="text-sm font-mono uppercase tracking-widest text-[#facc15] flex items-center gap-3">
                                    <Star className="w-4 h-4 text-[#facc15] fill-current animate-pulse" />
                                    Priority Transmissions
                                    <div className="h-px bg-gradient-to-r from-[#facc15]/50 to-transparent flex-1 ml-4" />
                                </motion.h2>
                                <div className="grid gap-3">
                                    {favorites.map((fav, idx) => (
                                        <motion.div key={idx} variants={itemVariants} className="group relative border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-4 hover:border-[#facc15]/30 transition-all">
                                            <div className="absolute left-0 top-0 h-full w-1 bg-[#1a1a1a] group-hover:bg-[#facc15] transition-colors" />
                                            <div className="pl-4 flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${fav.courses?.is_premium ? 'border-[#facc15] text-[#facc15] bg-[#facc15]/10' : 'border-success text-success bg-success/10'}`}>
                                                            {fav.courses?.is_premium ? 'PREMIUM' : 'FREE'}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-lg text-[#EDEDED]">{fav.courses?.title}</h4>
                                                </div>
                                                <button className="flex-shrink-0 flex items-center justify-center p-2 border border-[#1a1a1a] text-xs hover:bg-[#facc15]/10 hover:border-[#facc15]/50 transition-all text-[#facc15]">
                                                    <Star className="w-5 h-5 fill-current" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Transmissions */}
                        <div className="space-y-4">
                            <motion.h2 variants={itemVariants} className="text-sm font-mono uppercase tracking-widest flex items-center gap-3" style={{ color: accent }}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                                Active Transmissions
                                <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}80, transparent)` }} />
                            </motion.h2>

                            <div className="space-y-4">
                                {activeNodes.map((node) => (
                                    <motion.div key={node.id} variants={itemVariants} className="group relative border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-6 transition-all overflow-hidden" style={{ ['--hover-border' as any]: `${accent}4D` }}>
                                        <div className="absolute left-0 top-0 h-full w-1 bg-[#1a1a1a] transition-colors" style={{ ['--group-hover-bg' as any]: accent }} />
                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, ${accent}05, transparent)` }} />

                                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${node.isPremium ? 'border-[#facc15] text-[#facc15] bg-[#facc15]/10' : 'border-success text-success bg-success/10'}`}>
                                                        {node.isPremium ? 'PREMIUM TIER' : 'PUBLIC ACCESS'}
                                                    </span>
                                                    <div className="text-[10px] font-mono text-[#a1a1aa]">{node.status === 'completed' ? 'DECRYPTED' : 'UPLINK ESTABLISHED'}</div>
                                                </div>
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    {node.title}
                                                    <button className="text-[#a1a1aa] hover:text-[#facc15] hover:scale-110 transition-all opacity-0 group-hover:opacity-100" aria-label="Favorite Course">
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                </h3>
                                            </div>

                                            <div className="w-full md:w-1/3 space-y-2">
                                                <div className="flex justify-between text-xs font-mono">
                                                    <span style={{ color: accent }}>{node.progressPercent ?? node.progress ?? 0}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-[#1a1a1a] overflow-hidden">
                                                    <motion.div
                                                        className="h-full"
                                                        style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${node.progressPercent ?? node.progress ?? 0}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                            </div>

                                            <Link href={`/courses/${node.slug || node.courseId || node.id}/learn`} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a] text-xs font-mono uppercase tracking-wider transition-all"
                                                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                                                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = `${accent}80`; (e.target as HTMLElement).style.backgroundColor = `${accent}19`; (e.target as HTMLElement).style.color = accent }}
                                                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#1a1a1a'; (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = '' }}>
                                                {node.isPremium && (node.progressPercent ?? node.progress ?? 0) === 0 ? <Unlock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                                {node.isPremium && (node.progressPercent ?? node.progress ?? 0) === 0 ? 'Unlock' : 'Resume'}
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Skill Tree Matrix */}
                        <motion.div variants={itemVariants} className="pt-4">
                            <h2 className="text-sm font-mono uppercase tracking-widest text-[#a1a1aa] mb-6 flex items-center gap-3">
                                <Zap className="w-4 h-4" />
                                Skill Tree Matrix
                                <div className="h-px bg-gradient-to-r from-[#1a1a1a] to-transparent flex-1 ml-4" />
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {achievements.map((ach, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={ach.tier !== 'Locked' ? { scale: 1.05, y: -4 } : {}}
                                        className="flex flex-col items-center justify-center p-4 border aspect-square text-center transition-colors cursor-pointer"
                                        style={ach.tier === 'Locked'
                                            ? { borderColor: '#1a1a1a', color: '#1a1a1a', clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }
                                            : { borderColor: `${accent}33`, backgroundColor: `${accent}0D`, color: accent, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }
                                        }
                                    >
                                        <ach.icon className="w-6 h-6 mb-2" />
                                        <span className="text-[9px] font-mono uppercase tracking-wider">{ach.label}</span>
                                        {ach.tier !== 'Locked' && (
                                            <span className="text-[8px] font-mono uppercase mt-1 opacity-60">{ach.tier}</span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-6">
                        {/* Upcoming Nodes */}
                        <motion.div variants={itemVariants} className="border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: `${accent}4D` }} />
                            <h2 className="text-sm font-mono uppercase tracking-widest text-[#a1a1aa] mb-6 flex justify-between items-center border-b border-[#1a1a1a] pb-4">
                                <span>Upcoming Nodes</span>
                                <Clock className="w-4 h-4" />
                            </h2>
                            <div className="space-y-4">
                                <div className="group border p-4 relative overflow-hidden transition-colors" style={{ borderColor: `${accent}4D`, backgroundColor: `${accent}0D` }}>
                                    <div className="absolute right-0 top-0 text-[80px] font-black opacity-5 -translate-y-4 translate-x-4 select-none">01</div>
                                    <div className="text-[10px] font-mono mb-1" style={{ color: accent }}>T-MINUS 02:14:00</div>
                                    <h4 className="font-bold text-sm leading-tight transition-colors" style={{ ['--group-hover-color' as any]: accent }}>Microfrontend Integration Sync</h4>
                                </div>
                                <div className="group border border-[#1a1a1a] p-4 relative overflow-hidden transition-colors">
                                    <div className="absolute right-0 top-0 text-[80px] font-black opacity-5 -translate-y-4 translate-x-4 select-none">02</div>
                                    <div className="text-[10px] font-mono text-[#a1a1aa] mb-1">SCHEDULED TMRW</div>
                                    <h4 className="font-bold text-sm leading-tight text-[#a1a1aa] group-hover:text-[#EDEDED] transition-colors">Docker Containerization Review</h4>
                                </div>
                                <div className="group border border-[#1a1a1a] p-4 relative overflow-hidden transition-colors">
                                    <div className="absolute right-0 top-0 text-[80px] font-black opacity-5 -translate-y-4 translate-x-4 select-none">03</div>
                                    <div className="text-[10px] font-mono text-[#a1a1aa] mb-1">IN 3 DAYS</div>
                                    <h4 className="font-bold text-sm leading-tight text-[#a1a1aa] group-hover:text-[#EDEDED] transition-colors">CI/CD Pipeline Automation</h4>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={itemVariants} className="border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-6">
                            <h2 className="text-sm font-mono uppercase tracking-widest text-[#a1a1aa] mb-4 flex items-center gap-3">
                                <Sparkles className="w-4 h-4" />
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <Link href="/programs" className="flex items-center justify-between p-3 border border-[#1a1a1a] transition-all group"
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}4D`; (e.currentTarget as HTMLElement).style.backgroundColor = `${accent}0D` }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLElement).style.backgroundColor = '' }}>
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-4 h-4" style={{ color: accent }} />
                                        <span className="text-sm">Browse Programs</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#a1a1aa] group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/profile" className="flex items-center justify-between p-3 border border-[#1a1a1a] transition-all group"
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}4D`; (e.currentTarget as HTMLElement).style.backgroundColor = `${accent}0D` }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLElement).style.backgroundColor = '' }}>
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm">View Profile</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#a1a1aa] group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Admin Command Center — only visible to admins */}
                        {isMaxClearance && (
                            <motion.div variants={itemVariants} className="border border-[#FF3131]/30 bg-[#FF3131]/5 backdrop-blur-sm p-6 relative overflow-hidden">
                                {/* Animated corner accent */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FF3131]/50" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FF3131]/50" />
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,#FF313108_0%,transparent_60%)] pointer-events-none" />

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="h-2 w-2 rounded-full bg-[#FF3131] animate-pulse" />
                                        <h2 className="text-xs font-mono uppercase tracking-widest text-[#FF3131]">
                                            Admin Command Center
                                        </h2>
                                    </div>
                                    <p className="text-[10px] text-[#a1a1aa] font-mono mb-4">CLEARANCE MAX · Full Access</p>

                                    <div className="space-y-1.5 mb-4">
                                        {[
                                            { label: "Overview", href: "/admin", icon: Shield },
                                            { label: "Manage Users", href: "/admin/users", icon: User },
                                            { label: "Courses", href: "/admin/courses", icon: BookOpen },
                                            { label: "Testimonials", href: "/admin/testimonials", icon: Star },
                                            { label: "Settings", href: "/admin/settings", icon: Cpu },
                                        ].map(item => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center justify-between px-3 py-2 border border-[#FF3131]/10 bg-[#FF3131]/5 hover:bg-[#FF3131]/15 hover:border-[#FF3131]/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="w-3.5 h-3.5 text-[#FF3131]/70" />
                                                    <span className="text-xs font-mono text-[#EDEDED]/70 group-hover:text-[#EDEDED] transition-colors">{item.label}</span>
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-[#FF3131]/40 group-hover:text-[#FF3131] group-hover:translate-x-0.5 transition-all" />
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href="/admin"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#FF3131]/40 bg-[#FF3131]/10 text-[#FF3131] text-xs font-mono uppercase tracking-wider hover:bg-[#FF3131]/20 transition-all"
                                        style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                                    >
                                        <Shield className="w-3.5 h-3.5" />
                                        Enter Admin Panel
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* System Status */}
                        <motion.div variants={itemVariants} className="border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm p-6 font-mono text-xs text-[#a1a1aa]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="uppercase tracking-widest">System Logic</span>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                                    <span style={{ color: accent }}>NOMINAL</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span>LATENCY</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1 bg-[#1a1a1a] overflow-hidden"><div className="h-full w-[20%]" style={{ backgroundColor: accent }} /></div>
                                        <span>14ms</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>MEM USAGE</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1 bg-[#1a1a1a] overflow-hidden"><div className="h-full w-[45%] bg-[#facc15]" /></div>
                                        <span>1.2gb</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>UPTIME</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1 bg-[#1a1a1a] overflow-hidden"><div className="h-full w-[99%]" style={{ backgroundColor: accent }} /></div>
                                        <span>99.99%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Scrolling marquee */}
            <div className="relative overflow-hidden border-y bg-[#0a0a0a]/80 py-6 mt-24 shadow-[0_0_40px_rgba(168,85,247,0.08)] transition-colors" style={{ borderColor: `${accent}33` }}>
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
                <div className="animate-marquee flex whitespace-nowrap items-center w-max" style={{ animationDuration: '90s' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className="mx-8 flex items-center gap-10">
                            {[
                                "COURSES", "PROGRESS", "ACHIEVEMENTS", "LEADERBOARD",
                                "COMMUNITY", "SYSTEM DESIGN", "ALGORITHMS", "CODE MASTERY"
                            ].map((t, idx) => (
                                <span key={t} className="flex items-center gap-10">
                                    <span
                                        className={`text-xl font-black uppercase tracking-widest transition-colors duration-500 hover:text-accent cursor-default sm:text-2xl lg:text-3xl ${idx % 2 === 0 ? 'text-transparent' : 'text-foreground/20'}`}
                                        style={idx % 2 === 0 ? { WebkitTextStroke: `1px ${accent}66` } : {}}
                                    >
                                        {t}
                                    </span>
                                    <Sparkles className="w-5 h-5 opacity-30 transition-opacity hover:opacity-100 animate-pulse" style={{ color: accent }} />
                                </span>
                            ))}
                        </span>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    )
}
