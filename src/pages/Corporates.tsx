import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  X, 
  FileText, 
  ChevronRight,
  ArrowLeft,
  Trash2,
  Users,
  Briefcase,
  AlertCircle,
  Eye
} from 'lucide-react';
import ResumePreview from '../components/resume-builder/ResumePreview';
import ResumeList from '../components/resume-matching/ResumeList';
import ConfirmationDialog from '../components/resume-matching/ConfirmationDialog';
import ResumePreviewModal from '../components/resume-matching/ResumePreviewModal';
import { UploadedResume } from '../types/resume';
import { resumeStorage } from '../utils/storage';
import toast from 'react-hot-toast';

const steps = [
  {
    id: 'job',
    icon: Briefcase
  },
  {
    id: 'upload',
    icon: Upload
  },
  {
    id: 'match',
    icon: Users
  }
];

interface AnalysisProgress {
  resumeId: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
}

export default function Corporates() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState<UploadedResume[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewingResume, setPreviewingResume] = useState<string | null>(null);
  const [allConverted, setAllConverted] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedResume, setSelectedResume] = useState<UploadedResume | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<Record<string, AnalysisProgress>>({});
  const [currentlyAnalyzing, setCurrentlyAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    if (resumes.length > 0) {
      const processing = resumes.filter(resume => 
        resume.status === 'pending' || resume.status === 'converting'
      ).length;
      setProcessingCount(processing);
      
      const allDone = resumes.every(resume => 
        resume.status === 'completed' || resume.status === 'error'
      );
      setAllConverted(allDone);
    } else {
      setProcessingCount(0);
      setAllConverted(false);
    }
  }, [resumes]);

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
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast.error('Please upload only PDF files');
      return;
    }

    const newResumes = pdfFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: formatFileSize(file.size),
      uploadTime: new Date().toLocaleString(),
      file: file,
      conversionProgress: 0,
      status: 'pending' as const,
      _forceUpdate: Date.now()
    }));

    setResumes(prev => {
      const updated = [...prev, ...newResumes];
      return updated;
    });
    
    toast.success(`${pdfFiles.length} resume${pdfFiles.length === 1 ? '' : 's'} uploaded successfully`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteResume = (id: string) => {
    setResumes(prev => {
      const updated = prev.filter(resume => resume.id !== id);
      return updated;
    });
    toast.success('Resume removed');
  };

  const analyzeResume = async (resume: UploadedResume, jobDescription: string): Promise<any> => {
    try {
      const preview = resumeStorage.getPreview(resume.id);
      if (!preview) {
        throw new Error('No preview available');
      }

      setAnalysisProgress(prev => ({
        ...prev,
        [resume.id]: {
          resumeId: resume.id,
          progress: 0,
          status: 'processing'
        }
      }));

      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const current = prev[resume.id];
          if (current && current.progress < 90) {
            return {
              ...prev,
              [resume.id]: {
                ...current,
                progress: Math.min(current.progress + 10, 90)
              }
            };
          }
          return prev;
        });
      }, 500);

      const response = await fetch('https://fastapi-drab-iota.vercel.app/analyze_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          base64_image: preview.previewUrl,
          job_description: jobDescription
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();

      setAnalysisProgress(prev => ({
        ...prev,
        [resume.id]: {
          resumeId: resume.id,
          progress: 100,
          status: 'completed',
          result
        }
      }));

      localStorage.setItem(`analysis_${resume.id}`, JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalysisProgress(prev => ({
        ...prev,
        [resume.id]: {
          resumeId: resume.id,
          progress: 0,
          status: 'error'
        }
      }));
      throw error;
    }
  };

  const handleGetMatchingResumes = async () => {
    setIsAnalyzing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const resume of resumes) {
        // Skip if analysis already exists
        const existingAnalysis = localStorage.getItem(`analysis_${resume.id}`);
        if (existingAnalysis) {
          console.log(`Analysis already exists for resume ${resume.id}`);
          successCount++;
          continue;
        }

        setCurrentlyAnalyzing(resume.id);
        try {
          await analyzeResume(resume, jobDescription);
          successCount++;
        } catch (error) {
          console.error(`Failed to analyze resume ${resume.id}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully analyzed ${successCount} resume${successCount !== 1 ? 's' : ''}`);
        if (errorCount === 0) {
          navigate('/corporates/results');
        }
      }
      if (errorCount > 0) {
        toast.error(`Failed to analyze ${errorCount} resume${errorCount !== 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error in analysis process:', error);
      toast.error('Analysis process failed');
    } finally {
      setIsAnalyzing(false);
      setCurrentlyAnalyzing(null);
    }
  };

  const handleRetryAnalysis = async (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;

    setIsAnalyzing(true);
    setCurrentlyAnalyzing(resumeId);

    try {
      await analyzeResume(resume, jobDescription);
      toast.success('Analysis completed successfully');
      
      // Check if all resumes are now analyzed
      const allAnalyzed = resumes.every(r => {
        return localStorage.getItem(`analysis_${r.id}`) !== null;
      });

      if (allAnalyzed) {
        navigate('/corporates/results');
      }
    } catch (error) {
      console.error('Retry analysis failed:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
      setCurrentlyAnalyzing(null);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return jobDescription.trim().length > 0;
      case 1:
        return resumes.length > 0 && allConverted;
      default:
        return true;
    }
  };

  const handleResumeStatusChange = (id: string, status: UploadedResume['status']) => {
    setResumes(prev => {
      const updated = prev.map(resume => 
        resume.id === id ? { ...resume, status } : resume
      );
      return updated;
    });
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'prev' && currentStep === 2) {
      setShowConfirmDialog(true);
    } else if (direction === 'prev' && currentStep === 1 && resumes.length > 0) {
      setShowConfirmDialog(true);
    } else {
      setCurrentStep(prev => direction === 'next' ? prev + 1 : prev - 1);
    }
  };

  const handleConfirmReset = () => {
    resumeStorage.clearPreviews();
    setResumes([]);
    setCurrentStep(prev => prev - 1);
    setShowConfirmDialog(false);
    toast.success('All resumes cleared');
  };

  const handlePreview = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) {
      setSelectedResume(resume);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" /> <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hidden sm:inline">
              HyreTrack
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Progress" className="mb-12">
          <div className="relative flex items-center justify-between px-12">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200">
              <div
                className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActiveOrCompleted = currentStep >= index;
              const isCurrent = currentStep === index;

              return (
                <div key={step.id} className="relative z-10">
                  <div
                    className={`
                      flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                      ${isActiveOrCompleted
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                      }
                      ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                    `}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Enter Job Description
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-gray-500">
                    Paste the job requirements to find the best matching candidates
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-gray-400 hidden sm:block" />
              </div>

              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Paste the job description here..."
                />
                {jobDescription && (
                  <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                    {jobDescription.length} characters
                  </div>
                )}
              </div>

              {!jobDescription && (
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Please enter a job description to continue
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Upload Resumes
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-gray-500">
                    Upload candidate resumes in PDF format
                  </p>
                </div>
                <Upload className="h-8 w-8 text-gray-400 hidden sm:block" />
              </div>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-6 sm:p-12 transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  multiple
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload 
                    className={`h-10 sm:h-12 w-10 sm:w-12 mb-4 ${
                      isDragging ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-sm sm:text-base text-gray-600 text-center">
                    <span className="text-blue-600 font-medium">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    PDF files up to 10MB each
                  </p>
                </label>
              </div>

              {resumes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      {resumes.length} Resume{resumes.length !== 1 ? 's' : ''} Uploaded
                    </h3>
                    <button
                      onClick={() => setResumes([])}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {resumes.map(resume => (
                      <div
                        key={resume.id}
                        className="relative group"
                      >
                        <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                          <ResumePreview
                            resume={resume}
                            onMouseEnter={() => setPreviewingResume(resume.id)}
                            onMouseLeave={() => setPreviewingResume(null)}
                            enlarged={previewingResume === resume.id}
                            onStatusChange={handleResumeStatusChange}
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePreview(resume.id)}
                              className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteResume(resume.id)}
                              className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{resume.name}</p>
                          <p className="text-xs text-gray-500">{resume.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {processingCount > 0 && (
                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                      <p className="text-sm text-yellow-700">
                        Please wait while we process {processingCount} resume{processingCount !== 1 ? 's' : ''}...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-blue-100 mb-6">
                  <Users className="h-8 sm:h-10 w-8 sm:w-10 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Ready to Find Your Best Matches
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-lg mx-auto">
                  We'll analyze {resumes.length} resume{resumes.length !== 1 ? 's' : ''} against 
                  your job description using our advanced AI matching algorithm.
                </p>
              </div>

              <ResumeList
                resumes={resumes}
                onPreview={handlePreview}
                onDelete={handleDeleteResume}
                onRetry={handleRetryAnalysis}
                analysisStatus={analysisProgress}
              />

              <div className="flex flex-col items-center pt-8">
                {isAnalyzing && currentlyAnalyzing && (
                  <div className="w-full max-w-md mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Analyzing Resume {Object.values(analysisProgress).filter(p => p.status === 'completed').length + 1} of {resumes.length}
                      </span>
                      <span className="text-sm text-gray-500">
                        {analysisProgress[currentlyAnalyzing]?.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ 
                          width: `${analysisProgress[currentlyAnalyzing]?.progress || 0}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGetMatchingResumes}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3 animate-spin" />
                      Analyzing Resumes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3" />
                      Get Matching Resumes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => handleNavigation('next')}
                disabled={!canProceed()}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-5 w-5 ml-0 sm:ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <ResumePreviewModal
        resume={selectedResume}
        onClose={() => setSelectedResume(null)}
      />
    </div>
  );
}