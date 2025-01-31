/*
  # Analysis States Table

  1. New Tables
    - `analysis_states`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text, either 'github' or 'linkedin')
      - `username` (text)
      - `job_id` (text)
      - `status` (text, one of: 'queued', 'processing', 'completed', 'failed')
      - `result` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for users to manage their own analysis states
    - Add indexes for performance

  3. Changes
    - Add trigger for updated_at timestamp
*/

-- Create analysis_states table
CREATE TABLE analysis_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('github', 'linkedin')),
  username text NOT NULL,
  job_id text,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analysis_states ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own analysis states"
  ON analysis_states
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_analysis_states_user_id ON analysis_states(user_id);
CREATE INDEX idx_analysis_states_platform ON analysis_states(platform);
CREATE INDEX idx_analysis_states_status ON analysis_states(status);

-- Create updated_at trigger
CREATE TRIGGER set_analysis_states_updated_at
  BEFORE UPDATE ON analysis_states
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();