import { X, Pencil, Trash2 } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { getResumeTemplate } from '../../lib/utils';

interface ResumeModalProps {
  resume: {
    id: string;
    content: ResumeData;
    template: string;
  };
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ResumeModal({ resume, onClose, onEdit, onDelete }: ResumeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-5xl mx-auto flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">{resume.content.title}</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onEdit(resume.id)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
              title="Edit Resume"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(resume.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Delete Resume"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="max-w-[21cm] mx-auto bg-white shadow-lg">
            {getResumeTemplate(resume.template || 'modern', resume.content)}
          </div>
        </div>
      </div>
    </div>
  );
}