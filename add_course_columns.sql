-- Migration: Add missing columns to courses table
-- Run this in your Supabase SQL editor

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Beginner',
  ADD COLUMN IF NOT EXISTS duration_hours NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Insert the Python course (will be in Draft by default, publish from admin panel)
INSERT INTO public.courses (title, slug, description, difficulty, duration_hours, is_published, is_premium)
VALUES (
  'Python for Z — Architect Edition',
  'python',
  'A systems-building roadmap that transforms you from learning syntax to architecting, deploying, and scaling production-ready Python applications.',
  'Intermediate',
  40,
  true,
  false
)
ON CONFLICT (slug) DO NOTHING;
