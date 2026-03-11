"use client"

import { useState } from "react"
import {
    Settings, Shield, Mail, Globe, Bell, Database,
    Key, Users, Palette, Save, CheckCircle2, AlertCircle,
    ToggleLeft, ToggleRight, ExternalLink, Lock, Eye, EyeOff,
    Loader2, ChevronRight
} from "lucide-react"

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center bg-accent/10 border border-accent/20 flex-shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-accent" />
            </div>
            <div>
                <h2 className="text-base font-semibold text-foreground">{title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
        </div>
    )
}

function SettingRow({
    label,
    description,
    children,
}: {
    label: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4 border-b border-border/50 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    )
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? "bg-accent" : "bg-secondary border border-border"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
            />
        </button>
    )
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-secondary/50 border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-foreground placeholder:text-muted-foreground"
        />
    )
}

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-all disabled:opacity-60"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
        >
            {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
            ) : (
                <Save className="h-3.5 w-3.5" />
            )}
            {saved ? "Saved!" : "Save Changes"}
        </button>
    )
}

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────

export default function AdminSettingsPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState("general")

    // Save states
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState<string | null>(null)

    const handleSave = (section: string) => {
        setSaving(true)
        setSaved(null)
        setTimeout(() => {
            setSaving(false)
            setSaved(section)
            setTimeout(() => setSaved(null), 2500)
        }, 800)
    }

    // ── General Settings ──
    const [siteName, setSiteName] = useState("ASCI Platform")
    const [siteUrl, setSiteUrl] = useState("http://localhost:3000")
    const [supportEmail, setSupportEmail] = useState("support@asci.dev")
    const [maintenanceMode, setMaintenanceMode] = useState(false)

    // ── Auth Settings ──
    const [allowSignups, setAllowSignups] = useState(true)
    const [emailConfirmation, setEmailConfirmation] = useState(true)
    const [googleAuth, setGoogleAuth] = useState(true)
    const [passwordMinLength, setPasswordMinLength] = useState("10")

    // ── Email Settings ──
    const [smtpHost, setSmtpHost] = useState("smtp.gmail.com")
    const [smtpPort, setSmtpPort] = useState("465")
    const [smtpUser, setSmtpUser] = useState("")
    const [smtpPass, setSmtpPass] = useState("")
    const [smtpFrom, setSmtpFrom] = useState("")
    const [showSmtpPass, setShowSmtpPass] = useState(false)

    // ── Notifications ──
    const [newUserAlert, setNewUserAlert] = useState(true)
    const [newEnrollmentAlert, setNewEnrollmentAlert] = useState(true)
    const [weeklyReport, setWeeklyReport] = useState(false)

    // ── Access Control ──
    const [freeCoursesEnabled, setFreeCoursesEnabled] = useState(true)
    const [premiumEnabled, setPremiumEnabled] = useState(true)
    const [guestPreview, setGuestPreview] = useState(false)
    const [maxFreeCourses, setMaxFreeCourses] = useState("3")

    // ── Appearance ──
    const [accentColor, setAccentColor] = useState("#a78bfa")
    const [platformTagline, setPlatformTagline] = useState("Master the terminal. Own the future.")
    const [showRobotOnDashboard, setShowRobotOnDashboard] = useState(true)

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "auth", label: "Auth", icon: Shield },
        { id: "email", label: "Email / SMTP", icon: Mail },
        { id: "access", label: "Access Control", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Appearance", icon: Palette },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-accent" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure and control every aspect of ASCI.</p>
                </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-sm">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-400/80">
                    Auth, SMTP, and OTP settings must be configured inside your{" "}
                    <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-amber-300 inline-flex items-center gap-0.5"
                    >
                        Supabase Dashboard <ExternalLink className="h-3 w-3" />
                    </a>
                    . The fields below serve as a reference and local config store.
                </p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Tabs */}
                <aside className="w-44 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-sm transition-all text-left ${activeTab === tab.id
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <tab.icon className="h-4 w-4 flex-shrink-0" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Settings Panel */}
                <div className="flex-1 min-w-0">

                    {/* ── GENERAL ── */}
                    {activeTab === "general" && (
                        <div className="bg-card border border-border/50 p-6">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
                            <SectionHeader icon={Globe} title="General Settings" description="Basic platform-wide configuration." />
                            <div className="space-y-1">
                                <SettingRow label="Site Name" description="Displayed in the browser title bar and emails.">
                                    <div className="w-56"><TextInput value={siteName} onChange={setSiteName} placeholder="ASCI Platform" /></div>
                                </SettingRow>
                                <SettingRow label="Site URL" description="Your production domain. Used for email links.">
                                    <div className="w-56"><TextInput value={siteUrl} onChange={setSiteUrl} placeholder="https://asci.dev" /></div>
                                </SettingRow>
                                <SettingRow label="Support Email" description="Where user issues are directed.">
                                    <div className="w-56"><TextInput value={supportEmail} onChange={setSupportEmail} type="email" /></div>
                                </SettingRow>
                                <SettingRow label="Maintenance Mode" description="Temporarily blocks all non-admin access.">
                                    <Toggle enabled={maintenanceMode} onToggle={() => setMaintenanceMode(v => !v)} />
                                </SettingRow>
                            </div>
                            {maintenanceMode && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    ⚠️ Maintenance mode is ON — users will see a maintenance page.
                                </div>
                            )}
                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("general")} saving={saving && saved === null} saved={saved === "general"} />
                            </div>
                        </div>
                    )}

                    {/* ── AUTH ── */}
                    {activeTab === "auth" && (
                        <div className="bg-card border border-border/50 p-6 relative">
                            <SectionHeader icon={Shield} title="Authentication" description="Control how users sign in and register." />
                            <div className="space-y-1">
                                <SettingRow label="Allow New Signups" description="Disable to freeze registrations.">
                                    <Toggle enabled={allowSignups} onToggle={() => setAllowSignups(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Email OTP Confirmation" description="Require new users to verify email via OTP.">
                                    <Toggle enabled={emailConfirmation} onToggle={() => setEmailConfirmation(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Google OAuth" description="Let users sign in with their Google account.">
                                    <Toggle enabled={googleAuth} onToggle={() => setGoogleAuth(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Min Password Length" description="Supabase minimum is 6, recommended 10+.">
                                    <div className="w-24">
                                        <TextInput value={passwordMinLength} onChange={setPasswordMinLength} type="number" />
                                    </div>
                                </SettingRow>
                            </div>

                            {/* Supabase quicklinks */}
                            <div className="mt-6 p-4 bg-secondary/30 border border-border rounded-sm space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Supabase Auth Links</p>
                                {[
                                    { label: "Email Provider Settings", path: "auth/providers" },
                                    { label: "Email Templates (OTP)", path: "auth/templates" },
                                    { label: "URL Configuration", path: "auth/url-configuration" },
                                ].map(link => (
                                    <a
                                        key={link.path}
                                        href={`https://supabase.com/dashboard/project/_/${link.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <span>{link.label}</span>
                                        <ExternalLink className="h-3.5 w-3.5 group-hover:text-accent transition-colors" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("auth")} saving={saving && saved === null} saved={saved === "auth"} />
                            </div>
                        </div>
                    )}

                    {/* ── EMAIL / SMTP ── */}
                    {activeTab === "email" && (
                        <div className="bg-card border border-border/50 p-6 relative">
                            <SectionHeader icon={Mail} title="Email / SMTP" description="Configure outgoing email for OTP and notifications." />

                            <div className="mb-5 p-3 bg-accent/5 border border-accent/20 text-xs text-accent/80">
                                💡 These must also be entered in <strong>Supabase → Project Settings → Auth → SMTP</strong>. Stored here for reference only.
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">SMTP Host</label>
                                        <TextInput value={smtpHost} onChange={setSmtpHost} placeholder="smtp.gmail.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Port</label>
                                        <TextInput value={smtpPort} onChange={setSmtpPort} placeholder="465" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">SMTP Username (Gmail)</label>
                                    <TextInput value={smtpUser} onChange={setSmtpUser} placeholder="you@gmail.com" type="email" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">SMTP Password (App Password)</label>
                                    <div className="relative">
                                        <input
                                            type={showSmtpPass ? "text" : "password"}
                                            value={smtpPass}
                                            onChange={e => setSmtpPass(e.target.value)}
                                            placeholder="16-character App Password"
                                            className="w-full bg-secondary/50 border border-border px-3 py-2 pr-10 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSmtpPass(v => !v)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                        >
                                            {showSmtpPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From Email</label>
                                    <TextInput value={smtpFrom} onChange={setSmtpFrom} placeholder="ASCI Platform <no-reply@gmail.com>" />
                                </div>
                            </div>

                            {/* Gmail App Password Guide */}
                            <div className="mt-6 p-4 bg-secondary/30 border border-border rounded-sm">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">📖 Gmail App Password Steps</p>
                                {[
                                    "Enable 2-Factor Auth on your Google account",
                                    "Go to myaccount.google.com/apppasswords",
                                    "App: Mail · Device: Other (type 'Supabase')",
                                    "Copy the 16-char password → paste above",
                                    "Enter all fields in Supabase → Project Settings → Auth → SMTP",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-2.5 mb-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <p className="text-xs text-muted-foreground">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("email")} saving={saving && saved === null} saved={saved === "email"} />
                            </div>
                        </div>
                    )}

                    {/* ── ACCESS CONTROL ── */}
                    {activeTab === "access" && (
                        <div className="bg-card border border-border/50 p-6 relative">
                            <SectionHeader icon={Lock} title="Access Control" description="Who can access what on the platform." />
                            <div className="space-y-1">
                                <SettingRow label="Free Courses Enabled" description="Allow non-premium users to access free courses.">
                                    <Toggle enabled={freeCoursesEnabled} onToggle={() => setFreeCoursesEnabled(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Premium Courses Enabled" description="Show and allow access to pro-tier content.">
                                    <Toggle enabled={premiumEnabled} onToggle={() => setPremiumEnabled(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Guest Preview Mode" description="Allow unauthenticated visitors to preview lessons.">
                                    <Toggle enabled={guestPreview} onToggle={() => setGuestPreview(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Max Free Courses per User" description="Set 0 for unlimited.">
                                    <div className="w-24">
                                        <TextInput value={maxFreeCourses} onChange={setMaxFreeCourses} type="number" />
                                    </div>
                                </SettingRow>
                            </div>

                            {/* RLS reminder */}
                            <div className="mt-6 p-3 bg-secondary/30 border border-border rounded-sm flex items-start gap-3">
                                <Database className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-foreground mb-1">Row-Level Security (RLS)</p>
                                    <p className="text-xs text-muted-foreground">
                                        Actual access enforcement is done via Supabase RLS policies on the <code className="text-accent">courses</code> and <code className="text-accent">profiles</code> tables.
                                        Run your <code className="text-accent">fix_rls_recursion.sql</code> to ensure policies are correct.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("access")} saving={saving && saved === null} saved={saved === "access"} />
                            </div>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {activeTab === "notifications" && (
                        <div className="bg-card border border-border/50 p-6 relative">
                            <SectionHeader icon={Bell} title="Admin Notifications" description="Which events trigger an email alert to your support inbox." />
                            <div className="space-y-1">
                                <SettingRow label="New User Registration" description="Email you when a new user signs up.">
                                    <Toggle enabled={newUserAlert} onToggle={() => setNewUserAlert(v => !v)} />
                                </SettingRow>
                                <SettingRow label="New Course Enrollment" description="Email you when a user enrolls in a course.">
                                    <Toggle enabled={newEnrollmentAlert} onToggle={() => setNewEnrollmentAlert(v => !v)} />
                                </SettingRow>
                                <SettingRow label="Weekly Platform Report" description="Receive a weekly summary every Monday.">
                                    <Toggle enabled={weeklyReport} onToggle={() => setWeeklyReport(v => !v)} />
                                </SettingRow>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("notifications")} saving={saving && saved === null} saved={saved === "notifications"} />
                            </div>
                        </div>
                    )}

                    {/* ── APPEARANCE ── */}
                    {activeTab === "appearance" && (
                        <div className="bg-card border border-border/50 p-6 relative">
                            <SectionHeader icon={Palette} title="Appearance" description="Visual customization for the platform." />
                            <div className="space-y-4">
                                <SettingRow label="Accent Color" description="Primary accent used across the UI.">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={accentColor}
                                            onChange={e => setAccentColor(e.target.value)}
                                            className="h-9 w-12 cursor-pointer bg-transparent border border-border p-0.5"
                                        />
                                        <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
                                    </div>
                                </SettingRow>
                                <SettingRow label="Platform Tagline" description="Shown in the hero section.">
                                    <div className="w-64">
                                        <TextInput value={platformTagline} onChange={setPlatformTagline} placeholder="Master the terminal..." />
                                    </div>
                                </SettingRow>
                                <SettingRow label="3D Robot on Dashboard" description="Show the animated robot in the dashboard hero.">
                                    <Toggle enabled={showRobotOnDashboard} onToggle={() => setShowRobotOnDashboard(v => !v)} />
                                </SettingRow>
                            </div>

                            {/* Color preview */}
                            <div className="mt-6 p-4 bg-secondary/30 border border-border rounded-sm">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="h-9 w-9 border-2" style={{ borderColor: accentColor, backgroundColor: `${accentColor}18` }} />
                                    <button className="px-4 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: accentColor }}>
                                        Button
                                    </button>
                                    <span className="text-sm font-medium" style={{ color: accentColor }}>Accent text</span>
                                    <div className="h-px flex-1 min-w-[60px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SaveButton onClick={() => handleSave("appearance")} saving={saving && saved === null} saved={saved === "appearance"} />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
