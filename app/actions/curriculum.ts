"use server"

import { createClient } from "@/utils/supabase/server"

// ==========================================
// ADMIN MODULE MANAGEMENT
// ==========================================

export async function createModule(courseId: string, title: string, sequenceOrder: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data, error } = await supabase
        .from('modules')
        .insert({
            course_id: courseId,
            title,
            sequence_order: sequenceOrder,
            is_deleted: false
        })
        .select('id')
        .single()

    if (error) {
        console.error("Error creating module:", error)
        return { error: error.message }
    }

    return { success: true, moduleId: data.id }
}

export async function updateModule(moduleId: string, title: string, sequenceOrder: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('modules')
        .update({ title, sequence_order: sequenceOrder, updated_at: new Date().toISOString() })
        .eq('id', moduleId)

    if (error) {
        console.error("Error updating module:", error)
        return { error: error.message }
    }

    return { success: true }
}

export async function deleteModule(moduleId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Soft delete module
    const { error } = await supabase
        .from('modules')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', moduleId)

    if (error) {
        console.error("Error deleting module:", error)
        return { error: error.message }
    }

    return { success: true }
}

export async function reorderModule(courseId: string, moduleId: string, direction: "up" | "down") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch all active modules for the course
    const { data: modules, error: fetchErr } = await supabase
        .from('modules')
        .select('id, sequence_order')
        .eq('course_id', courseId)
        .eq('is_deleted', false)
        .order('sequence_order', { ascending: true });

    if (fetchErr || !modules) return { error: fetchErr?.message || "Error fetching modules" };

    const currentIndex = modules.findIndex((m: any) => m.id === moduleId);
    if (currentIndex === -1) return { error: "Module not found" };

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return { success: true }; // Can't move further

    // Swap sequence orders
    const currentMod = modules[currentIndex];
    const targetMod = modules[targetIndex];

    const { error: updateErr1 } = await supabase.from('modules').update({ sequence_order: targetMod.sequence_order }).eq('id', currentMod.id);
    const { error: updateErr2 } = await supabase.from('modules').update({ sequence_order: currentMod.sequence_order }).eq('id', targetMod.id);

    if (updateErr1 || updateErr2) return { error: "Failed to reorder modules" };
    return { success: true };
}

// ==========================================
// ADMIN LESSON MANAGEMENT
// ==========================================

export async function createLesson(moduleId: string, payload: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data, error } = await supabase
        .from('lessons')
        .insert({
            module_id: moduleId,
            title: payload.title || "New Lesson",
            description: payload.description || "",
            content: payload.content || "",
            content_type: payload.content_type || "text",
            sequence_order: payload.sequence_order || 1,
            xp_reward: payload.xp_reward || 0,
            challenge_data: payload.challenge_data || null,
            is_deleted: false
        })
        .select('id')
        .single()

    if (error) {
        console.error("Error creating lesson:", error)
        return { error: error.message }
    }

    return { success: true, lessonId: data.id }
}

export async function updateLesson(lessonId: string, payload: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('lessons')
        .update({
            ...payload,
            updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)

    if (error) {
        console.error("Error updating lesson:", error)
        return { error: error.message }
    }

    return { success: true }
}

export async function deleteLesson(lessonId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('lessons')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', lessonId)

    if (error) {
        console.error("Error deleting lesson:", error)
        return { error: error.message }
    }

    return { success: true }
}

export async function reorderLesson(moduleId: string, lessonId: string, direction: "up" | "down") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch all active lessons for the module
    const { data: lessons, error: fetchErr } = await supabase
        .from('lessons')
        .select('id, sequence_order')
        .eq('module_id', moduleId)
        .eq('is_deleted', false)
        .order('sequence_order', { ascending: true });

    if (fetchErr || !lessons) return { error: fetchErr?.message || "Error fetching lessons" };

    const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);
    if (currentIndex === -1) return { error: "Lesson not found" };

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return { success: true }; // Can't move further

    // Swap sequence orders
    const currentLes = lessons[currentIndex];
    const targetLes = lessons[targetIndex];

    const { error: updateErr1 } = await supabase.from('lessons').update({ sequence_order: targetLes.sequence_order }).eq('id', currentLes.id);
    const { error: updateErr2 } = await supabase.from('lessons').update({ sequence_order: currentLes.sequence_order }).eq('id', targetLes.id);

    if (updateErr1 || updateErr2) return { error: "Failed to reorder lessons" };
    return { success: true };
}
