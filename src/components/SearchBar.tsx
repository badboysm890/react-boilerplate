// SearchBar.tsx
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  showAutoFill?: boolean;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  initialValue = '',
  showAutoFill = true 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [showAutoFillButton, setShowAutoFillButton] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add screen size detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // Assuming mobile breakpoint at 640px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Check for LinkedIn, GitHub, and custom data on mount
  useEffect(() => {
    if (!showAutoFill) return;

    const socialProfiles = localStorage.getItem('social_profiles');
    const customData = localStorage.getItem('custom_search_data');
    
    if (socialProfiles) {
      const profiles = JSON.parse(socialProfiles);
      if (profiles.linkedInData || profiles.githubData || customData) {
        setShowAutoFillButton(true);
      }
    }
  }, [showAutoFill]);

  const handleSearch = async (autoFillData?: string) => {
    const searchQuery = autoFillData || query.trim();
    if (!searchQuery) return;
    
    setIsLoading(true);
    setIsDone(false);
    try {
      if (showAutoFill) {
        // Send message to PersonalInfoForm only in resume builder
        window.postMessage({ type: 'SEARCH_QUERY', query: searchQuery }, '*');
      }
      await onSearch(searchQuery);
      
      // Save the search query as custom data if it's not from auto-fill
      if (!autoFillData && showAutoFill) {
        localStorage.setItem('custom_search_data', searchQuery);
        setShowAutoFillButton(true);
      }
      
      setIsDone(true);
      // Reset done state after 2 seconds
      setTimeout(() => setIsDone(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = async () => {
    let combinedData = '';

    // Get social profiles data
    const socialProfiles = localStorage.getItem('social_profiles');
    if (socialProfiles) {
      const profiles = JSON.parse(socialProfiles);
      if (profiles.linkedInData) {
        combinedData += JSON.stringify(profiles.linkedInData) + ' ';
      }
      if (profiles.githubData) {
        combinedData += JSON.stringify(profiles.githubData) + ' ';
      }
    }

    // Get custom search data
    const customData = localStorage.getItem('custom_search_data');
    if (customData) {
      combinedData += customData;
    }

    if (combinedData.trim()) {
      await handleSearch(combinedData);
    }
  };

  const clearStoredData = () => {
    localStorage.removeItem('custom_search_data');
    setShowAutoFillButton(false);
    setQuery('');
    
    // Check if we still have social profiles data
    const socialProfiles = localStorage.getItem('social_profiles');
    if (socialProfiles) {
      const profiles = JSON.parse(socialProfiles);
      if (profiles.linkedInData || profiles.githubData) {
        setShowAutoFillButton(true);
      }
    }
  };

  return (
    <div className="relative flex items-center w-full group">
      {/* Enhanced gradient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-25 blur-xl group-hover:opacity-40 transition-all duration-300"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-full opacity-20 blur-md group-hover:opacity-30 transition-all duration-300"></div>
      
      {/* Search input or Auto-fill button */}
      <div className="relative flex w-full">
        {showAutoFill && showAutoFillButton ? (
          <div className="w-full flex space-x-2">
            <button
              onClick={handleAutoFill}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full
                       relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
                       transition-all duration-300"
            >
              {/* Enhanced glass effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              
              {/* Enhanced loading animation */}
              {isLoading && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-blue-600/80 animate-gradient"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
                </div>
              )}
              
              <span className="relative flex items-center justify-center font-medium">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Typing...
                  </>
                ) : isDone ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-bounce" />
                    Done Typing!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {!isMobile && (
                      <span className="ml-2">Shall I fill it for You?</span>
                    )}
                  </>
                )}
              </span>
            </button>
            
            {/* Clear button */}
            <button
              onClick={clearStoredData}
              disabled={isLoading}
              className="px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full
                       transition-colors duration-200 flex items-center justify-center"
              title="Clear stored data"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full
                       placeholder-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500/20
                       text-gray-700 shadow-sm transition-all duration-300
                       group-hover:shadow-md group-hover:bg-white/90
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            
            {/* Search button with gradient background */}
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white
                       bg-gradient-to-r from-blue-600 to-purple-600 
                       rounded-full hover:from-blue-700 hover:to-purple-700 
                       transition-all duration-200 shadow-md hover:shadow-lg
                       flex items-center justify-center group/btn
                       disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 transform group-hover/btn:scale-110 transition-transform" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}