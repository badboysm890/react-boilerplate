import { useState, useEffect, useCallback } from 'react';
import { convertPDFToImage } from '../../utils/pdfConverter';
import { resumeStorage } from '../../utils/storage';
import { UploadedResume, ResumeData } from '../../types/resume';
import { getResumeTemplate } from '../../lib/utils';

interface ResumePreviewProps {
  resume?: UploadedResume;
  data?: ResumeData;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  enlarged?: boolean;
  onStatusChange?: (id: string, status: UploadedResume['status']) => void;
  onDownload?: () => void;
  onTemplateChange?: (template: string) => void;
}

export default function ResumePreview({ 
  resume,
  data,
  onMouseEnter, 
  onMouseLeave, 
  enlarged = false,
  onStatusChange,
  onDownload,
  onTemplateChange
}: ResumePreviewProps) {
  const [previewError, setPreviewError] = useState(false);
  const [localStatus, setLocalStatus] = useState(resume?.status);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const updateStatus = useCallback((status: UploadedResume['status']) => {
    if (!resume) return;
    console.log(`Updating status for ${resume.name} to: ${status}`);
    setLocalStatus(status);
    resume.status = status;
    onStatusChange?.(resume.id, status);
  }, [resume, onStatusChange]);

  const updateProgress = useCallback((progress: number) => {
    if (!resume) return;
    console.log(`Progress update for ${resume.name}: ${progress}%`);
    setConversionProgress(progress);
    resume.conversionProgress = progress;
  }, [resume]);

  const generatePreview = useCallback(async () => {
    if (!resume) return;
    try {
      updateStatus('converting');
      updateProgress(0);

      const previewUrl = await convertPDFToImage(resume.file, (progress) => {
        updateProgress(progress);
      });

      resumeStorage.savePreview(resume.id, resume.name, resume.size, previewUrl);
      setLocalPreviewUrl(previewUrl);
      resume.previewUrl = previewUrl;
      
      updateProgress(100);
      updateStatus('completed');
      console.log(`Preview generation completed for: ${resume.name}`);
    } catch (error) {
      console.error('Error generating preview:', error);
      setPreviewError(true);
      setLocalPreviewUrl(null);
      updateProgress(0);
      updateStatus('error');
    }
  }, [resume, updateStatus, updateProgress]);

  // Handle PDF preview generation
  useEffect(() => {
    if (resume) {
      const storedPreview = resumeStorage.getPreview(resume.id);
      if (storedPreview) {
        setLocalPreviewUrl(storedPreview.previewUrl);
        updateStatus('completed');
      } else if (resume.status === 'pending') {
        console.log(`Starting preview generation for resume: ${resume.name}`);
        generatePreview();
      }
    }
  }, [resume, generatePreview, updateStatus]);

  if (previewError) {
    return (
      <div className="flex items-center justify-center bg-red-50 rounded-lg p-4">
        <p className="text-sm text-red-600">Failed to generate preview</p>
      </div>
    );
  }

  // If we have ResumeData, render the template with template selection
  if (data) {
    return (
      <div className="space-y-4">
        {onTemplateChange && (
          <div className="flex items-center justify-between mb-4">
            <select
              value={data.template}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="modern">Modern Template</option>
              <option value="minimal">Minimal Template</option>
              <option value="creative">Creative Template</option>
              <option value="executive">Executive Template</option>
              <option value="neo">Neo Template</option>
            </select>
            {onDownload && (
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {getResumeTemplate(data.template || 'modern', data)}
        </div>
      </div>
    );
  }

  // Otherwise render the PDF preview
  return (
    <div
      className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
        enlarged ? 'scale-150 z-50' : 'scale-100'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {localPreviewUrl ? (
        <div className="aspect-[3/4] bg-white">
          <img
            src={localPreviewUrl}
            alt={resume?.name || 'Resume preview'}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 aspect-[3/4]">
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${conversionProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {localStatus === 'converting' ? 'Converting...' : 'Processing...'} {conversionProgress}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}