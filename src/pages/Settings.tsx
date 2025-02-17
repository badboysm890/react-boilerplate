import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Linkedin, Github, Save, ArrowLeft, Search, ArrowUpDown, Star, GitFork } from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialData {
  linkedin?: string;
  github?: string;
  linkedInData?: any;
  githubData?: any;
}

type Tab = 'linkedin' | 'github';

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('linkedin');
  const [socialData, setSocialData] = useState<SocialData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedLinkedInData, setEditedLinkedInData] = useState<any>(null);
  const [editedGithubData, setEditedGithubData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name'>('stars');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get the referrer from state
  const referrer = location.state?.from || '/dashboard';

  useEffect(() => {
    loadSocialData();

    // Add beforeunload event listener
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const loadSocialData = () => {
    const storedData = localStorage.getItem('social_profiles');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setSocialData(parsed);
      setEditedLinkedInData(parsed.linkedInData || {});
      setEditedGithubData(parsed.githubData || {});
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save changes');
      return;
    }

    setSaving(true);
    try {
      // Update local storage
      const updatedData = {
        ...socialData,
        linkedInData: editedLinkedInData,
        githubData: editedGithubData
      };
      localStorage.setItem('social_profiles', JSON.stringify(updatedData));

      // Update LinkedIn data in Supabase
      if (editedLinkedInData) {
        const { data: linkedInAnalyses, error: linkedInFetchError } = await supabase
          .from('analysis_states')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'linkedin')
          .order('created_at', { ascending: false })
          .limit(1);

        if (linkedInFetchError) throw linkedInFetchError;

        if (linkedInAnalyses && linkedInAnalyses.length > 0) {
          const { error: updateError } = await supabase
            .from('analysis_states')
            .update({ 
              result: editedLinkedInData,
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', linkedInAnalyses[0].id);

          if (updateError) throw updateError;
        } else {
          // Create new LinkedIn analysis state if none exists
          const { error: insertError } = await supabase
            .from('analysis_states')
            .insert([{
              user_id: user.id,
              platform: 'linkedin',
              username: socialData.linkedin,
              status: 'completed',
              result: editedLinkedInData
            }]);

          if (insertError) throw insertError;
        }
      }

      // Update GitHub data in Supabase
      if (editedGithubData) {
        const { data: githubAnalyses, error: githubFetchError } = await supabase
          .from('analysis_states')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'github')
          .order('created_at', { ascending: false })
          .limit(1);

        if (githubFetchError) throw githubFetchError;

        if (githubAnalyses && githubAnalyses.length > 0) {
          const { error: updateError } = await supabase
            .from('analysis_states')
            .update({ 
              result: editedGithubData,
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', githubAnalyses[0].id);

          if (updateError) throw updateError;
        } else {
          // Create new GitHub analysis state if none exists
          const { error: insertError } = await supabase
            .from('analysis_states')
            .insert([{
              user_id: user.id,
              platform: 'github',
              username: socialData.github,
              status: 'completed',
              result: editedGithubData
            }]);

          if (insertError) throw insertError;
        }
      }

      toast.success('Settings saved successfully');
      setSocialData(updatedData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkedInDataChange = (path: string, value: string) => {
    setEditedLinkedInData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasUnsavedChanges(true);
      return newData;
    });
  };

  const handleGithubDataChange = (path: string, value: string) => {
    setEditedGithubData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasUnsavedChanges(true);
      return newData;
    });
  };

  const getFilteredAndSortedRepos = () => {
    if (!editedGithubData?.repositories) return [];
    
    return [...editedGithubData.repositories]
      .filter(repo => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return sortOrder === 'desc' 
            ? (b.stargazers_count || 0) - (a.stargazers_count || 0)
            : (a.stargazers_count || 0) - (b.stargazers_count || 0);
        } else {
          return sortOrder === 'desc'
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        }
      });
  };

  const toggleSort = (field: 'stars' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate(referrer);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={`Return to ${referrer === '/dashboard' ? 'Dashboard' : 'Resume Builder'}`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'linkedin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Linkedin className={`h-5 w-5 ${activeTab === 'linkedin' ? 'text-blue-600' : 'text-gray-400'} mr-2`} />
                  LinkedIn
                </div>
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'github'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Github className={`h-5 w-5 ${activeTab === 'github' ? 'text-blue-600' : 'text-gray-400'} mr-2`} />
                  GitHub
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'linkedin' && editedLinkedInData && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={editedLinkedInData.name || ''}
                        onChange={(e) => handleLinkedInDataChange('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Headline</label>
                      <input
                        type="text"
                        value={editedLinkedInData.headline || ''}
                        onChange={(e) => handleLinkedInDataChange('headline', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Summary</label>
                  <textarea
                    value={editedLinkedInData.summary || ''}
                    onChange={(e) => handleLinkedInDataChange('summary', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <div className="mt-1">
                    <textarea
                      value={Array.isArray(editedLinkedInData.skills) ? editedLinkedInData.skills.join(', ') : editedLinkedInData.skills || ''}
                      onChange={(e) => handleLinkedInDataChange('skills', e.target.value)}
                      placeholder="Enter skills separated by commas"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Experience */}
                {editedLinkedInData.experience?.map((exp: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Experience {index + 1}</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleLinkedInDataChange(`experience.${index}.company`, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={exp.title || ''}
                          onChange={(e) => handleLinkedInDataChange(`experience.${index}.title`, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'github' && editedGithubData && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={editedGithubData.profile?.name || ''}
                        onChange={(e) => handleGithubDataChange('profile.name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <input
                        type="text"
                        value={editedGithubData.profile?.bio || ''}
                        onChange={(e) => handleGithubDataChange('profile.bio', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={editedGithubData.profile?.company || ''}
                        onChange={(e) => handleGithubDataChange('profile.company', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={editedGithubData.profile?.location || ''}
                        onChange={(e) => handleGithubDataChange('profile.location', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Repositories Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Repositories ({editedGithubData.repositories?.length || 0})
                    </h3>
                    <div className="flex items-center space-x-4">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search repositories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      {/* Sort Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSort('stars')}
                          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                            sortBy === 'stars' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Stars
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </button>
                        <button
                          onClick={() => toggleSort('name')}
                          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                            sortBy === 'name' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          Name
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Repository Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {getFilteredAndSortedRepos().map((repo: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-base font-medium text-gray-900">{repo.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-gray-600">
                                <Star className="h-4 w-4 mr-1" />
                                <span className="text-sm">{repo.stargazers_count || 0}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <GitFork className="h-4 w-4 mr-1" />
                                <span className="text-sm">{repo.forks_count || 0}</span>
                              </div>
                              {repo.language && (
                                <span className="text-sm text-gray-600">
                                  {repo.language}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}