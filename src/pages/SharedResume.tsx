import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ResumeData } from '../types/resume';
import { getResumeTemplate } from '../lib/utils';
import { FileText, ArrowLeft } from 'lucide-react';

export default function SharedResume() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<{data: ResumeData, template: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSharedResume() {
      try {
        if (!token) {
          setError('Invalid share link');
          setLoading(false);
          return;
        }

        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .select('content, template, is_public')
          .eq('share_token', token)
          .single();

        if (resumeError) {
          if (resumeError.code === 'PGRST116') {
            setError('Resume not found');
          } else {
            throw resumeError;
          }
          setLoading(false);
          return;
        }

        if (!resumeData.is_public) {
          setError('This resume is no longer public');
          setLoading(false);
          return;
        }

        setResume({
          data: resumeData.content,
          template: resumeData.template || 'modern' // Default to modern if no template specified
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    }

    fetchSharedResume();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[21cm] mx-auto bg-white shadow-lg">
        {getResumeTemplate(resume.template, resume.data)}
        
        <div className="p-4 text-center text-sm text-gray-500 border-t">
          Created with RizzumeIt
        </div>
      </div>
    </div>
  );
}