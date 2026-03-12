"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPublicProfile } from "@/app/actions/user"
import { 
    Globe, Shield, Zap, Activity, Award, 
    BookOpen, Terminal, Share2, ExternalLink,
    ChevronRight, Sparkles, User, Info
} from "lucide-react"
import { motion } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "brightness(0.5) blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "brightness(1) blur(0px)", transition: { duration: 0.5 } }
}

export default function PortfolioPage() {
    const params = useParams()
    const username = params.username as string
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const accent = "#00D4FF" // Cyber Blue default for portfolios

    useEffect(() => {
        async function load() {
            const data = await getPublicProfile(username)
            setProfile(data)
            setLoading(false)
        }
        load()
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#00D4FF] animate-pulse">
                Establishing Link to Portfolio Registry...
            </div>
        )
    }

    if (!profile) {
        return (
            <main className="min-h-screen bg-[#050505] text-[#EDEDED] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 mb-6 border border-red-500/30 flex items-center justify-center bg-red-500/5 rotate-45">
                        <Shield className="w-10 h-10 text-red-500 -rotate-45" />
                    </div>
                    <h1 className="text-2xl font-black uppercase mb-2">Portfolio Not Found</h1>
                    <p className="text-[#a1a1aa] font-mono text-xs max-w-md">The requested operative profile is either private or does not exist in our central database.</p>
                    <a href="/" className="mt-8 px-6 py-2 border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest hover:border-white transition-colors">Return to Base</a>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#050505] text-[#EDEDED] overflow-hidden selection:bg-[#00D4FF] selection:text-[#050505]">
            <Navbar />
            <div className="h-[68px]" />

            {/* Premium Background Elements */}
            <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-40" />
            <div className="noise-overlay pointer-events-none fixed inset-0" />
            <div className="pointer-events-none fixed -right-40 top-20 h-[600px] w-[600px] rounded-full opacity-[0.1] blur-3xl" style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }} />
            
            {/* HUD Scan Line */}
            <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-20 z-50 animate-scan" style={{ top: '0%' }} />

            <motion.div 
                className="max-w-6xl mx-auto px-5 py-16 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header / Identity Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 border-b border-[#1a1a1a] pb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: `${accent}4D`, backgroundColor: `${accent}0D`, clipPath: "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)" }}>
                                {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt={profile.name} width={128} height={128} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12" style={{ color: `${accent}99` }} />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-[#050505] border border-[#1a1a1a]">
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight cyber-glitch" data-text={profile.name}>{profile.name}</h1>
                                <div className="px-2 py-0.5 border text-[10px] font-mono tracking-widest" style={{ borderColor: accent, color: accent, backgroundColor: `${accent}19` }}>
                                    {profile.rank}
                                </div>
                            </div>
                            <p className="text-[#a1a1aa] font-mono text-sm max-w-xl">{profile.bio || "This operative hasn't uploaded a mission status yet."}</p>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#a1a1aa]">
                                    <Globe className="w-3.5 h-3.5" />
                                    Active since {new Date(profile.created_at).getFullYear()}
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <div className="text-[10px] font-mono uppercase text-green-500 tracking-widest">Online</div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="hidden md:flex items-center gap-2 px-6 py-2.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all hover:bg-white/5 active:scale-95 border-[#1a1a1a]">
                        <Share2 className="w-4 h-4" /> Share Link
                    </button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="h-16 w-16" /></div>
                        <div className="text-sm font-mono text-[#a1a1aa] uppercase tracking-widest mb-1">Total XP</div>
                        <div className="text-4xl font-black tracking-tighter" style={{ color: accent }}>{profile.xp}</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><Award className="h-16 w-16" /></div>
                        <div className="text-sm font-mono text-[#a1a1aa] uppercase tracking-widest mb-1">Clearance</div>
                        <div className="text-4xl font-black tracking-tighter text-white">{profile.rank}</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="h-16 w-16" /></div>
                        <div className="text-sm font-mono text-[#a1a1aa] uppercase tracking-widest mb-1">Streak</div>
                        <div className="text-4xl font-black tracking-tighter text-orange-500">{profile.streak_count || 0}d</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen className="h-16 w-16" /></div>
                        <div className="text-sm font-mono text-[#a1a1aa] uppercase tracking-widest mb-1">Courses</div>
                        <div className="text-4xl font-black tracking-tighter text-[#EDEDED]">{profile.completedCourses?.length || 0}</div>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Feed: Completed Courses */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-black uppercase tracking-widest">Completed Curriculum</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
                        </div>

                        {profile.completedCourses && profile.completedCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {profile.completedCourses.map((course: any) => (
                                    <div key={course.id} className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 group hover:border-[#333] transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4FF] opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity" />
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-[#1a1a1a] flex-shrink-0 relative overflow-hidden border border-[#222]">
                                                {course.thumbnail_url && (
                                                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-black uppercase truncate group-hover:text-[#00D4FF] transition-colors">{course.title}</h3>
                                                <div className="text-[10px] font-mono text-[#a1a1aa] mt-1 uppercase">{course.difficulty}</div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">100% Complete</span>
                                                    <BookOpen className="w-3.5 h-3.5 text-[#333]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-[#1a1a1a] p-12 text-center">
                                <Terminal className="w-8 h-8 text-[#1a1a1a] mx-auto mb-4" />
                                <p className="text-[#a1a1aa] font-mono text-xs">Curriculum records are currently offline or in progress.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Sidebar: Badges / Achievements */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-black uppercase tracking-widest">Badges</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 space-y-4">
                            <div className="flex items-center gap-4 p-3 border border-[#1a1a1a] bg-[#050505] grayscale hover:grayscale-0 transition-all cursor-help hover:border-[#00D4FF]/30 group">
                                <div className="w-10 h-10 border border-[#1a1a1a] flex items-center justify-center bg-[#1a1a1a]/20 group-hover:bg-[#00D4FF]/10 transition-colors">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">Early Adopter</div>
                                    <div className="text-[9px] font-mono text-[#555]">Joined during the Alpha phase</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 border border-[#1a1a1a] bg-[#050505] grayscale hover:grayscale-0 transition-all cursor-help hover:border-[#00D4FF]/30 group">
                                <div className="w-10 h-10 border border-[#1a1a1a] flex items-center justify-center bg-[#1a1a1a]/20 group-hover:bg-[#00D4FF]/10 transition-colors">
                                    <Shield className="w-5 h-5 text-[#00D4FF]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">Code Warrior</div>
                                    <div className="text-[9px] font-mono text-[#555]">Completed first 5 lessons</div>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 border border-[#1a1a1a] text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa] hover:text-white hover:border-[#333] transition-all">
                                View Full Log
                            </button>
                        </div>

                        {/* Social / Links */}
                        <div className="p-4 border border-[#1a1a1a] bg-[#050505] text-center">
                            <div className="text-[9px] font-mono text-[#444] uppercase tracking-widest mb-3">Operative Discovery</div>
                            <div className="flex justify-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-[#1a1a1a] flex items-center justify-center hover:border-white transition-colors cursor-pointer"><Share2 className="w-3.5 h-3.5" /></div>
                                <div className="w-8 h-8 rounded-full border border-[#1a1a1a] flex items-center justify-center hover:border-white transition-colors cursor-pointer"><Info className="w-3.5 h-3.5" /></div>
                                <div className="w-8 h-8 rounded-full border border-[#1a1a1a] flex items-center justify-center hover:border-white transition-colors cursor-pointer"><Award className="w-3.5 h-3.5" /></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            <Footer />
        </main>
    )
}
