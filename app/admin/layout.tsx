import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, name, email")
        .eq("id", user.id)
        .single()

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen bg-[#050505]">
            <AdminSidebar userName={profile.name || user.email || "Admin"} userRole={profile.role} />
            <main className="flex-1 ml-0 md:ml-64 min-h-screen">
                <div className="relative min-h-screen">
                    {/* Subtle grid background */}
                    <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-[0.02]" aria-hidden="true" />
                    {/* Corner accent */}
                    <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 opacity-[0.03] blur-3xl"
                        style={{ background: "radial-gradient(circle, #f26722, transparent 70%)" }} />
                    <div className="relative z-10 p-6 sm:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
