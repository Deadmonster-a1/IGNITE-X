-- Admin Role Migration

-- 1. Create the new ENUM type (if it doesn't already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;
END$$;

-- 2. Add the column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- 3. Update Courses RLS
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Courses are manageable by admin" ON courses;
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Courses are manageable by admin" ON courses FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 4. Update Modules RLS
DROP POLICY IF EXISTS "Modules are viewable by everyone" ON modules;
DROP POLICY IF EXISTS "Modules are manageable by admin" ON modules;
CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);
CREATE POLICY "Modules are manageable by admin" ON modules FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 5. Update Lessons RLS
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON lessons;
DROP POLICY IF EXISTS "Lessons are manageable by admin" ON lessons;
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Lessons are manageable by admin" ON lessons FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 6. Update Profiles RLS (Admins can view/edit all)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Provide initial admin access to our testing account
UPDATE profiles SET role = 'admin' WHERE email = 'test@example.com' OR email LIKE '%@gmail.com%';
