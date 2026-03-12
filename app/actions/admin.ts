"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { createModule, createLesson } from "./curriculum"

// ─── Users ───────────────────────────────────────────────────
export async function getAllUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role, rank, xp, created_at, bio, avatar_url, is_banned")
        .order("created_at", { ascending: false })
    if (error) return { success: false, error: error.message }

    // Fetch auth users to get last_sign_in_at
    try {
        const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
        const authMap = new Map(authData?.users?.map(u => [u.id, u.last_sign_in_at]) ?? [])
        const users = (data || []).map(p => ({
            ...p,
            last_sign_in_at: authMap.get(p.id) ?? null,
        }))
        return { success: true, users }
    } catch {
        return { success: true, users: data || [] }
    }
}

export async function updateUserRole(userId: string, role: "user" | "admin" | "super_admin") {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/users")
    return { success: true }
}

export async function updateUserXP(userId: string, xp: number) {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ xp }).eq("id", userId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/users")
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").delete().eq("id", userId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/users")
    return { success: true }
}

export async function banUser(userId: string, banned: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").update({ is_banned: banned }).eq("id", userId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/users")
    return { success: true }
}

// ─── Courses ─────────────────────────────────────────────────
export async function getAdminCourses() {
    const supabase = await createClient()
    
    // Fetch base courses
    let { data, error } = await supabase
        .from("courses")
        .select(`
            id, title, description, slug, is_published, is_premium,
            thumbnail_url, difficulty, duration_hours, created_at,
            modules:modules(count)
        `)
        .order("created_at", { ascending: false })

    if (error) {
        const fallback = await supabase
            .from("courses")
            .select(`id, title, description, is_published, is_premium, created_at, modules:modules(count)`)
            .order("created_at", { ascending: false })
        if (fallback.error) return { success: false, error: fallback.error.message }
        data = fallback.data as any
    }

    // Fetch enrollments count for each course
    const coursesWithStats = await Promise.all((data || []).map(async (c: any) => {
        const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id)

        return {
            ...c,
            module_count: c.modules?.[0]?.count ?? 0,
            lesson_count: 0, 
            enrollment_count: count ?? 0
        }
    }))

    return { success: true, courses: coursesWithStats }
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from("courses").update({ is_published: !isPublished }).eq("id", courseId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/courses")
    revalidatePath("/courses")
    return { success: true }
}

