import { useState, useEffect } from 'react';
import { Sparkles, Github, Linkedin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SocialProfileModalProps {
  onClose: () => void;
  onSubmit: (github: string, linkedin: string) => void;
}

export default function SocialProfileModal({ onClose, onSubmit }: SocialProfileModalProps) {
  const { user } = useAuth();
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractUsername = (url: string, platform: 'github' | 'linkedin') => {
    if (!url) return '';
    
    if (platform === 'github') {
      return url.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//, '').split('/')[0];
    } else {
      return url.replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\//, '').split('/')[0];
    }
  };

  const fetchGithubProfile = async (username: string) => {
    try {
      const response = await fetch(`https://fastapi-drab-iota.vercel.app/api/v1/github/profile/${username}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      throw error;
    }
  };

  const startAnalysis = async (platform: 'github' | 'linkedin', username: string) => {
    if (!user || !username) return null;

    try {
      // Create initial analysis state
      const { data: analysis, error: dbError } = await supabase
        .from('analysis_states')
        .insert([
          {
            user_id: user.id,
            platform,
            username,
            status: 'processing'
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      if (platform === 'github') {
        // For GitHub, fetch profile immediately
        try {
          const profileData = await fetchGithubProfile(username);
          
          // Store in localStorage immediately after successful fetch
          localStorage.setItem('social_profiles', JSON.stringify({
            ...JSON.parse(localStorage.getItem('social_profiles') || '{}'),
            github: username,
            githubData: profileData
          }));

          // Update analysis state
          const { error: updateError } = await supabase
            .from('analysis_states')
            .update({ 
              status: 'completed',
              result: profileData,
              updated_at: new Date().toISOString()
            })
            .eq('id', analysis.id);

          if (updateError) throw updateError;
          
          toast.success('GitHub profile analyzed successfully!');
        } catch (apiError) {
          // Update analysis state to failed
          await supabase
            .from('analysis_states')
            .update({ 
              status: 'failed',
              result: { error: 'Failed to fetch GitHub profile' },
              updated_at: new Date().toISOString()
            })
            .eq('id', analysis.id);
          
          throw apiError;
        }
      } else {
        // For LinkedIn, start the analysis job
        try {
          const response = await fetch(`https://fastapi-drab-iota.vercel.app/api/v1/linkedin/profile/${username}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          });

          if (!response.ok) throw new Error('Failed to start LinkedIn analysis');

          const { job_id, status } = await response.json();

          // Store LinkedIn username in localStorage
          localStorage.setItem('social_profiles', JSON.stringify({
            ...JSON.parse(localStorage.getItem('social_profiles') || '{}'),
            linkedin: username
          }));

          // Update analysis state with job ID
          const { error: updateError } = await supabase
            .from('analysis_states')
            .update({ 
              job_id,
              status: status.toLowerCase()
            })
            .eq('id', analysis.id);

          if (updateError) throw updateError;
        } catch (apiError) {
          await supabase
            .from('analysis_states')
            .update({ 
              status: 'failed',
              result: { error: 'Failed to start LinkedIn analysis' }
            })
            .eq('id', analysis.id);
          
          throw apiError;
        }
      }

      return analysis;
    } catch (error) {
      console.error(`Error analyzing ${platform} profile:`, error);
      toast.error(`Failed to analyze ${platform} profile`);
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const githubUsername = extractUsername(github, 'github');
      const linkedinUsername = extractUsername(linkedin, 'linkedin');

      if (!githubUsername && !linkedinUsername) {
        toast.error('Please enter at least one profile URL or username');
        return;
      }

      const results = await Promise.allSettled([
        linkedinUsername ? startAnalysis('linkedin', linkedinUsername) : null,
        githubUsername ? startAnalysis('github', githubUsername) : null
      ]);

      // Check if any analysis was successful
      const anySuccess = results.some(result => result.status === 'fulfilled' && result.value !== null);
      
      if (anySuccess) {
        onSubmit(githubUsername, linkedinUsername);
      } else {
        toast.error('Failed to start analysis. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting profiles:', error);
      toast.error('Failed to submit profiles');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20" />

        <div className="relative">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Let's Make Your Resume Shine! ✨
            </h2>
            <p className="mt-2 text-gray-600">
              Connect your profiles to supercharge your resume with AI
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Github className="h-5 w-5 mr-2 text-gray-900" />
                GitHub Username or URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/username"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
                LinkedIn Username or URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Starting Analysis...' : "Let's Go! 🚀"}
              </button>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                I'll do this later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}