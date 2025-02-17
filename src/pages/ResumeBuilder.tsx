import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  Code2,
  ListPlus,
  FileDown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import PersonalInfoForm from '../components/resume-builder/PersonalInfoForm';
import EducationForm from '../components/resume-builder/EducationForm';
import ExperienceForm from '../components/resume-builder/ExperienceForm';
import SkillsForm from '../components/resume-builder/SkillsForm';
import CustomSectionForm from '../components/resume-builder/CustomSectionForm';
import ResumePreview from '../components/resume-builder/ResumePreview';
import SearchBar from '../components/SearchBar';
import { ResumeData } from '../types/resume';
import ResumeBuilderSidebar from '../components/resume-builder/ResumeBuilderSidebar';
import ResumeBuilderNavBar from '../components/resume-builder/ResumeBuilderNavBar';

const LOCAL_STORAGE_KEY = 'resume_draft';

const defaultResumeData: ResumeData = {
  title: '',
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: '',
    },
    website: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
  customSections: [],
  settings: {
    fontSize: 'medium',
    fontFamily: 'Arial',
    primaryColor: '#2563eb',
    showDates: true,
    showSectionTitles: true,
    compactLayout: false,
  },
};

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills', icon: Code2 },
  { id: 'custom', title: 'Additional', icon: ListPlus },
  { id: 'preview', title: 'Preview', icon: FileDown },
];