export async function toggleCoursePremium(courseId: string, isPremium: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from("courses").update({ is_premium: !isPremium }).eq("id", courseId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/courses")
    revalidatePath("/courses")
    return { success: true }
}

export async function updateCourseDetails(courseId: string, values: {
    title?: string; description?: string; difficulty?: string; duration_hours?: number; thumbnail_url?: string
}) {
    const supabase = await createClient()
    // Build update object; only include enhanced fields if they have a value
    const updateData: any = { updated_at: new Date().toISOString() }
    if (values.title !== undefined) updateData.title = values.title
    if (values.description !== undefined) updateData.description = values.description
    // These columns require the SQL migration to have been run:
    if (values.difficulty !== undefined) updateData.difficulty = values.difficulty
    if (values.duration_hours !== undefined) updateData.duration_hours = values.duration_hours
    if (values.thumbnail_url !== undefined) updateData.thumbnail_url = values.thumbnail_url
    const { error } = await supabase.from("courses").update(updateData).eq("id", courseId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/courses")
    revalidatePath("/courses")
    return { success: true }
}

export async function createCourse(values: {
    title: string; description: string; slug: string; difficulty: string; duration_hours: number; is_premium: boolean; template?: string
}) {
    const supabase = await createClient()
    // Try with all fields first; fall back to just base fields if migration hasn't run
    const fullInsert = await supabase.from("courses").insert({
        title: values.title,
        description: values.description,
        slug: values.slug,
        difficulty: values.difficulty,
        duration_hours: values.duration_hours,
        is_premium: values.is_premium,
        is_published: false
    }).select("id").single()

    if (fullInsert.error) {
        // Fallback: insert only base columns (without slug/difficulty/duration_hours)
        const { error } = await supabase.from("courses").insert({
            title: values.title,
            description: values.description,
            is_premium: values.is_premium,
            is_published: false,
        })
        if (error) return { success: false, error: `Migration required: Run add_course_columns.sql in Supabase, then retry. (${error.message})` }
        revalidatePath("/admin/courses")
        revalidatePath("/courses")
        return { success: true }
    }

    const courseId = fullInsert.data.id

    // Apply Templates
    if (values.template === "crash_course") {
        const modRes = await createModule(courseId, "Complete Course", 1)
        if (modRes.success && modRes.moduleId) {
            await createLesson(modRes.moduleId, { title: "Introduction", sequence_order: 1, content_type: "text" })
            await createLesson(modRes.moduleId, { title: "Core Concepts", sequence_order: 2, content_type: "text" })
            await createLesson(modRes.moduleId, { title: "Final Exam", sequence_order: 3, content_type: "text" })
        }
    } else if (values.template === "masterclass") {
        const modules = [
            { title: "Beginner Basics", lessons: ["Welcome & Setup", "Syntax Crash Course", "Writing Your First Script"] },
            { title: "Intermediate Deep Dive", lessons: ["Data Structures", "Functions & Scope", "Error Handling"] },
            { title: "Advanced Patterns", lessons: ["Object Oriented Programming", "Async & Concurrency", "Design Patterns"] },
            { title: "Capstone Project", lessons: ["Project Overview", "Building the Core", "Deployment & Wrap Up"] },
        ]
        for (let i = 0; i < modules.length; i++) {
            const modRes = await createModule(courseId, modules[i].title, i + 1)
            if (modRes.success && modRes.moduleId) {
                for (let j = 0; j < modules[i].lessons.length; j++) {
                    await createLesson(modRes.moduleId, { title: modules[i].lessons[j], sequence_order: j + 1, content_type: "text" })
                }
            }
        }
    }

    revalidatePath("/admin/courses")
    revalidatePath("/courses")
    return { success: true }
}

export async function deleteCourse(courseId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("courses").delete().eq("id", courseId)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/courses")
    revalidatePath("/courses")
    return { success: true }
}

// ─── Testimonials ─────────────────────────────────────────────
export async function getAllTestimonialsAdmin() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("testimonials")
        .select("*, profiles(name, email)")
        .order("created_at", { ascending: false })
    if (error) return { success: false, error: error.message }
    return { success: true, testimonials: data }
}

export async function approveTestimonial(id: string, approve: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from("testimonials").update({ is_approved: approve }).eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
}

export async function deleteTestimonial(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("testimonials").delete().eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
}

// ─── Stats ────────────────────────────────────────────────────
export async function getAdminStats() {
    const supabase = await createClient()
    const [usersRes, coursesRes, testimonialsRes, enrollRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: newToday } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today.toISOString())

    return {
        success: true,
        stats: {
            totalUsers: usersRes.count ?? 0,
            totalCourses: coursesRes.count ?? 0,
            totalTestimonials: testimonialsRes.count ?? 0,
            totalEnrollments: enrollRes.count ?? 0,
            newUsersToday: newToday ?? 0,
        },
    }
}

// ─── Recent Activity ──────────────────────────────────────────
export async function getRecentActivity() {
    const supabase = await createClient()
    const { data } = await supabase
        .from("profiles")
        .select("id, name, email, role, created_at")
        .order("created_at", { ascending: false })
        .limit(8)
    return { success: true, users: data ?? [] }
}

// ─── Announcements ────────────────────────────────────────────
export async function getAnnouncements() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
    if (error) return { success: false, announcements: [] }
    return { success: true, announcements: data ?? [] }
}

export async function createAnnouncement(values: { title: string; content: string; type: string; is_active: boolean }) {
    const supabase = await createClient()
    const { error } = await supabase.from("announcements").insert(values)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/announcements")
    revalidatePath("/dashboard")
    return { success: true }
}

export async function deleteAnnouncement(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("announcements").delete().eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/announcements")
    revalidatePath("/dashboard")
    return { success: true }
}

export async function toggleAnnouncement(id: string, isActive: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from("announcements").update({ is_active: !isActive }).eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/announcements")
    revalidatePath("/dashboard")
    return { success: true }
}
