import { Link } from 'react-router-dom';
import { Sparkles, LogOut, Github, Linkedin } from 'lucide-react';
import { useLinkedInJobPolling } from '../../hooks/useLinkedInJobPolling';
import { useGithubProfile } from '../../hooks/useGithubProfile';
import { FeatureLoadingIndicator } from './FeatureLoadingIndicator';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SocialProfileModal from './SocialProfileModal';

interface DashboardNavProps {
  onSignOut: () => void;
}

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="relative inline-block">
      <div className="group">
        {children}
        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute left-1/2 -translate-x-1/2 -bottom-14 w-max">
          <div className="relative">
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
            {/* Tooltip content */}
            <div className="bg-gray-800 text-white text-xs py-2 px-3 rounded-md whitespace-nowrap">
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardNav({ onSignOut }: DashboardNavProps) {
  const [linkedInAnalysis, setLinkedInAnalysis] = useState<any>(null);
  const [githubAnalysis, setGithubAnalysis] = useState<any>(null);
  const [socialProfiles, setSocialProfiles] = useState<any>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);

  useEffect(() => {
    // Load social profiles from localStorage
    const storedProfiles = localStorage.getItem('social_profiles');
    if (storedProfiles) {
      setSocialProfiles(JSON.parse(storedProfiles));
    }

    // Fetch latest analysis states
    const fetchAnalysisStates = async () => {
      const { data: analyses, error } = await supabase
        .from('analysis_states')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching analysis states:', error);
        return;
      }

      if (analyses) {
        const linkedin = analyses.find(a => a.platform === 'linkedin');
        const github = analyses.find(a => a.platform === 'github');

        setLinkedInAnalysis(linkedin);
        setGithubAnalysis(github);
      }
    };

    fetchAnalysisStates();
  }, []);

  // Start polling for LinkedIn if we have an analysis
  useLinkedInJobPolling(
    linkedInAnalysis?.id || null,
    linkedInAnalysis?.job_id || null
  );

  // Use GitHub hook if we have an analysis
  const { loading: githubLoading } = useGithubProfile(
    githubAnalysis?.id || null
  );

  const shouldShowLinkedInSpinner = linkedInAnalysis?.status === 'processing' || linkedInAnalysis?.status === 'queued';
  const shouldShowGithubSpinner = githubLoading || githubAnalysis?.status === 'processing';
  const hasGithubData = socialProfiles?.githubData || githubAnalysis?.status === 'completed';
  const hasLinkedInData = socialProfiles?.linkedInData || linkedInAnalysis?.status === 'completed';

  const handleSocialIconClick = () => {
    if (!hasGithubData || !hasLinkedInData) {
      setShowSocialModal(true);
    }
  };

  const handleSocialProfileSubmit = (github: string, linkedin: string) => {
    localStorage.setItem('social_profiles', JSON.stringify({ github, linkedin }));
    setSocialProfiles({ github, linkedin });
    setShowSocialModal(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hidden sm:inline">
              RizzumeIt!
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {shouldShowGithubSpinner ? (
              <FeatureLoadingIndicator 
                icon={<Github className="h-5 w-5 text-gray-900" />}
                color="#333"
                size={32}
              />
            ) : (
              <Tooltip text={hasGithubData ? "Synced with GitHub" : "Not synced with GitHub"}>
                <div 
                  className={`cursor-pointer mr-4 ${hasGithubData ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={handleSocialIconClick}
                >
                  <Github className="h-5 w-5" />
                </div>
              </Tooltip>
            )}

            {shouldShowLinkedInSpinner ? (
              <FeatureLoadingIndicator 
                icon={<Linkedin className="h-5 w-5 text-blue-600" />}
                color="#0077b5"
                size={32}
              />
            ) : (
              <Tooltip text={hasLinkedInData ? "Synced with LinkedIn" : "Not synced with LinkedIn"}>
                <div 
                  className={`cursor-pointer ${hasLinkedInData ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={handleSocialIconClick}
                >
                  <Linkedin className="h-5 w-5" />
                </div>
              </Tooltip>
            )}
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Social Profile Modal */}
      {showSocialModal && (
        <SocialProfileModal
          onClose={() => setShowSocialModal(false)}
          onSubmit={handleSocialProfileSubmit}
        />
      )}
    </header>
  );
}