-- Add watermark settings to resumes
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS watermark_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS watermark_text text DEFAULT 'Created with RizzumeIt';

-- Update the public resume policy to include watermark info
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

-- Create function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS text AS $$
DECLARE
  chars text[] := '{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9}';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add share token column
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT generate_share_token();

-- Create index for share token lookups
CREATE INDEX IF NOT EXISTS idx_resumes_share_token ON resumes(share_token);