import { X } from 'lucide-react';
import { UploadedResume } from '../../types/resume';
import { resumeStorage } from '../../utils/storage';
import { useEffect, useState } from 'react';

interface ResumePreviewModalProps {
  resume: UploadedResume | null;
  onClose: () => void;
}

export default function ResumePreviewModal({ resume, onClose }: ResumePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (resume) {
      const storedPreview = resumeStorage.getPreview(resume.id);
      if (storedPreview) {
        setPreviewUrl(storedPreview.previewUrl);
      }
    }
  }, [resume]);

  if (!resume) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 max-w-3xl w-full mx-4 h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 px-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{resume.name}</h3>
            <p className="text-sm text-gray-500">{resume.size}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50 rounded-lg">
          {previewUrl ? (
            <div className="min-h-full flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={resume.name}
                className="max-w-full h-auto shadow-lg rounded-lg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                {resume.status === 'error' ? 'Preview failed' : 'No preview available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}