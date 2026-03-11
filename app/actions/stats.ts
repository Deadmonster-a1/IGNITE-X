"use server"

import { createClient } from "@/utils/supabase/server"

export async function getPlatformStats() {
    const supabase = await createClient()

    try {
        // 1. Avg Testimonial Rating
        const { data: testimonials } = await supabase
            .from('testimonials')
            .select('rating')
            .eq('is_approved', true)

        let avgRating = 4.9
        if (testimonials && testimonials.length > 0) {
            const sum = testimonials.reduce((acc, t) => acc + (t.rating || 5), 0)
            avgRating = Number((sum / testimonials.length).toFixed(1))
        }

        // 2. Community Network (total users)
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        // 3. Real-World Projects / Shipped Apps (total courses)
        const { count: courseCount } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true)

        // 4. Learning Paths (premium courses)
        const { count: pathCount } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true)
            .eq('is_premium', true)

        return {
            avgRating: `${avgRating}/5`,
            members: userCount ? `${userCount > 1000 ? (userCount / 1000).toFixed(1) + 'K+' : userCount}` : "2.4K+",
            projects: courseCount ? `${courseCount}+` : "12+",
            paths: pathCount ? `${pathCount}` : "8"
        }
    } catch (e) {
        console.error("Error fetching platform stats:", e)
        return {
            avgRating: "4.9/5",
            members: "2.4K+",
            projects: "12",
            paths: "8"
        }
    }
}
