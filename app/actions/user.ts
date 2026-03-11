"use server"

import { createClient } from "@/utils/supabase/server"

// ==========================================
// USER PROFILE FETCHING LOGIC
// ==========================================

export async function getUserProfile() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, email, xp, streak_count, last_active_date')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error("Error fetching user profile:", error)
        return null
    }

    // Determine Rank based on XP
    let rank = "Initiate"
    if (profile.xp >= 500) rank = "Operative"
    if (profile.xp >= 2000) rank = "Specialist"
    if (profile.xp >= 5000) rank = "Architect"
    if (profile.xp >= 10000) rank = "Prime"

    return {
        ...profile,
        rank
    }
}

export async function getUserEnrollmentsWithProgress() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch enrollments, the course details, and calculate progress based on lesson_progress
    const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
            id, status,
            course:courses (
                id, title, slug, thumbnail, is_premium, premium_tier,
                modules (
                    id, is_deleted,
                    lessons (id, is_deleted)
                )
            )
        `)
        .eq('user_id', user.id)

    if (error || !enrollments) {
        console.error("Error fetching enrollments:", error)
        return []
    }

    // Fetch user's completed lessons
    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')

    const completedLessonIds = new Set(progress?.map(p => p.lesson_id) || [])

    // Process each enrollment to calculate progress percentage
    const processedEnrollments = enrollments.map((enr: any) => {
        const course = enr.course
        let totalLessons = 0
        let completedLessonsForCourse = 0

        if (course && Array.isArray(course.modules)) {
            course.modules.filter((m: any) => !m.is_deleted).forEach((module: any) => {
                if (Array.isArray(module.lessons)) {
                    module.lessons.filter((l: any) => !l.is_deleted).forEach((lesson: any) => {
                        totalLessons++
                        if (completedLessonIds.has(lesson.id)) {
                            completedLessonsForCourse++
                        }
                    })
                }
            })
        }

        const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessonsForCourse / totalLessons) * 100)

        return {
            enrollmentId: enr.id,
            status: enr.status,
            courseId: course.id,
            slug: course.slug,
            title: course.title,
            thumbnail: course.thumbnail,
            isPremium: course.is_premium,
            totalLessons,
            completedLessons: completedLessonsForCourse,
            progressPercent
        }
    })

    return processedEnrollments
}
