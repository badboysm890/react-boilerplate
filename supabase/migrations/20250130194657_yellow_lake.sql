/*
  # Update Analysis States Table

  1. Changes
    - Safely update status check constraint
    - Add missing indexes if needed
    - Update RLS policies
    - Ensure trigger exists
  
  2. Safety
    - Uses IF NOT EXISTS for all operations
    - Handles existing table gracefully
*/

-- Drop existing status constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE analysis_states 
    DROP CONSTRAINT IF EXISTS analysis_states_status_check;
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

-- Update or create status constraint
ALTER TABLE analysis_states 
  ADD CONSTRAINT analysis_states_status_check 
  CHECK (status IN ('queued', 'processing', 'completed', 'failed'));

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_analysis_states_user_id ON analysis_states(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_states_platform ON analysis_states(platform);
CREATE INDEX IF NOT EXISTS idx_analysis_states_status ON analysis_states(status);

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can manage their own analysis states" ON analysis_states;

-- Create updated policy
CREATE POLICY "Users can manage their own analysis states"
  ON analysis_states
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE analysis_states ENABLE ROW LEVEL SECURITY;

-- Create or replace updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS set_analysis_states_updated_at ON analysis_states;
CREATE TRIGGER set_analysis_states_updated_at
  BEFORE UPDATE ON analysis_states
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON analysis_states TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;