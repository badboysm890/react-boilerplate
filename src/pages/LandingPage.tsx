import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  LogOut,
  FileText,
  Share2,
  Palette,
  Download,
  Star,
  Shield,
  Layout,
  Menu,
  X,
  Github,
  Linkedin,
  Wand2,
  Brain,
  Zap,
  ScrollText,
  Upload,
  ChevronRight,
  Users,
  Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Features data
const features = [
  {
    icon: Brain,
    name: 'AI-Powered Resume Builder',
    description:
      'Our intelligent AI analyzes job descriptions and your professional profiles to create perfectly tailored resumes.'
  },
  {
    icon: Wand2,
    name: 'Auto-Fill Magic',
    description:
      'Seamlessly import your LinkedIn and GitHub profiles to automatically populate your resume with your latest achievements.'
  },
  {
    icon: Layout,
    name: 'Premium Templates',
    description:
      'Choose from our collection of ATS-friendly, professionally designed templates that make your resume stand out.'
  },
  {
    icon: Zap,
    name: 'Real-time Optimization',
    description:
      'Get instant suggestions and improvements as you build your resume, ensuring it matches job requirements perfectly.'
  },
  {
    icon: Share2,
    name: 'Smart Sharing',
    description:
      'Share your resume with a custom link or make it public on your profile. Control who sees what with granular privacy settings.'
  },
  {
    icon: ScrollText,
    name: 'Multiple Versions',
    description:
      'Create and manage multiple versions of your resume for different job applications, all in one place.'
  }
];

// Testimonials data with People icon instead of images
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    content:
      'The AI-powered resume builder is incredible! It analyzed my GitHub profile and created a perfect tech resume that helped me land my dream job at Google.'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager at Meta',
    content:
      'The LinkedIn integration and auto-fill feature saved me hours. The smart suggestions helped me highlight achievements I would have otherwise missed.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer at Apple',
    content:
      'The modern templates and real-time optimization features are game-changers. I love how it tailors my resume for each job application automatically!'
  }
];

interface AnalysisData {
  resumeId: string;
  data: any;
  timestamp: string;
}

// Upload Modal Component
function UploadModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const loadingToast = toast.loading('Analyzing your resume...');

      const response = await fetch(
        'https://fastapi-drab-iota.vercel.app/api/v1/resume/analyze',
        {
          method: 'POST',
          headers: { accept: 'application/json' },
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to analyze resume');

      const analysisData = await response.json();

      // Store analysis data
      localStorage.setItem(
        'resume_analysis',
        JSON.stringify({
          resumeId: 'uploaded',
          data: analysisData,
          timestamp: new Date().toISOString()
        })
      );

      toast.dismiss(loadingToast);
      toast.success('Analysis complete!');
      onClose(); // Close modal before navigating
      navigate('/analysis-report');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Check Your Resume Strength
          </h3>
          <p className="text-gray-600 mb-8">
            Upload your resume to get an instant AI-powered analysis of its strengths
            and areas for improvement.
          </p>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-200 ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
              disabled={isUploading}
            />
            <label htmlFor="resume-upload" className="flex flex-col items-center cursor-pointer">
              <Upload
                className={`h-8 w-8 mb-4 ${
                  isDragging ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span className="text-sm text-gray-600">
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <>
                    Drag & drop your resume here or <span className="text-blue-600">browse</span>
                  </>
                )}
              </span>
              <span className="text-xs text-gray-500 mt-2">Supports PDF format only</span>
            </label>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Don't have a resume yet?</p>
            <button
              onClick={() => navigate('/builder')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
            >
              Create Your Resume Now
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Menu Component
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
          <Link
            to="/builder"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Create Resume
          </Link>
        </div>
      )}
    </div>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const navigate = useNavigate();

  // Listen to scroll event and set sticky CTA visibility (only for mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              HyreTrack
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 transform -skew-y-12"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Create AI-Powered Resumes
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mt-2">
                That Get You Hired
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-600">
              Let AI analyze your experience and job requirements to create the perfect resume.
              Import from LinkedIn & GitHub, customize with modern templates, and land your dream job faster.
            </p>
            <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Shield className="h-5 w-5 mr-2" />
                Check Resume Strength
              </button>

              <Link
                to="/builder"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Build Your Resume Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/corporates/landing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Users className="h-5 w-5 mr-2" />
                Corporates
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Try For Free
              </Link>


            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Powered by AI, Built for Success
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Everything you need to create professional, ATS-friendly resumes that stand out
            </p>
          </div>
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative bg-white p-8 sm:p-10 rounded-lg">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.name}</h3>
                      <p className="mt-4 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Social Integration Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Import Your Professional Profile
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Connect your LinkedIn and GitHub profiles to automatically create a comprehensive resume
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-6">
                <Linkedin className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-semibold">LinkedIn Integration</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Import work experience and skills automatically</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Extract professional achievements and recommendations</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Keep your resume in sync with your LinkedIn profile</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-6">
                <Github className="h-8 w-8 text-gray-900" />
                <h3 className="ml-3 text-xl font-semibold">GitHub Integration</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Showcase your best projects and contributions</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Highlight your technical skills and expertise</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Display your open source contributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Loved by Job Seekers</h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Join thousands of professionals who landed their dream jobs using HyreTrack
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <Users className="h-10 w-10 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Create your AI-powered resume in minutes
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-all duration-200"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                HyreTrack
              </span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">Contact</a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-center text-gray-500">© {new Date().getFullYear()} HyreTrack All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky bottom button (only for mobile and only when scrolled past threshold) */}
      {!localStorage.getItem('isLoggedIn') && showStickyCTA && (
        <div className="fixed bottom-0 w-full md:hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex justify-center z-50">
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
          >
            Get Started Free
          </Link>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
}