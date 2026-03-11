-- ============================================================
-- Fix: Infinite Recursion in Profiles RLS Policies
-- ============================================================
-- The problem: Our admin RLS policies check the `profiles` table
-- to determine if a user is an admin. But those checks ARE on the
-- `profiles` table itself, causing Postgres to loop forever.
--
-- The fix: Create a SECURITY DEFINER function that bypasses RLS
-- when checking if a user has the admin role. This breaks the loop.
-- ============================================================

-- Step 1: Create a safe helper function that checks admin role
-- using SECURITY DEFINER (runs as the function owner, bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 2: Remove all the old broken admin RLS policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins update all profiles." ON public.profiles;

-- Step 3: Fix admin policies on courses, modules, lessons
-- (These also check profiles, so they need the safe helper)
DROP POLICY IF EXISTS "Courses are manageable by admin" ON public.courses;
DROP POLICY IF EXISTS "Modules are manageable by admin" ON public.modules;
DROP POLICY IF EXISTS "Lessons are manageable by admin" ON public.lessons;
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Admins manage modules" ON public.modules;
DROP POLICY IF EXISTS "Admins manage lessons" ON public.lessons;

-- Step 4: Recreate all admin policies using the SAFE helper function
-- Profiles (admins can view and update all)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin_safe());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_safe());

-- Courses
CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (public.is_admin_safe());

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE
  USING (public.is_admin_safe());

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  USING (public.is_admin_safe());

-- Modules
CREATE POLICY "Admins manage modules"
  ON public.modules FOR ALL
  USING (public.is_admin_safe());

-- Lessons
CREATE POLICY "Admins manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_admin_safe());

-- Done! The safe function bypasses RLS when checking admin status,
-- breaking the infinite recursion loop.
