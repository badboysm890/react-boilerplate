import { X } from 'lucide-react';
import { Resume } from '../../types/resume';

interface ShareModalProps {
  resume: Resume;
  onClose: () => void;
  onTogglePublic: (id: string, isPublic: boolean) => Promise<void>;
}

export default function ShareModal({ resume, onClose, onTogglePublic }: ShareModalProps) {
  const shareUrl = `${window.location.origin}/r/${resume.share_token}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Share Resume</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {/* Public Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Public Access</h4>
              <p className="text-xs text-gray-500 mt-1">
                Make your resume accessible via a public link
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={resume.is_public}
                onChange={() => onTogglePublic(resume.id, !resume.is_public)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                            peer-focus:ring-blue-300 rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
            </label>
          </div>

          {/* Share Link */}
          {resume.is_public && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Share Link</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 block w-full px-4 py-3 text-sm border border-gray-300 
                           rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                           transition-colors text-sm font-medium flex-shrink-0"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Anyone with this link can view your resume
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}