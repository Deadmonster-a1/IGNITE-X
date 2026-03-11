"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTestimonials() {
    const supabase = await createClient()

    // Fetch approved testimonials with profile data (name, avatar, etc)
    const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select(`
            id, cohort, content, rating, created_at,
            profiles ( name, xp )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching testimonials:", error)
        return []
    }

    // Format for the UI
    return testimonials.map((t: any) => {
        const name = t.profiles?.name || "Anonymous User"
        // Generate a simple avatar from initials
        const avatar = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

        let role = "Student"
        if (t.profiles?.xp > 5000) role = "Elite Scholar"
        else if (t.profiles?.xp > 2000) role = "Advanced Student"
        else if (t.profiles?.xp > 500) role = "Active Student"

        return {
            id: t.id,
            name,
            role,
            cohort: t.cohort || "Community Learner",
            avatar,
            content: t.content,
            rating: t.rating
        }
    })
}

export async function createTestimonial(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to post a review.' }

    const content = formData.get('content') as string
    const ratingStr = formData.get('rating') as string
    const cohort = formData.get('cohort') as string

    if (!content || content.length < 10) return { error: 'Review must be at least 10 characters long.' }

    const rating = ratingStr ? parseInt(ratingStr) : 5
    if (rating < 1 || rating > 5) return { error: 'Rating must be between 1 and 5.' }

    const { error } = await supabase
        .from('testimonials')
        .insert({
            user_id: user.id,
            content,
            rating,
            cohort,
            is_approved: true // Default true for this MVP, could be false if moderation is needed
        })

    if (error) {
        console.error("Error submitting testimonial:", error)
        return { error: 'Failed to submit review. Please try again later.' }
    }

    revalidatePath('/')
    return { success: true }
}

// ── Admin-only actions ────────────────────────────────────────

export async function getAllTestimonialsAdmin() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') return { error: 'Forbidden' }

    const { data, error } = await supabase
        .from('testimonials')
        .select(`
            id, cohort, content, rating, is_approved, created_at,
            profiles ( name, email )
        `)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { success: true, testimonials: data || [] }
}

export async function approveTestimonial(id: string, approved: boolean) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') return { error: 'Forbidden' }

    const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: approved })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
}

export async function deleteTestimonial(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') return { error: 'Forbidden' }

    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
}

