import SearchBar from '../SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardSearch() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // This function is called when the user clicks on the sparkles button
  const handleSearch = (query: string) => {
    // Save the query locally and show the confirmation modal
    setCurrentQuery(query);
    setShowModal(true);
  };

  // Called when the user confirms creating a resume
  const handleConfirm = async () => {
    setIsSearching(true);
    try {
      // Save the job description to localStorage under the key "Current_JobDescription"
      localStorage.setItem('Current_JobDescription', currentQuery);
      // Clear the localStorage key "extracted_resume_data"
      localStorage.removeItem('extracted_resume_data');

      // Navigate to the resume builder page with state information
      navigate('/builder', {
        state: {
          fromSearch: true,
          jobDescription: currentQuery,
        },
      });

      toast.success('Creating optimized resume...');
    } catch (error) {
      console.error('Error processing job description:', error);
      toast.error('Failed to process job description');
    } finally {
      setIsSearching(false);
      setShowModal(false);
    }
  };

  // Called when the user cancels the action in the modal
  const handleCancel = () => {
    setShowModal(false);
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* Modal content */}
          <div className="bg-white rounded-lg p-6 z-10 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">
              Create a New Resume?
            </h2>
            <p className="mb-6">
              Would you like to help you create a new resume based on the Job Description?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={handleCancel}
                disabled={isSearching}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleConfirm}
                disabled={isSearching}
              >
                Yes, Create Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
