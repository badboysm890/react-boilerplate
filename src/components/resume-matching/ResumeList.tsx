import { useEffect, useState } from 'react';
import { UploadedResume } from '../../types/resume';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import { resumeStorage } from '../../utils/storage';

interface ResumeListProps {
  resumes: UploadedResume[];
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  analysisStatus?: Record<string, {
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
  }>;
}

export default function ResumeList({ 
  resumes, 
  onPreview, 
  onDelete,
  onRetry,
  analysisStatus = {}
}: ResumeListProps) {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedPreviews: Record<string, string> = {};
    
    resumes.forEach(resume => {
      const storedPreview = resumeStorage.getPreview(resume.id);
      if (storedPreview) {
        loadedPreviews[resume.id] = storedPreview.previewUrl;
      }
    });

    setPreviewUrls(loadedPreviews);
  }, [resumes]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {resumes.map(resume => {
        const status = analysisStatus[resume.id];
        const isError = status?.status === 'error';
        const isProcessing = status?.status === 'processing';

        return (
          <div key={resume.id} className="relative group">
            <div 
              className={`aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden ${
                isError ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {previewUrls[resume.id] ? (
                <div className="relative h-full">
                  <img
                    src={previewUrls[resume.id]}
                    alt={resume.name}
                    className="w-full h-full object-contain"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-full max-w-[120px] mb-2">
                          <div className="h-2 bg-gray-200/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white transition-all duration-300"
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm">Analyzing...</p>
                      </div>
                    </div>
                  )}
                  {isError && (
                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm text-red-600 font-medium mb-2">Analysis Failed</p>
                        {onRetry && (
                          <button
                            onClick={() => onRetry(resume.id)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500">
                    {resume.status === 'error' ? 'Preview failed' : 'No preview available'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => onPreview(resume.id)}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                  title="View Resume"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(resume.id)}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* File info */}
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 truncate">{resume.name}</p>
              <p className="text-xs text-gray-500">{resume.size}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}