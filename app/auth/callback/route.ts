import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Universal Auth Callback Handler
 * Handles all Supabase email flows:
 *  - Email confirmation (signup)
 *  - Password reset
 *  - User invite
 *  - Email change confirmation
 *  - Magic link login
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') // e.g. "recovery", "invite", "email_change", "signup", "magiclink"
    const next = searchParams.get('next') ?? '/dashboard'

    const supabase = await createClient()

    // --- PKCE flow (most modern flows use this) ---
    if (code) {
        const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error || !authData.user) {
            return NextResponse.redirect(`${origin}/login?error=Authentication+failed`)
        }

        // Route based on email type
        if (type === 'recovery') {
            // Password reset — send directly to the reset page (session already set)
            return NextResponse.redirect(`${origin}/reset-password`)
        }

        if (type === 'invite') {
            // Admin-sent invite — let user set their name and password
            return NextResponse.redirect(`${origin}/auth/invite`)
        }

        if (type === 'email_change') {
            // Email address change confirmation
            return NextResponse.redirect(`${origin}/auth/confirm-email`)
        }

        // Signup confirmation or magic link — check admin role then redirect
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single()

        const redirectUrl = (profile?.role === 'admin' || profile?.role === 'super_admin')
            ? '/dashboard'
            : next

        return NextResponse.redirect(`${origin}${redirectUrl}`)
    }

    // --- Legacy token_hash flow (older Supabase emails) ---
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })

        if (error) {
            return NextResponse.redirect(`${origin}/login?error=Authentication+failed`)
        }

        if (type === 'recovery') return NextResponse.redirect(`${origin}/reset-password`)
        if (type === 'invite') return NextResponse.redirect(`${origin}/auth/invite`)
        if (type === 'email_change') return NextResponse.redirect(`${origin}/auth/confirm-email`)

        return NextResponse.redirect(`${origin}${next}`)
    }

    // Fallback
    return NextResponse.redirect(`${origin}/login?error=Authentication+failed`)
}
