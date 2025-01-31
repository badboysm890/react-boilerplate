import SearchBar from '../SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardSearch() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Store the job description for later use
      localStorage.setItem('job_description', query);
      
      // Navigate to resume builder with the job description
      navigate('/builder', { 
        state: { 
          fromSearch: true,
          jobDescription: query 
        }
      });
      
      toast.success('Creating optimized resume...');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to process job description');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Paste job description – I'll help you create the perfect resume"
            initialValue=""
            showAutoFill={false} // Disable auto-fill button in dashboard search
          />
        </div>
      </div>
    </div>
  );
}