"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"
import { useUserSettings } from "@/context/user-settings-context"
import {
    Terminal, Shield, Save, User, Mail, Camera, Activity, Key,
    Bell, Palette, Monitor, Moon, Sun, Globe, LogOut,
    Trash2, ChevronRight, Zap, Sparkles, Lock,
    CheckCircle2, RotateCcw, X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthSession } from "@/hooks/useAuthSession"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
}
const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "brightness(0.5) blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "brightness(1) blur(0px)", transition: { duration: 0.4 } }
}

type SettingsTab = "identity" | "appearance" | "notifications" | "security" | "billing"

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "identity", label: "Identity", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing & Plan", icon: Zap },
]

const DEFAULT_AVATARS = [
    { src: "/avatars/hacker.png", name: "Hacker" },
    { src: "/avatars/robot.png", name: "Robot" },
    { src: "/avatars/skull.png", name: "Skull" },
    { src: "/avatars/astronaut.png", name: "Astronaut" },
    { src: "/avatars/ninja.png", name: "Ninja" },
    { src: "/avatars/cat.png", name: "Cat" },
]

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuthSession({ redirectTo: "/login" })
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<SettingsTab>("identity")

    const [alias, setAlias] = useState("")
    const [bio, setBio] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")

    const { theme, setTheme } = useTheme()
    const { settings, updateSetting, resetSettings } = useUserSettings()

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [passwordResetSent, setPasswordResetSent] = useState(false)
    const [showAvatarPicker, setShowAvatarPicker] = useState(false)

    // Dynamic accent from settings
    const accent = settings.accentColor

    useEffect(() => {
        if (!user) return // wait for auth hook

        const init = async () => {
            const bypassMatch = document.cookie.match(/(^| )demo_bypass=([^;]+)/)
            const demoRole = bypassMatch ? bypassMatch[2] : null
            if (demoRole) {
                setProfile({ name: demoRole === 'admin' ? 'Demo Admin' : 'Demo Student', role: demoRole, xp: 4500, streak: 12 })
                setAlias(demoRole === 'admin' ? 'Demo Admin' : 'Demo Student')
                setBio("Building the future, one commit at a time.")
                setIsLoading(false)
                return
            }
            const supabase = createClient()
            const { data: profileData } = await supabase
                .from("profiles").select("*").eq("id", user.id).single()

            if (profileData) {
                setProfile(profileData)
                setAlias(profileData.name || user.user_metadata?.full_name || "")
                setBio(profileData.bio || "")
            }
            setIsLoading(false)
        }
        init()
    }, [user])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSaveMessage("")
        if (document.cookie.includes("demo_bypass")) {
            setTimeout(() => {
                setProfile({ ...profile, name: alias, bio })
                setIsSaving(false)
                setSaveMessage("Profile updated successfully (Demo Mode).")
                setTimeout(() => setSaveMessage(""), 3000)
            }, 1000)
            return
        }
        const supabase = createClient()
        const { error } = await supabase.from("profiles").update({
            name: alias,
            bio,
            updated_at: new Date().toISOString(),
        }).eq("id", user?.id ?? "")
        setIsSaving(false)
        if (error) { setSaveMessage(`Error: ${error.message}`) }
        else {
            setProfile({ ...profile, name: alias, bio })
            setSaveMessage("Profile updated successfully.")
            setTimeout(() => setSaveMessage(""), 3000)
        }
    }

    const handlePasswordReset = async () => {
        if (!user?.email) return
        if (document.cookie.includes("demo_bypass")) {
            setPasswordResetSent(true)
            setTimeout(() => setPasswordResetSent(false), 5000)
            return
        }
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/auth/callback`,
        })
        if (!error) { setPasswordResetSent(true); setTimeout(() => setPasswordResetSent(false), 5000) }
    }

    const handleSignOut = async () => {
        if (document.cookie.includes("demo_bypass")) {
            document.cookie = "demo_bypass=; path=/; max-age=0"
            window.location.href = "/"
            return
        }
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    const handleDeleteAccount = async () => {
        if (document.cookie.includes("demo_bypass")) {
            document.cookie = "demo_bypass=; path=/; max-age=0"
            window.location.href = "/"
            return
        }
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    if (isLoading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-xs uppercase tracking-widest animate-pulse" style={{ color: accent }}>Accessing Profile Registry...</div>
    }

    const isMaxClearance = profile?.role === 'admin' || profile?.role === 'super_admin'
    const userName = alias || profile?.name || user?.email?.split("@")[0] || "Operative"
    const currentTheme = theme || "dark"

    return (
        <main className="min-h-screen bg-[#050505] text-[#EDEDED] overflow-hidden selection:text-[#050505]" style={{ ['--dyn-accent' as any]: accent }}>
            <Navbar />
            <div className="h-[68px]" />

            {/* Backgrounds with dynamic accent */}
            <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-40" aria-hidden="true" />
            <div className="noise-overlay pointer-events-none fixed inset-0" aria-hidden="true" />
            <div className="pointer-events-none fixed -right-40 top-20 h-[600px] w-[600px] rounded-full opacity-[0.08] blur-3xl" style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }} aria-hidden="true" />
            <div className="pointer-events-none fixed -left-40 bottom-20 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, rgba(242,103,34,0.4), transparent 70%)" }} aria-hidden="true" />

            {/* Corner decorations with dynamic accent */}
            <div className="pointer-events-none fixed left-6 top-24 h-12 w-12 border-l-2 border-t-2 z-10" style={{ borderColor: `${accent}33` }} aria-hidden="true" />
            <div className="pointer-events-none fixed bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 z-10" style={{ borderColor: `${accent}33` }} aria-hidden="true" />
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

            <motion.div className="max-w-6xl mx-auto px-5 py-12 relative z-10" variants={containerVariants} initial="hidden" animate="visible">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#1a1a1a] pb-8">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative w-20 h-20 flex-shrink-0 group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
                            <div className="w-full h-full flex items-center justify-center border-2 transition-all overflow-hidden" style={{ borderColor: `${accent}4D`, backgroundColor: `${accent}0D`, clipPath: "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)" }}>
                                {settings.avatar ? (
                                    <Image src={settings.avatar} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 transition-colors" style={{ color: `${accent}99` }} />
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#050505]/60 backdrop-blur-sm" style={{ clipPath: "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)" }}>
                                <Camera className="w-5 h-5" style={{ color: accent }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black uppercase tracking-tight cyber-glitch" data-text={userName}>{userName}</h1>
                                <span className="text-[10px] font-mono px-2 py-0.5 border" style={{ borderColor: isMaxClearance ? '#FF3131' : accent, color: isMaxClearance ? '#FF3131' : accent, backgroundColor: isMaxClearance ? '#FF313119' : `${accent}19` }}>
                                    {isMaxClearance ? 'CLEARANCE MAX' : 'LEVEL 1'}
                                </span>
                            </div>
                            <p className="font-mono text-xs text-[#a1a1aa]">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-black font-mono" style={{ color: accent }}>{profile?.xp || 0}</div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">Total XP</div>
                        </div>
                        <div className="w-px bg-[#1a1a1a]" />
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-2xl font-black text-orange-500 font-mono">
                                <Activity className="w-5 h-5" />
                                {profile?.streak_count || 0}
                            </div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">Day Streak</div>
                        </div>
                    </div>
                </motion.div>

                {/* Avatar Picker Modal */}
                <AnimatePresence>
                    {showAvatarPicker && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)}>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="border bg-[#0a0a0a] p-6 sm:p-8 w-full max-w-lg relative" style={{ borderColor: `${accent}33` }}>
                                <button onClick={() => setShowAvatarPicker(false)} className="absolute top-4 right-4 text-[#a1a1aa] hover:text-[#EDEDED] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-sm font-mono uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: accent }}>
                                    <Camera className="w-4 h-4" />
                                    Select Avatar
                                    <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {DEFAULT_AVATARS.map((av) => (
                                        <button
                                            key={av.src}
                                            onClick={() => { updateSetting("avatar", av.src); setShowAvatarPicker(false) }}
                                            className="group relative border p-2 transition-all overflow-hidden aspect-square"
                                            style={{ borderColor: settings.avatar === av.src ? accent : '#1a1a1a', backgroundColor: settings.avatar === av.src ? `${accent}0D` : 'transparent' }}
                                        >
                                            <Image src={av.src} alt={av.name} width={120} height={120} className="w-full h-full object-cover rounded-sm" />
                                            {settings.avatar === av.src && (
                                                <div className="absolute top-1 right-1 p-0.5" style={{ backgroundColor: accent }}>
                                                    <CheckCircle2 className="w-3 h-3 text-[#050505]" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 inset-x-0 py-1 text-center text-[9px] font-mono uppercase tracking-wider bg-[#050505]/80 text-[#a1a1aa] group-hover:text-[#EDEDED] transition-colors">
                                                {av.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <button onClick={() => { updateSetting("avatar", ""); setShowAvatarPicker(false) }} className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa] hover:text-[#FF3131] transition-colors">
                                        Remove Avatar
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono uppercase tracking-wider transition-all text-left border ${activeTab === tab.id ? '' : 'border-transparent text-[#a1a1aa] hover:text-[#EDEDED] hover:bg-[#1a1a1a]/50'
                                    }`}
                                style={activeTab === tab.id ? { borderColor: `${accent}4D`, backgroundColor: `${accent}19`, color: accent } : {}}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                            </button>
                        ))}
                        <div className="pt-4 border-t border-[#1a1a1a] mt-4">
                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium font-mono uppercase tracking-wider text-[#FF3131]/70 hover:text-[#FF3131] hover:bg-[#FF3131]/5 border border-transparent hover:border-[#FF3131]/20 transition-all text-left">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <AnimatePresence mode="wait">
                            {/* ─── IDENTITY ─── */}
                            {activeTab === "identity" && (
                                <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                                    <form onSubmit={handleSave} className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2" style={{ borderColor: `${accent}1A` }} />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: `${accent}1A` }} />

                                        <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3 mb-6" style={{ color: accent }}>
                                            <Terminal className="w-4 h-4" />
                                            Identity Config
                                            <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                        </h2>

                                        <div className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Operative Alias (Display Name)</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
                                                    <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)}
                                                        className="w-full bg-[#050505] border border-[#1a1a1a] text-sm pl-10 pr-4 py-2.5 focus:outline-none transition-all font-sans"
                                                        style={{ ['--tw-ring-color' as any]: `${accent}80` }}
                                                        onFocus={e => { e.target.style.borderColor = accent }}
                                                        onBlur={e => { e.target.style.borderColor = '#1a1a1a' }}
                                                        placeholder="Enter your alias" required />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Registered Comm-Link (Email)</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
                                                    <input type="email" value={user?.email || ""} disabled className="w-full bg-[#1a1a1a]/30 border border-[#1a1a1a] text-sm text-[#a1a1aa] pl-10 pr-4 py-2.5 cursor-not-allowed font-sans" />
                                                </div>
                                                <p className="text-[10px] text-[#a1a1aa]/60 mt-1">Comm-link address cannot be changed from this terminal.</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Bio / Status</label>
                                                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-sm px-4 py-2.5 focus:outline-none transition-all font-sans resize-none"
                                                    onFocus={e => { e.target.style.borderColor = accent }}
                                                    onBlur={e => { e.target.style.borderColor = '#1a1a1a' }}
                                                    placeholder="Tell us about yourself..." />
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                                            <span className={`text-xs font-mono font-bold ${saveMessage.includes('Error') ? 'text-[#FF3131]' : ''}`} style={!saveMessage.includes('Error') ? { color: accent } : {}}>
                                                {saveMessage}
                                            </span>
                                            <button type="submit" disabled={isSaving || (alias === profile?.name && bio === (profile?.bio || ""))}
                                                className="flex items-center gap-2 px-6 py-2.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ borderColor: `${accent}80`, backgroundColor: `${accent}19`, color: accent, clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}>
                                                {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                {isSaving ? 'UPLOADING...' : 'SAVE CONFIG'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* ─── APPEARANCE ─── */}
                            {activeTab === "appearance" && (
                                <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                                    <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8 space-y-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2" style={{ borderColor: `${accent}1A` }} />

                                        <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3" style={{ color: accent }}>
                                            <Palette className="w-4 h-4" />
                                            Display Preferences
                                            <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                        </h2>

                                        {/* Theme Mode */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">Theme Mode</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {([
                                                    { id: "dark", icon: Moon, label: "Dark" },
                                                    { id: "light", icon: Sun, label: "Light" },
                                                    { id: "system", icon: Monitor, label: "System" },
                                                ] as const).map(opt => (
                                                    <button key={opt.id} onClick={() => setTheme(opt.id)}
                                                        className="flex flex-col items-center gap-2 p-4 border transition-all"
                                                        style={currentTheme === opt.id
                                                            ? { borderColor: `${accent}80`, backgroundColor: `${accent}0D`, color: accent }
                                                            : { borderColor: '#1a1a1a', color: '#a1a1aa' }
                                                        }>
                                                        <opt.icon className="w-5 h-5" />
                                                        <span className="text-[10px] font-mono uppercase tracking-wider">{opt.label}</span>
                                                        {currentTheme === opt.id && <CheckCircle2 className="w-3 h-3" style={{ color: accent }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Accent Color */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">
                                                Accent Color <span style={{ color: `${accent}99` }}>({accent})</span>
                                            </label>
                                            <div className="flex gap-3 flex-wrap">
                                                {[
                                                    { color: "#39FF14", name: "Matrix" },
                                                    { color: "#00D4FF", name: "Cyber" },
                                                    { color: "#FF6B35", name: "Ember" },
                                                    { color: "#FF3131", name: "Neon" },
                                                    { color: "#A855F7", name: "Violet" },
                                                    { color: "#facc15", name: "Gold" },
                                                ].map(({ color, name }) => (
                                                    <button key={color} onClick={() => updateSetting("accentColor", color)} className="flex flex-col items-center gap-1 group" title={name}>
                                                        <div className={`w-10 h-10 border-2 transition-all hover:scale-110 ${settings.accentColor === color ? 'scale-110' : ''}`}
                                                            style={{ backgroundColor: color, borderColor: settings.accentColor === color ? '#fff' : '#1a1a1a', boxShadow: settings.accentColor === color ? `0 0 15px ${color}40` : 'none' }} />
                                                        <span className="text-[8px] font-mono uppercase text-[#a1a1aa] group-hover:text-[#EDEDED]">{name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Compact Mode */}
                                        <div className="flex items-center justify-between py-3 border-t border-[#1a1a1a]">
                                            <div>
                                                <div className="text-sm font-medium">Compact Mode</div>
                                                <div className="text-[10px] font-mono text-[#a1a1aa]">Reduce spacing and padding across the interface</div>
                                            </div>
                                            <button onClick={() => updateSetting("compactMode", !settings.compactMode)}
                                                className="relative w-12 h-6 transition-colors"
                                                style={{ backgroundColor: settings.compactMode ? `${accent}4D` : '#1a1a1a' }}>
                                                <div className="absolute top-0.5 left-0.5 w-5 h-5 transition-transform"
                                                    style={{ transform: settings.compactMode ? 'translateX(1.5rem)' : 'translateX(0)', backgroundColor: settings.compactMode ? accent : '#a1a1aa' }} />
                                            </button>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button onClick={resetSettings} className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] text-xs font-mono uppercase tracking-wider text-[#a1a1aa] hover:border-[#FF3131]/30 hover:text-[#FF3131] transition-all">
                                                <RotateCcw className="w-3 h-3" />
                                                Reset to Default
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── NOTIFICATIONS ─── */}
                            {activeTab === "notifications" && (
                                <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                                    <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8 space-y-2 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2" style={{ borderColor: `${accent}1A` }} />

                                        <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3 mb-6" style={{ color: accent }}>
                                            <Bell className="w-4 h-4" />
                                            Notification Protocols
                                            <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                        </h2>

                                        {([
                                            { key: "emailNotifs" as const, label: "Email Notifications", desc: "Receive updates via your registered comm-link", icon: Mail },
                                            { key: "courseUpdates" as const, label: "Course Updates", desc: "Get notified when new lessons or modules are deployed", icon: Zap },
                                            { key: "weeklyDigest" as const, label: "Weekly Progress Digest", desc: "Weekly summary of your XP gains and learning stats", icon: Globe },
                                            { key: "achievementAlerts" as const, label: "Achievement Alerts", desc: "Notifications when you unlock new skill badges", icon: Sparkles },
                                        ]).map((notif, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-4 border-b border-[#1a1a1a] last:border-b-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center border border-[#1a1a1a] bg-[#050505]">
                                                        <notif.icon className="w-4 h-4 text-[#a1a1aa]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{notif.label}</div>
                                                        <div className="text-[10px] font-mono text-[#a1a1aa]">{notif.desc}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => updateSetting(notif.key, !settings[notif.key])}
                                                    className="relative w-12 h-6 transition-colors"
                                                    style={{ backgroundColor: settings[notif.key] ? `${accent}4D` : '#1a1a1a' }}>
                                                    <div className="absolute top-0.5 left-0.5 w-5 h-5 transition-transform"
                                                        style={{ transform: settings[notif.key] ? 'translateX(1.5rem)' : 'translateX(0)', backgroundColor: settings[notif.key] ? accent : '#a1a1aa' }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── SECURITY ─── */}
                            {activeTab === "security" && (
                                <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                                    <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2" style={{ borderColor: `${accent}1A` }} />

                                        <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3" style={{ color: accent }}>
                                            <Key className="w-4 h-4" />
                                            Authentication Protocols
                                            <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border border-[#1a1a1a] bg-[#050505]">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="w-5 h-5 text-[#a1a1aa]" />
                                                    <div>
                                                        <div className="text-sm font-medium">Password</div>
                                                        <div className="text-[10px] font-mono text-[#a1a1aa]">
                                                            {passwordResetSent ? "Reset link sent to your email!" : "Send a reset link to your registered email"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={handlePasswordReset} disabled={passwordResetSent}
                                                    className="px-4 py-2 border text-xs font-mono uppercase tracking-wider transition-all"
                                                    style={passwordResetSent ? { borderColor: `${accent}4D`, color: accent, backgroundColor: `${accent}0D` } : { borderColor: '#1a1a1a', color: '#a1a1aa' }}>
                                                    {passwordResetSent ? '✓ Sent' : 'Reset'}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 border border-[#1a1a1a] bg-[#050505]">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-[#a1a1aa]" />
                                                    <div>
                                                        <div className="text-sm font-medium">Two-Factor Authentication</div>
                                                        <div className="text-[10px] font-mono text-[#a1a1aa]">Add an extra layer of security</div>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 border border-[#a1a1aa]/20 text-[10px] font-mono uppercase text-[#a1a1aa]">Coming Soon</span>
                                            </div>

                                            <div className="flex items-center justify-between p-4 border border-[#1a1a1a] bg-[#050505]">
                                                <div className="flex items-center gap-3">
                                                    <Monitor className="w-5 h-5 text-[#a1a1aa]" />
                                                    <div>
                                                        <div className="text-sm font-medium">Active Sessions</div>
                                                        <div className="text-[10px] font-mono text-[#a1a1aa]">1 active session detected</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                                                    <span className="text-[10px] font-mono" style={{ color: accent }}>CURRENT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="border border-[#FF3131]/20 bg-[#0a0a0a] p-6 sm:p-8 space-y-4">
                                        <h2 className="text-sm font-mono uppercase tracking-widest text-[#FF3131] flex items-center gap-3">
                                            <Trash2 className="w-4 h-4" />
                                            Danger Zone
                                            <div className="h-px bg-gradient-to-r from-[#FF3131]/30 to-transparent flex-1 ml-4" />
                                        </h2>
                                        <p className="text-xs text-[#a1a1aa]">Once you delete your account, there is no going back. All your data, progress, and achievements will be permanently erased.</p>
                                        {!showDeleteConfirm ? (
                                            <button onClick={() => setShowDeleteConfirm(true)} className="px-5 py-2.5 border border-[#FF3131]/30 text-[#FF3131] text-xs font-mono uppercase tracking-wider hover:bg-[#FF3131]/10 transition-all">
                                                Delete Account
                                            </button>
                                        ) : (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 border border-[#FF3131]/20 bg-[#FF3131]/5 p-4">
                                                <p className="text-xs text-[#FF3131] font-mono">⚠ ARE YOU ABSOLUTELY SURE? THIS ACTION CANNOT BE UNDONE.</p>
                                                <div className="flex gap-3">
                                                    <button onClick={handleDeleteAccount} className="px-5 py-2 bg-[#FF3131] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#FF3131]/80 transition-all">Confirm Delete</button>
                                                    <button onClick={() => setShowDeleteConfirm(false)} className="px-5 py-2 border border-[#1a1a1a] text-xs font-mono uppercase tracking-wider text-[#a1a1aa] hover:text-[#EDEDED] transition-all">Cancel</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                            {/* ─── BILLING ─── */}
                            {activeTab === "billing" && (
                                <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
                                    <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2" style={{ borderColor: `${accent}1A` }} />

                                        <h2 className="text-sm font-mono uppercase tracking-widest flex items-center gap-3" style={{ color: accent }}>
                                            <Zap className="w-4 h-4" />
                                            Subscription & Billing
                                            <div className="h-px flex-1 ml-4" style={{ background: `linear-gradient(to right, ${accent}4D, transparent)` }} />
                                        </h2>

                                        <div className="space-y-4 text-sm text-[#a1a1aa]">
                                            <div className="p-5 border border-[#1a1a1a] bg-[#050505] rounded-md">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="font-medium text-foreground">Current Plan</div>
                                                    <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest bg-accent/20 text-accent border border-accent/30 rounded-sm">
                                                        {profile?.subscription_tier === 'architect' ? 'ARCHITECT (PREMIUM)' : 'INITIATE (FREE)'}
                                                    </div>
                                                </div>
                                                <p className="text-xs mb-6">
                                                    {profile?.subscription_tier === 'architect'
                                                        ? "You have full access to all premium courses, architecture modules, and interactive terminal challenges."
                                                        : "You are currently on the free initiate plan. Upgrade to unlock interactive sandboxes and advanced systems courses."}
                                                </p>

                                                {profile?.subscription_tier === 'architect' ? (
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={async () => {
                                                                const res = await fetch("/api/razorpay/cancel-subscription", { method: "POST" })
                                                                if (res.ok) {
                                                                    window.location.reload()
                                                                } else {
                                                                    alert("Failed to cancel subscription")
                                                                }
                                                            }}
                                                            className="px-6 py-2.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors text-xs font-mono tracking-widest uppercase font-bold"
                                                        >
                                                            Cancel Subscription
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => window.location.href = '/pricing'}
                                                        className="w-full py-2.5 font-mono text-xs uppercase tracking-widest border transition-colors text-white font-bold"
                                                        style={{ backgroundColor: accent, borderColor: accent }}
                                                    >
                                                        Upgrade to Architect
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            <Footer />
        </main>
    )
}
