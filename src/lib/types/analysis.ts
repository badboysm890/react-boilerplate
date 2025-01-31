export interface AnalysisState {
  id: string;
  user_id: string;
  platform: 'github' | 'linkedin';
  username: string;
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
  created_at: string;
  updated_at: string;
}