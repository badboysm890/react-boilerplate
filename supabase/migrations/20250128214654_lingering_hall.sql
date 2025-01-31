/*
  # Fix Authentication Trigger and Profile Creation

  1. Changes
    - Improve profile creation trigger
    - Add better error handling
    - Fix race conditions in profile creation
    - Add missing indexes
  
  2. Security
    - Maintain RLS policies
    - Ensure proper cascade behavior
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function for handling new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_name text;
BEGIN
  -- Set a default name from email if not provided
  default_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    SPLIT_PART(new.email, '@', 1)
  );

  -- Insert with conflict handling
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    default_name,
    COALESCE(new.created_at, now()),
    COALESCE(new.created_at, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now()
  WHERE profiles.full_name IS NULL OR profiles.full_name = '';

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details to Supabase's internal logging
    RAISE LOG 'Error in handle_new_user(): %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger with better timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Ensure foreign key constraints are correct
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update any existing profiles that might have issues
UPDATE profiles
SET
  full_name = COALESCE(
    full_name,
    SPLIT_PART(email, '@', 1)
  ),
  updated_at = now()
WHERE full_name IS NULL OR full_name = '';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;