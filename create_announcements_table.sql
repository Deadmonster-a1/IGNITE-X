-- ============================================================
-- ASCI Admin: Announcements Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.announcements (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title       text NOT NULL,
    content     text NOT NULL,
    type        text NOT NULL DEFAULT 'info'
                    CHECK (type IN ('info', 'warning', 'success', 'promo')),
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz DEFAULT now() NOT NULL,
    updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "admins_full_access_announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
);

-- Everyone can read active announcements (for dashboard display)
CREATE POLICY "public_read_active_announcements"
ON public.announcements
FOR SELECT
USING (is_active = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_announcements_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_announcements_timestamp();

-- Sample announcements so the admin panel isn't empty
INSERT INTO public.announcements (title, content, type, is_active) VALUES
    ('Welcome to ASCI', 'Your learning journey begins now. Check out the Python course to get started.', 'info', true),
    ('Module Updates', 'New exercises have been added to Module 3. Check the latest content!', 'success', false);
