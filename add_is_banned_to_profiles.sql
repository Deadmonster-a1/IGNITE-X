-- ============================================================
-- ASCI Admin: Profiles Table - Add is_banned column
-- Run this in your Supabase SQL Editor if not already present
-- ============================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false;

-- Comment explaining the column
COMMENT ON COLUMN public.profiles.is_banned IS 'When true, user is blocked from accessing the platform.';
