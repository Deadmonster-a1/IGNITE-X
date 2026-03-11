-- Fix for Supabase Auth Signup Trigger
-- Dropping the trigger first ensures we can replace the function cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function explicitly handling the new role column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name',
      new.email,
      'Student'
    ),
    'user'::public.user_role
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Extremely important: if we swallow errors here without logging, signups will silently fail with {}
  RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
