import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_POLLING_TIME = 120000; // 2 minutes

// Map API status to database status
const mapStatus = (apiStatus: string): string => {
  switch (apiStatus.toLowerCase()) {
    case 'queued':
      return 'queued';
    case 'started':
    case 'processing':
      return 'processing';
    case 'finished':
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'failed';
  }
};

export function useLinkedInJobPolling(analysisId: string | null, jobId: string | null) {
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  // Function to start a new analysis
  const startNewAnalysis = async () => {
    try {
      // Get the username from the current analysis
      const { data: analysis } = await supabase
        .from('analysis_states')
        .select('username, result')
        .eq('id', analysisId)
        .single();

      if (!analysis) throw new Error('Analysis not found');

      // If we already have results in the database, use those instead of starting a new analysis
      if (analysis.result) {
        // Update status to completed
        await supabase
          .from('analysis_states')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisId);

        // Store in localStorage
        const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
        localStorage.setItem('social_profiles', JSON.stringify({
          ...storedProfiles,
          linkedInData: analysis.result
        }));

        toast.success('LinkedIn profile data loaded from database');
        return null;
      }

      // Start new analysis only if no existing data
      const response = await fetch(
        `https://fastapi-drab-iota.vercel.app/api/v1/linkedin/profile/${analysis.username}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to start new analysis');

      const { job_id, status } = await response.json();

      // Update analysis with new job ID
      const { error: updateError } = await supabase
        .from('analysis_states')
        .update({ 
          job_id,
          status: mapStatus(status),
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      if (updateError) throw updateError;

      return job_id;
    } catch (error) {
      console.error('Error starting new analysis:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!analysisId || !jobId) return;

    const checkJobStatus = async () => {
      try {
        // First check if we already have completed data in the database
        const { data: existingAnalysis } = await supabase
          .from('analysis_states')
          .select('status, result')
          .eq('id', analysisId)
          .single();

        if (existingAnalysis?.status === 'completed' && existingAnalysis?.result) {
          // Data already exists, store in localStorage and return
          const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
          localStorage.setItem('social_profiles', JSON.stringify({
            ...storedProfiles,
            linkedInData: existingAnalysis.result
          }));
          return true;
        }

        // Only proceed with API check if no completed data exists
        const response = await fetch(
          `https://fastapi-drab-iota.vercel.app/api/v1/linkedin/job/${jobId}`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to check job status');
        }

        const data = await response.json();

        // Handle "not_found" status
        if (data.status === 'not_found') {
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            console.log(`Job not found, retrying (${retryCountRef.current}/${MAX_RETRIES})`);
            
            // Start new analysis
            const newJobId = await startNewAnalysis();
            if (!newJobId) return true; // Data was loaded from database
            
            // Reset polling timeout and continue with new job ID
            if (pollingTimeoutRef.current) {
              clearTimeout(pollingTimeoutRef.current);
            }
            pollingTimeoutRef.current = setTimeout(() => checkJobStatus(), POLLING_INTERVAL);
            return false;
          } else {
            // Max retries reached, mark as failed
            await supabase
              .from('analysis_states')
              .update({
                status: 'failed',
                result: { error: 'Max retries reached' },
                updated_at: new Date().toISOString()
              })
              .eq('id', analysisId);

            toast.error('LinkedIn analysis failed after multiple retries');
            return true;
          }
        }

        // Reset retry count on successful status check
        retryCountRef.current = 0;

        // Map API status to database status
        const dbStatus = mapStatus(data.status);

        // Update analysis state in Supabase
        const { error: updateError } = await supabase
          .from('analysis_states')
          .update({
            status: dbStatus,
            result: data.result,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisId);

        if (updateError) throw updateError;

        // If job is finished or failed, stop polling
        if (dbStatus === 'completed') {
          // Store the result in localStorage
          const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
          localStorage.setItem('social_profiles', JSON.stringify({
            ...storedProfiles,
            linkedInData: data.result
          }));
          
          toast.success('LinkedIn profile analysis completed!');
          return true;
        } else if (dbStatus === 'failed' || data.error) {
          toast.error('LinkedIn profile analysis failed');
          return true;
        }

        // Check if we've exceeded max polling time
        if (startTimeRef.current && Date.now() - startTimeRef.current > MAX_POLLING_TIME) {
          // Update status to failed if timeout
          await supabase
            .from('analysis_states')
            .update({
              status: 'failed',
              result: { error: 'Analysis timed out' },
              updated_at: new Date().toISOString()
            })
            .eq('id', analysisId);

          toast.error('LinkedIn profile analysis timed out');
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error checking job status:', error);
        
        // Update status to failed if error
        await supabase
          .from('analysis_states')
          .update({
            status: 'failed',
            result: { error: 'Failed to check status' },
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisId);

        toast.error('Failed to check analysis status');
        return true;
      }
    };

    const startPolling = () => {
      startTimeRef.current = Date.now();
      retryCountRef.current = 0;

      const poll = async () => {
        const shouldStop = await checkJobStatus();
        
        if (shouldStop) {
          if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
          }
        } else {
          pollingTimeoutRef.current = setTimeout(poll, POLLING_INTERVAL);
        }
      };

      poll();
    };

    startPolling();

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [analysisId, jobId]);
}