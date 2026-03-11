"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// 1. Define Zod schema for strict input validation
const markLessonCompleteSchema = z.object({
    lessonId: z.string().uuid("Invalid Lesson ID format"),
    courseId: z.string().uuid("Invalid Course ID format").optional(),
})

/**
 * Securely marks a lesson as complete and calls the RPC to award XP.
 * Validates input with Zod and enforces server-side only execution.
 */
export async function markLessonComplete(rawInput: { lessonId: string; courseId?: string }) {
    try {
        // 2. Validate input
        const validated = markLessonCompleteSchema.safeParse(rawInput)
        if (!validated.success) {
            return {
                success: false,
                error: "Invalid input data",
                details: validated.error.flatten().fieldErrors
            }
        }

        const { lessonId, courseId } = validated.data
        const supabase = await createClient()

        // 3. Verify User Session (Zero-Trust)
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: "Unauthorized. Please initialize a valid session." }
        }

        // 4. Execute the secure RPC
        // The RPC 'complete_lesson_and_award_xp' runs with SECURITY DEFINER
        // It guarantees atomic operations: marks completed + adds XP
        const { data, error: rpcError } = await supabase.rpc('complete_lesson_and_award_xp', {
            p_lesson_id: lessonId,
            // the RPC internally uses auth.uid() to identify the user making the request
        })

        if (rpcError) {
            console.error("[GAMIFICATION_ERROR] RPC Failed:", rpcError)
            return { success: false, error: "Failed to sync protocol with the mainframe." }
        }

        // Handle the custom JSONB return from our RPC
        if (!data.success) {
            return { success: false, error: data.error }
        }

        // 5. Purge Next.js Cache for related paths
        revalidatePath(`/dashboard`)
        if (courseId) {
            revalidatePath(`/courses/${courseId}`)
            revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)
        }

        return {
            success: true,
            message: data.message,
            xpAwarded: data.xp_awarded
        }

    } catch (err: any) {
        console.error("[GAMIFICATION_ERROR] Unexpected failure:", err)
        return { success: false, error: "A critical system error occurred during synchronization." }
    }
}
