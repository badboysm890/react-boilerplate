/*
  # Add profile slugs and sharing functionality

  1. Changes
    - Add slug column to profiles table
    - Add public sharing flag to resumes table
    - Add unique constraint on profile slugs
    - Add policy for public resume access
*/

-- Add slug column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS public_resume_id uuid REFERENCES resumes(id);

-- Add public flag to resumes
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create policy for public resume access
CREATE POLICY "Anyone can view public resumes"
  ON resumes FOR SELECT
  USING (is_public = true);