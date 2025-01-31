-- Add columns to profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'slug') THEN
    ALTER TABLE profiles ADD COLUMN slug text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_slug_key UNIQUE (slug);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'public_resume_id') THEN
    ALTER TABLE profiles ADD COLUMN public_resume_id uuid;
  END IF;
END $$;

-- Add is_public column to resumes if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resumes' AND column_name = 'is_public') THEN
    ALTER TABLE resumes ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_public_resume_id_fkey') THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_public_resume_id_fkey 
    FOREIGN KEY (public_resume_id) 
    REFERENCES resumes(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);
CREATE INDEX IF NOT EXISTS idx_resumes_is_public ON resumes(is_public);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Create or replace the function to generate profile slugs
CREATE OR REPLACE FUNCTION generate_profile_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Skip if slug is already set
  IF NEW.slug IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Generate base slug from email (remove @domain.com and special chars)
  base_slug := LOWER(SPLIT_PART(NEW.email, '@', 1));
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Try the base slug first
  new_slug := base_slug;
  
  -- If slug exists, append numbers until we find a unique one
  WHILE EXISTS (SELECT 1 FROM profiles WHERE slug = new_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS ensure_profile_slug ON profiles;
CREATE TRIGGER ensure_profile_slug
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_profile_slug();

-- Drop and recreate the policy for public resume access
DROP POLICY IF EXISTS "Anyone can view public resumes" ON resumes;
CREATE POLICY "Anyone can view public resumes"
  ON resumes FOR SELECT
  USING (
    is_public = true 
    OR 
    id IN (
      SELECT public_resume_id 
      FROM profiles 
      WHERE public_resume_id IS NOT NULL
    )
  );

-- Generate slugs for existing profiles that don't have one
UPDATE profiles 
SET slug = subquery.new_slug
FROM (
  SELECT 
    id,
    LOWER(SPLIT_PART(email, '@', 1)) || '-' || id as new_slug
  FROM profiles 
  WHERE slug IS NULL
) as subquery
WHERE profiles.id = subquery.id;

-- Create policy for public profile access
DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
CREATE POLICY "Anyone can view public profiles"
  ON profiles FOR SELECT
  USING (true);