interface AuthModalProps {
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

function AuthModal({ onClose, onLogin, onSignup }: AuthModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Save Your Resume</h2>
        <p className="text-gray-600 mb-8">
          To save your resume and access it later, please log in or create an account. Your progress
          will be saved automatically.
        </p>
        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={onSignup}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setHasLocalDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [currentView, setCurrentView] = useState('editor'); // Add this state

  // Add these handler functions
  const handleTemplateClick = () => {
    setCurrentView('template');
    setCurrentStep(5); // Go to preview step where template selector is
  };

  const handlePreviewClick = () => {
    setCurrentView('preview');
    setCurrentStep(5); // Go to preview step
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
    // Implement settings view logic here
  };

  useEffect(() => {
    const resumeId = searchParams.get('id');
    if (resumeId && user) {
      loadResume(resumeId);
    } else {
      // Check for local draft
      const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localDraft) {
        try {
          const parsedDraft = JSON.parse(localDraft);
          setResumeData(parsedDraft);
        } catch (error) {
          console.error('Error parsing local draft:', error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      setLoading(false);
    }
  }, [searchParams, user]);

  // Save to local storage whenever resumeData changes
  useEffect(() => {
    if (!draftSaved && !user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
    }
  }, [resumeData, user, draftSaved]);

  async function loadResume(id: string) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setResumeData(data.content);
        // Clear local draft if loading from server
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setHasLocalDraft(false);
      }
    } catch (error) {
      toast.error('Failed to load resume');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!resumeData.title) {
      setShowSaveModal(true);
      return;
    }

    setSaving(true);
    try {
      const resumeId = searchParams.get('id');
      const operation = resumeId
        ? supabase
            .from('resumes')
            .update({
              content: resumeData,
              updated_at: new Date().toISOString(),
              title: resumeData.title,
              template: resumeData.template,
            })
            .eq('id', resumeId)
        : supabase
            .from('resumes')
            .insert([
              {
                user_id: user.id,
                title: resumeData.title,
                content: resumeData,
                template: resumeData.template,
              },
            ]);

      const { error } = await operation;
      if (error) throw error;

      // Clear local storage and mark draft as saved
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setDraftSaved(true);
      
      toast.success(resumeId ? 'Resume updated successfully!' : 'Resume saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save resume');
      console.error('Error:', error);
    } finally {
      setSaving(false);
      setShowSaveModal(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Error:', error);
    }
  }

  const handleTemplateChange = (template: string) => {
    setResumeData((prev) => ({ ...prev, template }));
    
    // If user is logged in, update the template in the database
    if (user) {
      const resumeId = searchParams.get('id');
      if (resumeId) {
        updateResumeTemplate(resumeId, template);
      }
    }
  };

  async function updateResumeTemplate(resumeId: string, template: string) {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ template })
        .eq('id', resumeId)
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  }

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ResumeBuilderSidebar
        onTemplateClick={handleTemplateClick}
        onPreviewClick={handlePreviewClick}
        onSettingsClick={handleSettingsClick}
        currentView={currentView}
      />

      {/* Replace old nav bar with the new component */}
      <ResumeBuilderNavBar
        user={user}
        saving={saving}
        setShowSaveModal={setShowSaveModal}
        handleSignOut={handleSignOut}
        setShowAuthModal={setShowAuthModal}
      />

      {/* Progress Steps & main content */}
      <div className="ml-0 md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav aria-label="Progress" className="mb-12 sm:overflow-visible overflow-x-auto">
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200">
                <div
                  className="h-0.5 bg-blue-600 transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="relative z-10 flex justify-between w-full">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActiveOrCompleted = currentStep >= index;
                  const isCurrent = currentStep === index;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className="group flex flex-col items-center"
                    >
                      {/* Step Circle */}
                      <div
                        className={`
                          flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                          ${
                            isActiveOrCompleted
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 bg-white text-gray-500'
                          }
                          ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                        `}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Step Title (hidden on extra-small screens to prevent shift) */}
                      <span
                        className={`
                          absolute top-14 text-sm font-medium whitespace-nowrap hidden sm:inline-block
                          ${isActiveOrCompleted ? 'text-blue-600' : 'text-gray-500'}
                        `}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="relative">
            {/* Form Content */}
            <div className="bg-white shadow-sm rounded-2xl p-8 min-h-[calc(100vh-24rem)]">
              <div className="pb-24"> {/* Add padding at bottom to prevent content from being hidden behind navigation */}
                {currentStep === 0 && (
                  <PersonalInfoForm
                    data={resumeData.personalInfo}
                    onChange={(personalInfo) =>
                      setResumeData({ ...resumeData, personalInfo })
                    }
                  />
                )}
                {currentStep === 1 && (
                  <EducationForm
                    education={resumeData.education}
                    onChange={(education) =>
                      setResumeData({ ...resumeData, education })
                    }
                  />
                )}
                {currentStep === 2 && (
                  <ExperienceForm
                    experiences={resumeData.experience}
                    onChange={(experience) =>
                      setResumeData({ ...resumeData, experience })
                    }
                  />
                )}
                {currentStep === 3 && (
                  <SkillsForm
                    skills={resumeData.skills}
                    onChange={(skills) => setResumeData({ ...resumeData, skills })}
                  />
                )}
                {currentStep === 4 && (
                  <CustomSectionForm
                    sections={resumeData.customSections}
                    onChange={(customSections) =>
                      setResumeData({ ...resumeData, customSections })
                    }
                  />
                )}
                {currentStep === 5 && (
                  <ResumePreview
                    data={resumeData}
                    onDownload={() => {
                      if (!user) {
                        setShowAuthModal(true);
                        return;
                      }
                      toast.success('Resume downloaded successfully!');
                      handleSave();
                    }}
                    onTemplateChange={handleTemplateChange}
                  />
                )}
              </div>
            </div>

            {/* Fixed Navigation Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[110]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between space-x-4">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 0}
                    className="flex-shrink-0 inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {currentStep === 0 && (
                    <div className="flex-1 max-w-2xl">
                      <SearchBar
                        onSearch={(query) => {
                          // Handle personal info search
                          console.log('Personal info search:', query);
                        }}
                        placeholder="Give me details let me fill them for you 😉"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === steps.length - 1}
                    className="flex-shrink-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Save Resume</h3>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  placeholder="e.g., Software Engineer Resume"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!resumeData.title}
                  className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        )}
      </div>
    </div>
  );
}