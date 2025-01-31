/*
  # Fix Profile and Resume Creation Flow

  1. Changes
    - Add ON DELETE CASCADE to resumes foreign key
    - Update profile creation trigger
    - Add default values for profiles

  2. Security
    - Maintain RLS policies
    - Ensure data integrity with cascading deletes
*/

-- Update resumes foreign key to cascade on delete
ALTER TABLE resumes
  DROP CONSTRAINT IF EXISTS resumes_user_id_fkey,
  ADD CONSTRAINT resumes_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;

-- Update profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add any missing profiles for existing users
INSERT INTO profiles (id, email, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(created_at, now()),
  COALESCE(last_sign_in_at, now())
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;