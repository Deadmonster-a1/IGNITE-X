-- Fix: Add missing columns to profiles table

-- 1. Add bio column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Add rank column (used in dashboard to display user rank like "Architect", "Junior", etc.)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Recruit';

-- 3. Add avatar_url column (to save persistent avatar choice to DB)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Confirm the changes
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
