import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { withRetry } from '../lib/supabase';
import { getResumeTemplate } from '../lib/utils';
import ResumeModal from '../components/resume-builder/ResumeModal';
import DashboardNav from '../components/dashboard/DashboardNav';
import DashboardSearch from '../components/dashboard/DashboardSearch';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import SocialProfileModal from '../components/dashboard/SocialProfileModal';
import ResumeGrid from '../components/dashboard/ResumeGrid';
import { OnboardingFocus, DraftModal } from '../components/dashboard/DashboardModals';
import ShareModal from '../components/dashboard/ShareModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const [showSocialProfileModal, setShowSocialProfileModal] = useState(false);
  const [checkingProfiles, setCheckingProfiles] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkExistingProfiles = async () => {
      try {
        const { data: analyses, error } = await supabase
          .from('analysis_states')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['completed', 'processing', 'queued'])
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (analyses && analyses.length > 0) {
          setShowSocialProfileModal(false);
          const storedProfiles = JSON.parse(localStorage.getItem('social_profiles') || '{}');
          if (!storedProfiles.github || !storedProfiles.linkedin) {
            const github = analyses.find(a => a.platform === 'github');
            const linkedin = analyses.find(a => a.platform === 'linkedin');
            localStorage.setItem('social_profiles', JSON.stringify({
              ...storedProfiles,
              github: github?.username || storedProfiles.github,
              linkedin: linkedin?.username || storedProfiles.linkedin,
              githubData: github?.result || storedProfiles.githubData,
              linkedInData: linkedin?.result || storedProfiles.linkedInData
            }));
          }
        } else {
          const socialProfiles = localStorage.getItem('social_profiles');
          setShowSocialProfileModal(!socialProfiles);
        }
      } catch (error) {
        console.error('Error checking profiles:', error);
        const socialProfiles = localStorage.getItem('social_profiles');
        setShowSocialProfileModal(!socialProfiles);
      } finally {
        setCheckingProfiles(false);
      }
    };

    checkExistingProfiles();
    fetchResumes();

    const hasDraft = localStorage.getItem('resume_draft');
    if (hasDraft) {
      setShowDraftModal(true);
    }
  }, [user, navigate]);

  const handleSocialProfileSubmit = (github: string, linkedin: string) => {
    localStorage.setItem('social_profiles', JSON.stringify({ github, linkedin }));
    setShowSocialProfileModal(false);
    toast.success('Social profiles saved successfully!');
  };

  const handleContinueDraft = () => {
    setShowDraftModal(false);
    navigate('/builder');
  };

  const handleDeleteDraft = () => {
    localStorage.removeItem('resume_draft');
    setShowDraftModal(false);
    toast.success('Draft deleted successfully');
  };

  async function fetchResumes() {
    try {
      const { data, error: fetchError } = await withRetry(async () => 
        supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      );

      if (fetchError) throw fetchError;
      if (!data) throw new Error('No data returned from the server');

      const processedData = data.map(resume => ({
        ...resume,
        template: resume.template || 'modern'
      }));

      setResumes(processedData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching resumes:', error);
      setError(error.message || 'Failed to fetch resumes');
      toast.error('Failed to fetch resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteResume(id: string) {
    try {
      const { error } = await withRetry(async () =>
        supabase
          .from('resumes')
          .delete()
          .eq('id', id)
          .eq('user_id', user?.id)
      );

      if (error) throw error;
      
      setResumes(resumes.filter(resume => resume.id !== id));
      toast.success('Resume deleted successfully');
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  }

  async function togglePublicAccess(id: string, isPublic: boolean) {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      const { data, error } = await withRetry(async () =>
        supabase
          .from('resumes')
          .update({ 
            is_public: isPublic,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()
      );

      if (error) throw error;
      if (!data) throw new Error('No data returned from update operation');
      
      setResumes(prevResumes => 
        prevResumes.map(resume => 
          resume.id === id ? { ...resume, is_public: data.is_public } : resume
        )
      );
      
      toast.success(isPublic ? 'Resume is now public' : 'Resume is now private');
    } catch (error: any) {
      console.error('Error updating resume visibility:', error);
      toast.error(`Failed to update resume visibility: ${error.message}`);
      
      setResumes(prevResumes => 
        prevResumes.map(resume => 
          resume.id === id ? { ...resume, is_public: !isPublic } : resume
        )
      );
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  }

  if (loading || checkingProfiles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed top nav */}
      <div className="flex-none">
        <DashboardNav onSignOut={handleSignOut} />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 relative">
        <DashboardSidebar />
        
        {/* Scrollable main content */}
        <div className="absolute inset-0 md:ml-16 overflow-y-auto">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            </div>

            <ResumeGrid
              resumes={resumes}
              onPreview={setPreviewResume}
              onShare={(id) => setShareModal(id)}
              onDelete={deleteResume}
              getResumeTemplate={getResumeTemplate}
            />
          </main>
        </div>
      </div>

      {/* Fixed bottom search */}
      <div className="flex-none">
        <DashboardSearch />
      </div>

      {/* Modals */}
      {shareModal && (
        <ShareModal
          resume={resumes.find(r => r.id === shareModal)!}
          onClose={() => setShareModal(null)}
          onTogglePublic={togglePublicAccess}
        />
      )}

      {previewResume && (
        <ResumeModal
          resume={previewResume}
          onClose={() => setPreviewResume(null)}
          onEdit={(id) => navigate(`/builder?id=${id}`)}
          onDelete={deleteResume}
        />
      )}

      {showOnboarding && (
        <OnboardingFocus onClose={() => setShowOnboarding(false)} />
      )}

      {showDraftModal && (
        <DraftModal
          onClose={() => setShowDraftModal(false)}
          onContinue={handleContinueDraft}
          onDelete={handleDeleteDraft}
        />
      )}

      {showSocialProfileModal && (
        <SocialProfileModal
          onClose={() => setShowSocialProfileModal(false)}
          onSubmit={handleSocialProfileSubmit}
        />
      )}
    </div>
  );
}