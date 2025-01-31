/*
  # Fix Security Policies

  1. Changes
    - Update RLS policies for profiles and resumes
    - Add proper security checks for public access
    - Fix visibility controls
  
  2. Security
    - Ensure users can only see their own data
    - Allow public access only to explicitly shared content
    - Protect sensitive information
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can create own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;
DROP POLICY IF EXISTS "Anyone can view public resumes" ON resumes;

-- Create new policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view minimal profile info"
  ON profiles FOR SELECT
  TO anon
  USING (
    -- Only allow viewing profiles with public resumes
    id IN (
      SELECT user_id 
      FROM resumes 
      WHERE is_public = true
    )
    OR
    -- Or profiles that have set a public resume
    public_resume_id IS NOT NULL
  );

-- Create new policies for resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (
    -- User can view their own resumes
    auth.uid() = user_id
    OR
    -- Or public resumes
    (is_public = true)
    OR
    -- Or resumes that are set as public resume in profiles
    id IN (
      SELECT public_resume_id 
      FROM profiles 
      WHERE public_resume_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view shared resumes"
  ON resumes FOR SELECT
  TO anon
  USING (
    is_public = true
    OR
    id IN (
      SELECT public_resume_id 
      FROM profiles 
      WHERE public_resume_id IS NOT NULL
    )
  );

-- Create function to check if a user can access a resume
CREATE OR REPLACE FUNCTION can_access_resume(resume_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM resumes r
    WHERE r.id = resume_id
    AND (
      r.user_id = auth.uid()
      OR r.is_public = true
      OR r.id IN (
        SELECT public_resume_id 
        FROM profiles 
        WHERE public_resume_id IS NOT NULL
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke direct table access
REVOKE ALL ON profiles FROM anon, authenticated;
REVOKE ALL ON resumes FROM anon, authenticated;

-- Grant specific permissions
GRANT SELECT ON profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON resumes TO authenticated;
GRANT SELECT ON resumes TO anon;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id_public ON resumes(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_public_resume ON profiles(public_resume_id);