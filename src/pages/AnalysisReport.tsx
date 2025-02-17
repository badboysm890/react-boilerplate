import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface AnalysisData {
  resumeId: string;
  data: any;
  timestamp: string;
}

export default function AnalysisReport() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state from localStorage
    const storedLogin = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(storedLogin === 'true');

    // Load the analysis data from localStorage
    const storedAnalysis = localStorage.getItem('resume_analysis');
    if (!storedAnalysis) {
      toast.error('No analysis data found');
      window.location.href = '/';
      return;
    }

    try {
      const parsed = JSON.parse(storedAnalysis) as AnalysisData;
      setAnalysis(parsed);
      setLoading(false);

      // Trigger animation after a short delay
      setTimeout(() => setAnimate(true), 300);
    } catch (error) {
      console.error('Error parsing analysis data:', error);
      toast.error('Invalid analysis data');
      window.location.href = '/';
    }
  }, []);

  // Called when a logged-in user clicks "Sign Out"
  function onSignOut() {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    toast.success('Signed out successfully');
    navigate('/'); // Return to landing page
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl animate-pulse"></div>
          <Sparkles className="h-12 w-12 text-blue-600 animate-bounce" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">No Analysis Data</h2>
          <p className="text-gray-600">Please analyze a resume first.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Top-level data extracted from analysis.data
  const {
    total_score,
    content_score,
    format_score,
    sections_score,
    skills_score,
    style_score,
    design,
    issues = [],
    detailed_analysis = {},
  } = analysis.data;

  // Detailed breakdown data
  const {
    content = {},
    format = {},
    sections = {},
    skills = {},
    style = {},
    design: designDetails = {},
  } = detailed_analysis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left side: Logo */}
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              RizzumeIt!
            </span>
          </Link>

          {/* Right side: If logged in, show sign out button; if logged out, show signup button */}
          <div>
            {isLoggedIn ? (
              <button
                onClick={onSignOut}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
              >
                <span className="hidden sm:inline">Create your dream resume now</span>
                <span className="inline sm:hidden">Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* Overall Score Card */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 rounded-full translate-y-32 -translate-x-32 pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analysis Report
              </h2>

              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  <CircularProgressBar
                    score={total_score}
                    size={200}
                    strokeWidth={12}
                    animate={animate}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="block text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {animate ? total_score : 0}%
                      </span>
                      <span className="text-gray-500 text-sm">Overall Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <ScoreBar label="Content Quality" score={content_score} animate={animate} />
                <ScoreBar label="Formatting" score={format_score} animate={animate} />
                <ScoreBar label="Section Structure" score={sections_score} animate={animate} />
                <ScoreBar label="Skills Match" score={skills_score} animate={animate} />
                <ScoreBar label="Writing Style" score={style_score} animate={animate} />
                {design !== undefined && (
                  <ScoreBar label="Visual Design" score={design} animate={animate} />
                )}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <section className="space-y-8">
            <h3 className="text-2xl font-semibold text-gray-700">Detailed Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Content Card */}
              <DomainCard
                title="Content"
                score={content.score}
                details={[
                  {
                    label: 'ATS Parse Rate',
                    value: content.ats_parse_rate
                      ? content.ats_parse_rate.toFixed(2)
                      : '0.00',
                    suffix: '%',
                  },
                  {
                    label: 'Quantified Achievements',
                    value: `${content.quantified_achievements?.quantified_bullets || 0}/${
                      content.quantified_achievements?.total_bullets || 0
                    }`,
                  },
                  {
                    label: 'Action Verb Ratio',
                    value: content.action_verbs?.ratio
                      ? content.action_verbs?.ratio.toFixed(2)
                      : '0.00',
                  },
                  {
                    label: 'Repeated Words',
                    value: Object.keys(content.repeated_words || {}).length,
                  },
                  {
                    label: 'Spelling/Grammar Errors',
                    value: content.spelling_grammar?.error_count || 0,
                  },
                ]}
              />

              {/* Format Card */}
              <DomainCard
                title="Format"
                score={format.score}
                details={[
                  {
                    label: 'File Size',
                    value: format.file_size ? format.file_size : 0,
                    suffix: 'bytes',
                  },
                  { label: 'Word Count', value: format.word_count || 0 },
                  {
                    label: 'Total Bullets',
                    value: format.bullet_points?.total_bullets || 0,
                  },
                  {
                    label: 'Avg. Bullet Complexity',
                    value: format.bullet_points?.average_complexity
                      ? format.bullet_points.average_complexity.toFixed(2)
                      : '0.00',
                  },
                  {
                    label: 'Sections Found',
                    value: Object.keys(format.bullet_points?.section_distribution || {}).filter(
                      (sec) => format.bullet_points.section_distribution[sec] > 0
                    ).length,
                  },
                ]}
              />

              {/* Sections Card */}
              <DomainCard
                title="Sections"
                score={sections.score}
                details={[
                  {
                    label: 'Contact Info (Email)',
                    value: sections.contact_info?.email ? 'Present' : 'Missing',
                  },
                  {
                    label: 'Contact Info (Phone)',
                    value: sections.contact_info?.phone ? 'Present' : 'Missing',
                  },
                  {
                    label: 'Contact Info (LinkedIn)',
                    value: sections.contact_info?.linkedin ? 'Present' : 'Missing',
                  },
                  {
                    label: 'Essential Sections',
                    value:
                      sections.essential_sections && sections.essential_sections.length > 0
                        ? sections.essential_sections.join(', ')
                        : 'N/A',
                  },
                  {
                    label: 'Personality Sections',
                    value:
                      sections.personality_sections && sections.personality_sections.length > 0
                        ? sections.personality_sections.join(', ')
                        : 'None',
                  },
                ]}
              />

              {/* Skills Card */}
              <DomainCard
                title="Skills"
                score={skills.score}
                details={[
                  {
                    label: 'Hard Skills',
                    value: (skills.hard_skills && skills.hard_skills.length) || 0,
                  },
                  {
                    label: 'Soft Skills',
                    value: (skills.soft_skills && skills.soft_skills.length) || 0,
                  },
                ]}
              />

              {/* Style Card */}
              <DomainCard
                title="Style"
                score={style.score}
                details={[
                  {
                    label: 'Active Voice Ratio',
                    value: style.active_voice_ratio
                      ? style.active_voice_ratio.toFixed(2)
                      : '0.00',
                  },
                  {
                    label: 'Buzzwords Found',
                    value: style.buzzwords ? style.buzzwords.length : 0,
                  },
                ]}
              />

              {/* Design Card */}
              <DomainCard
                title="Design"
                score={designDetails.score}
                details={[
                  {
                    label: 'Spacing Ratio',
                    value: designDetails.metrics?.spacing_ratio
                      ? designDetails.metrics.spacing_ratio.toFixed(2)
                      : '0.00',
                  },
                  {
                    label: 'Sections Detected',
                    value: designDetails.metrics?.section_count || 0,
                  },
                  {
                    label: 'Potential Columns',
                    value: designDetails.metrics?.potential_columns || 0,
                  },
                  {
                    label: 'Line Length Variance',
                    value: designDetails.metrics?.line_length_variance
                      ? designDetails.metrics.line_length_variance.toFixed(2)
                      : '0.00',
                  },
                ]}
                extraContent={
                  designDetails.recommendations && designDetails.recommendations.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-gray-700">Recommendations:</h5>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {designDetails.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )
                }
              />
            </div>
          </section>

          {/* Resume Issues Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Resume Issues</h3>
            {issues.length > 0 ? (
              <div className="space-y-6">
                {issues.map((issue: any, index: number) => (
                  <IssueCard key={index} issue={issue} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No issues found.</p>
            )}
          </section>
        </div>
      </main>

      {/* Sticky bottom button (only if logged out) */}
      {!isLoggedIn && (
        <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex justify-center z-50">
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
          >
            <span className="hidden sm:inline">Create your dream resume today</span>
            <span className="inline sm:hidden">Fix it Now!</span>
          </Link>
        </div>
      )}
    </div>
  );
}

