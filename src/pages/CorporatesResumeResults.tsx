import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  SortAsc, 
  SortDesc, 
  Star, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Brain,
  Clock,
  MapPin,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateSkillScore, calculateOverallScore, formatScore } from '../utils/scoreCalculator';

interface ResumeAnalysis {
  name: string;
  overall_match_score: string;
  education_match_score: string;
  experience_match_score: string;
  skill_match_score: string;
  education: {
    content: string[];
    match: boolean;
  };
  experience: {
    total_years: number;
    relevant_experience_years: number;
    job_hopping_risk: string;
    content: string[];
    match: boolean;
  };
  skills: {
    requirement: string[];
    content: string[];
    missing: string[];
    matched_skills_percentage: string;
    transferable_skills: string[];
    Matches: string[];
  };
  work_preferences: {
    notice_period: string;
    relocation: string;
    remote_work_preferred: string;
  };
  soft_skills: {
    communication: string;
    teamwork: string;
    problem_solving: string;
    leadership: string;
  };
  projects: {
    content: string[];
    match: boolean;
  };
  summary: {
    content: string[];
  };
  ai_insights: {
    recommendation: string;
    upskilling_suggestions: string[];
  };
}

interface SortOption {
  id: keyof Pick<ResumeAnalysis, 
    'overall_match_score' | 
    'education_match_score' | 
    'experience_match_score' | 
    'skill_match_score'
  >;
  label: string;
  icon: React.ElementType;
}

const sortOptions: SortOption[] = [
  { id: 'overall_match_score', label: 'Overall Match', icon: Star },
  { id: 'education_match_score', label: 'Education', icon: GraduationCap },
  { id: 'experience_match_score', label: 'Experience', icon: Briefcase },
  { id: 'skill_match_score', label: 'Skills', icon: Code2 }
];

export default function CorporatesResumeResults() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeAnalysis | null>(null);
  const [sortBy, setSortBy] = useState<SortOption['id']>('overall_match_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const processAnalysis = (analysis: ResumeAnalysis): ResumeAnalysis => {
    // Calculate skill score based on matches and missing skills
    const skillScore = calculateSkillScore(
      analysis.skills.Matches,
      analysis.skills.missing
    );

    // Calculate overall score using weights
    const overallScore = calculateOverallScore(
      parsePercentage(analysis.education_match_score),
      parsePercentage(analysis.experience_match_score),
      skillScore
    );

    // Return updated analysis with new scores
    return {
      ...analysis,
      skill_match_score: formatScore(skillScore),
      overall_match_score: formatScore(overallScore)
    };
  };

  const loadAnalyses = () => {
    try {
      const analysisMap = new Map<string, ResumeAnalysis>();
      
      // Get all items from localStorage that start with 'analysis_'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('analysis_')) {
          const analysis = JSON.parse(localStorage.getItem(key) || '');
          if (analysis) {
            // Process the analysis to update scores
            const processedAnalysis = processAnalysis(analysis);
            
            // Use candidate name as key to prevent duplicates
            // Only keep the latest analysis if names match
            if (!analysisMap.has(processedAnalysis.name)) {
              analysisMap.set(processedAnalysis.name, processedAnalysis);
            }
          }
        }
      }

      const uniqueAnalyses = Array.from(analysisMap.values());

      if (uniqueAnalyses.length === 0) {
        toast.error('No analysis results found');
        navigate('/corporates');
        return;
      }

      setAnalyses(uniqueAnalyses);
      // Set first candidate as selected by default
      setSelectedResume(uniqueAnalyses[0]);
    } catch (error) {
      console.error('Error loading analyses:', error);
      toast.error('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const parsePercentage = (score: string) => {
    return parseInt(score.replace('%', ''), 10);
  };

  const sortedAnalyses = [...analyses].sort((a, b) => {
    const aScore = parsePercentage(a[sortBy]);
    const bScore = parsePercentage(b[sortBy]);
    return sortOrder === 'desc' ? bScore - aScore : aScore - bScore;
  });

  const toggleSort = (option: SortOption['id']) => {
    if (sortBy === option) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score: string) => {
    const value = parsePercentage(score);
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: string) => {
    const value = parsePercentage(score);
    if (value >= 80) return 'bg-green-50';
    if (value >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getJobHoppingRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/corporates')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Analysis</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex space-x-8">
          {/* Sticky Sidebar with Resume List */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="space-y-2 mb-4">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleSort(option.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                      sortBy === option.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <option.icon className="h-5 w-5 mr-2" />
                      <span>{option.label}</span>
                    </div>
                    {sortBy === option.id && (
                      sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {sortedAnalyses.map((analysis, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedResume(analysis)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedResume === analysis
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{analysis.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className={`text-sm font-medium ${getScoreColor(analysis.overall_match_score)}`}>
                          {analysis.overall_match_score} Match
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {analysis.experience.total_years}y exp
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {selectedResume ? (
              <div className="space-y-6">
                {/* Overview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedResume.name}</h2>
                      <div className="flex items-center mt-2 text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{selectedResume.experience.total_years}y total exp</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{selectedResume.experience.relevant_experience_years}y relevant</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-xl ${getScoreBg(selectedResume.overall_match_score)}`}>
                      <div className={`text-3xl font-bold ${getScoreColor(selectedResume.overall_match_score)}`}>
                        {selectedResume.overall_match_score}
                      </div>
                      <div className="text-sm text-gray-600">Overall Match</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${getScoreBg(selectedResume.education_match_score)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="h-5 w-5 text-gray-600" />
                        <span className={`font-bold ${getScoreColor(selectedResume.education_match_score)}`}>
                          {selectedResume.education_match_score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Education</div>
                    </div>

                    <div className={`p-4 rounded-lg ${getScoreBg(selectedResume.experience_match_score)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Briefcase className="h-5 w-5 text-gray-600" />
                        <span className={`font-bold ${getScoreColor(selectedResume.experience_match_score)}`}>
                          {selectedResume.experience_match_score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>

                    <div className={`p-4 rounded-lg ${getScoreBg(selectedResume.skill_match_score)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Code2 className="h-5 w-5 text-gray-600" />
                        <span className={`font-bold ${getScoreColor(selectedResume.skill_match_score)}`}>
                          {selectedResume.skill_match_score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Skills</div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                        <span className={`font-bold ${getJobHoppingRiskColor(selectedResume.experience.job_hopping_risk)}`}>
                          {selectedResume.experience.job_hopping_risk}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Job Hopping Risk</div>
                    </div>
                  </div>
                </div>

                {/* Work Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Work Preferences
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Notice Period</div>
                      <div className="font-medium">{selectedResume.work_preferences.notice_period}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Relocation</div>
                      <div className="font-medium">{selectedResume.work_preferences.relocation}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Remote Work</div>
                      <div className="font-medium">{selectedResume.work_preferences.remote_work_preferred}</div>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Code2 className="h-5 w-5 mr-2 text-blue-600" />
                    Skills Analysis
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.skills.Matches.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.skills.missing.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedResume.skills.transferable_skills.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                        Transferable Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.skills.transferable_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    AI Insights
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      Recommendation
                    </h4>
                    <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
                      {selectedResume.ai_insights.recommendation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Upskilling Suggestions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedResume.ai_insights.upskilling_suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Soft Skills Assessment
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(selectedResume.soft_skills).map(([skill, level]) => (
                      <div key={skill} className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 capitalize mb-1">{skill}</div>
                        <div className="font-medium">{level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center">
                <p className="text-gray-500">Select a candidate to view detailed analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}