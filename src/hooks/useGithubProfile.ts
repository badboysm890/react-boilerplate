import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useGithubProfile(analysisId: string | null) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!analysisId) return;

    const fetchGithubProfile = async () => {
      try {
        // First check if we already have completed data in the database
        const { data: existingAnalysis } = await supabase
          .from('analysis_states')
          .select('status, result, username')
          .eq('id', analysisId)
          .single();

        if (existingAnalysis?.status === 'completed' && existingAnalysis?.result) {
          // Data already exists, store in localStorage
          const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
          localStorage.setItem('social_profiles', JSON.stringify({
            ...storedProfiles,
            githubData: existingAnalysis.result
          }));
          return;
        }

        if (!existingAnalysis?.username) {
          throw new Error('No GitHub username found');
        }

        setLoading(true);

        // Fetch GitHub profile data
        const response = await fetch(
          `https://fastapi-drab-iota.vercel.app/api/v1/github/profile/${existingAnalysis.username}`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub profile');
        }

        const data = await response.json();

        // Update analysis state in Supabase
        const { error: updateError } = await supabase
          .from('analysis_states')
          .update({
            status: 'completed',
            result: data,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisId);

        if (updateError) throw updateError;

        // Store the result in localStorage
        const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
        localStorage.setItem('social_profiles', JSON.stringify({
          ...storedProfiles,
          githubData: data
        }));

        toast.success('GitHub profile analysis completed!');
      } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        
        // Update status to failed if error
        await supabase
          .from('analysis_states')
          .update({
            status: 'failed',
            result: { error: 'Failed to fetch GitHub profile' },
            updated_at: new Date().toISOString()
          })
          .eq('id', analysisId);

        toast.error('Failed to fetch GitHub profile');
      } finally {
        setLoading(false);
      }
    };

    fetchGithubProfile();
  }, [analysisId]);

  return { loading };
}