/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { FileText, Pencil, Trash2, Share2 } from 'lucide-react';
import { Resume } from '../../types/resume';

interface ResumeGridProps {
  resumes: Resume[];
  onPreview: (resume: Resume) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  getResumeTemplate: (template: string, content: any) => React.ReactNode;
}

const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return d.toLocaleDateString('en-US', options);
};

export default function ResumeGrid({ resumes, onPreview, onShare, onDelete, getResumeTemplate }: ResumeGridProps) {
  if (resumes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
        <p className="text-gray-500 mb-4">Create your first resume to get started</p>
        <Link
          to="/builder"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your First Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => onPreview(resume)}
        >
          {/* Card background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Resume preview section */}
          <div className="relative h-[280px] bg-gray-50 border-b border-gray-200 flex items-center justify-center overflow-hidden">
            <div className="transform scale-[0.93] transition-transform duration-300 group-hover:scale-[0.96]">
              {getResumeTemplate(resume.template || 'modern', resume.content)}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none" />
          </div>

          {/* Card content */}
          <div className="relative p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[200px]">
                  {resume.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(resume.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {resume.is_public && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-emerald-200">
                    Public
                  </span>
                )}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(resume.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <Link
                  to={`/builder?id=${resume.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(resume.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}