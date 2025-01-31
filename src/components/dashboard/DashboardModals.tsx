import { FileText, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface OnboardingFocusProps {
  onClose: () => void;
}

export function OnboardingFocus({ onClose }: OnboardingFocusProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Continue Your Resume</h3>
          <p className="text-gray-600 mb-6">
            We noticed you were working on a resume. Would you like to continue where you left off?
          </p>
          <div className="space-y-3">
            <Link
              to="/builder"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              Continue Resume
            </Link>
            <button
              onClick={onClose}
              className="block w-full px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Start Fresh Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DraftModalProps {
  onClose: () => void;
  onContinue: () => void;
  onDelete: () => void;
}

export function DraftModal({ onClose, onContinue, onDelete }: DraftModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {!showConfirm ? (
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Draft Found</h3>
            <p className="text-gray-600 mb-6">
              We found an unfinished resume draft. Would you like to continue editing it?
            </p>
            <div className="space-y-3">
              <button
                onClick={onContinue}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                Delete Draft
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Decide Later
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Type "confirm" to delete your draft. This action cannot be undone.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Type 'confirm'"
            />
            <div className="space-y-3">
              <button
                onClick={onDelete}
                disabled={confirmText !== 'confirm'}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Draft
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}