/* =============== COMPONENTS =============== */

/**
 * Circular Progress Bar (Overall Score)
 */
function CircularProgressBar({
  score,
  size = 120,
  strokeWidth = 10,
  animate = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}) {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const displayScore = animate ? score : 0;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"></div>
      <svg width={size} height={size} viewBox="0 0 100 100" className="relative">
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-blue-600 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animate ? offset : circumference,
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Score Bar (Sub-scores)
 */
function ScoreBar({
  label,
  score,
  animate = false,
}: {
  label: string;
  score: number;
  animate?: boolean;
}) {
  const displayScore = animate ? score : 0;
  const grade = getGrade(score);
  const gradientClass =
    score >= 80
      ? 'from-green-500 to-emerald-500'
      : score >= 60
      ? 'from-yellow-500 to-orange-500'
      : 'from-red-500 to-pink-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{displayScore}%</span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase 
            ${
              score >= 80
                ? 'bg-green-100 text-green-700'
                : score >= 60
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {grade}
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
          style={{ width: `${displayScore}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Convert score to a letter grade.
 */
function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'F';
}

/**
 * Domain Card (Detailed Breakdown). Adds subtle color-coded glow based on the domain score.
 */
function DomainCard({
  title,
  score,
  details,
  extraContent,
}: {
  title: string;
  score?: number;
  details?: { label: string; value: any; suffix?: string }[];
  extraContent?: React.ReactNode;
}) {
  // Decide glow color based on score
  const defaultShadow = 'shadow-md';
  let glowClass = 'shadow-neutral-300';

  if (score !== undefined) {
    if (score >= 80) {
      glowClass = 'shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    } else if (score >= 60) {
      glowClass = 'shadow-[0_0_12px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]';
    } else {
      glowClass = 'shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    }
  }

  return (
    <div
      className={`relative bg-white/80 border border-gray-200/50 rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 
        ${defaultShadow} ${glowClass}`}
    >
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-lg pointer-events-none" />
      <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-lg pointer-events-none" />

      <h4 className="text-xl font-semibold text-gray-700 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h4>

      {/* Score bar inside the domain card */}
      {score !== undefined && (
        <div className="mb-4">
          <ScoreBar label={`${title} Score`} score={score} animate={true} />
        </div>
      )}

      {/* Key Details */}
      {details && details.length > 0 && (
        <ul className="space-y-1 mb-3 text-gray-600 text-sm">
          {details.map((d, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{d.label}</span>
              <span className="font-medium">
                {d.value}
                {d.suffix ? ` ${d.suffix}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      {extraContent && extraContent}
    </div>
  );
}

/**
 * Issue Card Component (Resume Issues). Color-coded glow based on severity (high, medium, low).
 */
function IssueCard({ issue }: { issue: any }) {
  let borderColor = 'border-gray-300';
  let severityBadgeColor = 'bg-gray-200 text-gray-800';
  let glowClass = 'shadow-neutral-300 hover:shadow-neutral-400';

  if (issue.severity === 'high') {
    borderColor = 'border-red-500';
    severityBadgeColor = 'bg-red-100 text-red-800';
    glowClass =
      'shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]';
  } else if (issue.severity === 'medium') {
    borderColor = 'border-yellow-500';
    severityBadgeColor = 'bg-yellow-100 text-yellow-800';
    glowClass =
      'shadow-[0_0_12px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]';
  } else if (issue.severity === 'low') {
    borderColor = 'border-green-500';
    severityBadgeColor = 'bg-green-100 text-green-800';
    glowClass =
      'shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]';
  }

  return (
    <div
      className={`rounded-lg border-l-4 ${borderColor} bg-white p-5 transform transition-all duration-300 hover:-translate-y-1 
      shadow-sm ${glowClass}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-gray-700 capitalize">
          {issue.category} Issue
        </h4>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${severityBadgeColor}`}
        >
          {issue.severity}
        </span>
      </div>

      <p className="text-gray-600 mb-3">{issue.message}</p>

      {/* Suggestions */}
      {issue.suggestions && issue.suggestions.length > 0 && (
        <div className="mb-2">
          <h5 className="text-sm font-semibold text-gray-700">Suggestions:</h5>
          <ul className="list-disc list-inside text-gray-600 mt-1">
            {issue.suggestions.map((suggestion: string, idx: number) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples (if any) */}
      {issue.examples && issue.examples.length > 0 && (
        <div className="mb-2">
          <h5 className="text-sm font-semibold text-gray-700">Examples:</h5>
          <ul className="list-disc list-inside text-gray-600 mt-1">
            {issue.examples.map((example: string, idx: number) => (
              <li key={idx}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
