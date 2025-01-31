/* eslint-disable @typescript-eslint/no-explicit-any */
// ResumeBuilderNavBar Component
import { Link } from 'react-router-dom';
import { Sparkles, LogOut, Github, Linkedin, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResumeBuilderNavBarProps {
  user: any;
  saving: boolean;
  setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignOut: () => void;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
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
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
            <div className="bg-gray-800 text-white text-xs py-2 px-3 rounded-md whitespace-nowrap">
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilderNavBar({
  user,
  saving,
  setShowSaveModal,
  handleSignOut,
  setShowAuthModal,
}: ResumeBuilderNavBarProps) {
  const [socialProfiles, setSocialProfiles] = useState<any>(null);

  useEffect(() => {
    const storedProfiles = localStorage.getItem('social_profiles');
    if (storedProfiles) {
      setSocialProfiles(JSON.parse(storedProfiles));
    }
  }, []);

  const hasGithubData = socialProfiles?.githubData;
  const hasLinkedInData = socialProfiles?.linkedInData;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      {/* Main Container with Padding */}
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Logo and Brand Name */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hidden sm:inline">
              RizzumeIt!
            </span>
          </Link>
        </div>

        {/* Right Section: Social Icons and Actions */}
        <div className="flex items-center space-x-4">
          {/* Social Profiles */}
          <div className="flex items-center">
            <Tooltip text={hasGithubData ? "Synced with GitHub" : "Not synced with GitHub"}>
              <div className={`cursor-pointer mr-4 ${hasGithubData ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <Github className="h-5 w-5" />
              </div>
            </Tooltip>

            <Tooltip text={hasLinkedInData ? "Synced with LinkedIn" : "Not synced with LinkedIn"}>
              <div className={`cursor-pointer ${hasLinkedInData ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <Linkedin className="h-5 w-5" />
              </div>
            </Tooltip>
          </div>

          {/* User Actions */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {saving ? 'Saving...' : 'Save Resume'}
                </span>
                <span className="sm:hidden">
                  {saving ? '...' : 'Save'}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save Resume</span>
              <span className="sm:hidden">Save</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
