-- LEVEL-X: Enterprise Supabase Schema
-- Includes CASCADE drops to remove old dependent policies safely

-------------------------------------------------------------------
-- 0. CLEANUP OLD CONFLICTING SCHEMA
-------------------------------------------------------------------
-- Drop the old role and phone columns, and CASCADE will automatically 
-- delete any old RLS policies that depended on them.
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS role CASCADE;
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS phone CASCADE;

-------------------------------------------------------------------
-- 1. Helper Functions for JWT RBAC
-------------------------------------------------------------------
-- Checks if the current user has the 'admin' role in their JWT
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'admin',
    current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role' = 'admin',
    false
  );
$$;

-------------------------------------------------------------------
-- 2. ENUMS
-------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('video', 'text', 'quiz');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_status AS ENUM ('in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-------------------------------------------------------------------
-- 3. CORE TABLES
-------------------------------------------------------------------

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  streak_count INTEGER DEFAULT 0 NOT NULL,
  last_active_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  is_published BOOLEAN DEFAULT false NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  premium_tier TEXT,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- MODULES
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  sequence_order INTEGER NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type content_type DEFAULT 'text'::content_type NOT NULL,
  sequence_order INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 50 NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  status enrollment_status DEFAULT 'active'::enrollment_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- LESSON PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  status lesson_status DEFAULT 'in_progress'::lesson_status NOT NULL,
  time_spent INTEGER DEFAULT 0 NOT NULL, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies to avoid duplicates
-- The CASCADE drop earlier should have removed the ones attached to `role`
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins update all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Published courses are viewable by everyone." ON public.courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Modules viewable if not deleted" ON public.modules;
DROP POLICY IF EXISTS "Admins manage modules" ON public.modules;
DROP POLICY IF EXISTS "Lessons viewable if not deleted" ON public.lessons;
DROP POLICY IF EXISTS "Admins manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users view own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users insert own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users update own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users view own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users insert own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users update own progress time" ON public.lesson_progress;

-- RECREATE POLICIES (Using the new is_admin helper)
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins update all profiles." ON public.profiles FOR UPDATE USING (public.is_admin());

-- Courses
CREATE POLICY "Published courses are viewable by everyone." ON public.courses FOR SELECT USING (is_published = true AND is_deleted = false OR public.is_admin());
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (public.is_admin());

-- Modules & Lessons
CREATE POLICY "Modules viewable if not deleted" ON public.modules FOR SELECT USING (is_deleted = false OR public.is_admin());
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL USING (public.is_admin());

CREATE POLICY "Lessons viewable if not deleted" ON public.lessons FOR SELECT USING (is_deleted = false OR public.is_admin());
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL USING (public.is_admin());

-- Enrollments
CREATE POLICY "Users view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Lesson Progress
CREATE POLICY "Users view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress time" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-------------------------------------------------------------------
-- 5. SERVER-SIDE RPC FOR GAMIFICATION INTEGRITY
-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_lesson_and_award_xp(
  p_lesson_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_progress_id UUID;
  v_current_status lesson_status;
  v_xp_reward INTEGER;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized. Must be logged in.');
  END IF;

  SELECT xp_reward INTO v_xp_reward
  FROM public.lessons 
  WHERE id = p_lesson_id AND is_deleted = false;

  IF v_xp_reward IS NULL THEN
     RETURN jsonb_build_object('success', false, 'error', 'Lesson not found or deleted.');
  END IF;

  SELECT id, status INTO v_progress_id, v_current_status
  FROM public.lesson_progress
  WHERE user_id = v_user_id AND lesson_id = p_lesson_id;

  IF v_current_status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Lesson already completed. No XP awarded.');
  END IF;

  IF v_progress_id IS NULL THEN
    INSERT INTO public.lesson_progress (user_id, lesson_id, status, completed_at)
    VALUES (v_user_id, p_lesson_id, 'completed', NOW());
  ELSE
    UPDATE public.lesson_progress
    SET status = 'completed', completed_at = NOW()
    WHERE id = v_progress_id;
  END IF;

  UPDATE public.profiles
  SET xp = xp + v_xp_reward, last_active_date = CURRENT_DATE
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Lesson completed successfully.', 
    'xp_awarded', v_xp_reward
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-------------------------------------------------------------------
-- 6. TRIGGERS
-------------------------------------------------------------------
-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name',
      new.email,
      'Student'
    )
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-------------------------------------------------------------------
-- 7. TESTIMONIALS
-------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cohort TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Clean up policies to prevent duplication
DROP POLICY IF EXISTS "Approved testimonials are viewable by everyone." ON public.testimonials;
DROP POLICY IF EXISTS "Users can insert their own testimonials." ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage all testimonials." ON public.testimonials;

-- Recreate policies
CREATE POLICY "Approved testimonials are viewable by everyone." ON public.testimonials FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Users can insert their own testimonials." ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all testimonials." ON public.testimonials FOR ALL USING (public.is_admin());
