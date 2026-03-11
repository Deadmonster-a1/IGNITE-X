-- ============================================================
-- MISSING: Create the testimonials table
-- Run this in Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  cohort TEXT DEFAULT 'Community Learner',
  is_approved BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved testimonials (for landing page)
CREATE POLICY "Approved testimonials are publicly readable"
  ON public.testimonials FOR SELECT
  USING (is_approved = true);

-- Users can view their own testimonials (even unapproved)
CREATE POLICY "Users can view their own testimonials"
  ON public.testimonials FOR SELECT
  USING (auth.uid() = user_id);

-- Users can write their own testimonials
CREATE POLICY "Users can insert their own testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own (unapproved) testimonials
CREATE POLICY "Users can update their own testimonials"
  ON public.testimonials FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false);

-- Admins can approve/delete testimonials
CREATE POLICY "Admins can manage all testimonials"
  ON public.testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_testimonials_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_testimonials_updated
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE PROCEDURE public.handle_testimonials_update();
