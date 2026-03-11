"use server"

import { createClient } from "@/utils/supabase/server"

// ==========================================
// COURSE FETCHING & ENROLLMENT LOGIC
// ==========================================

export async function getAllCourses() {
    const supabase = await createClient()

    // Fetch courses with their published status
    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching courses:", error)
        return []
    }

    return courses
}

export async function getCourseContent(courseId: string) {
    const supabase = await createClient()

    // Fetch course with its modules and lessons
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            id, title, description, thumbnail, is_premium, premium_tier,
            modules (
                id, title, sequence_order,
                lessons (
                    id, title, sequence_order, content_type, xp_reward
                )
            )
        `)
        .eq('id', courseId)
        .eq('is_deleted', false)
        .eq('modules.is_deleted', false)
        .eq('modules.lessons.is_deleted', false)
        .single()

    if (error || !course) {
        console.error("Error fetching course content:", error)
        return null
    }

    // Sort modules and lessons by sequence_order since deep sorting in Supabase JS is tricky
    course.modules.sort((a: any, b: any) => a.sequence_order - b.sequence_order)
    course.modules.forEach((module: any) => {
        module.lessons.sort((a: any, b: any) => a.sequence_order - b.sequence_order)
    })

    return course
}

export async function checkEnrollment(courseId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    return !!data
}

export async function enrollInCourse(courseId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to enroll.' }

    const { error } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
            status: 'active'
        })

    if (error && error.code !== '23505') { // 23505 is unique violation (already enrolled)
        console.error("Enrollment error:", error)
        return { error: 'Failed to enroll in course.' }
    }

    return { success: true }
}

export async function getLessonContent(lessonId: string) {
    const supabase = await createClient()

    // Fetch lesson with specific columns
    const { data: lesson, error } = await supabase
        .from('lessons')
        .select(`
            id, title, description, content_type, content, challenge_data, sequence_order, xp_reward,
            modules (
                id, title, sequence_order,
                courses ( id, title )
            )
        `)
        .eq('id', lessonId)
        .eq('is_deleted', false)
        .single()

    if (error || !lesson) {
        console.error("Error fetching lesson content:", error, lessonId)
        return null
    }

    return lesson
}

