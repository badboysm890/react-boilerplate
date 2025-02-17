import { useState, useEffect } from 'react';
import { PersonalInfo } from '../../types/resume';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

interface ConfirmationModalProps {
  existingData: Record<string, string>;
  newData: Record<string, string>;
  onConfirm: (selectedFields: Record<string, string>) => void;
  onCancel: () => void;
}

function ConfirmationModal({
  existingData,
  newData,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    Object.keys(newData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleCheckboxChange = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdate = () => {
    const fieldsToUpdate: Record<string, string> = {};
    Object.entries(newData).forEach(([field, value]) => {
      if (selectedFields[field]) {
        fieldsToUpdate[field] = value;
      }
    });
    onConfirm(fieldsToUpdate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Fields?</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Some fields already contain information. Would you like to update them with the new values?
        </p>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {Object.entries(newData).map(([field, value]) => (
            <div key={field} className="border-b border-gray-200 pb-4 flex items-start">
              <input
                type="checkbox"
                checked={selectedFields[field]}
                onChange={() => handleCheckboxChange(field)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">
                  {field.includes('.')
                    ? field
                        .split('.')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </div>
                <div className="text-xs text-gray-500">Current: {existingData[field]}</div>
                <div className="text-xs text-blue-600">New: {value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Selected
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [pendingChanges, setPendingChanges] = useState<Record<string, string> | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Helper: Prepend a prefix if needed.
  const addPrefix = (value: string, prefix: string) => {
    if (value && !value.startsWith(prefix)) {
      return prefix + value;
    }
    return value;
  };

  // Update top-level fields (phone, email, etc.)
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    // Automatically prepend prefixes if the field is touched and non-empty.
    if (field === 'phone') {
      value = addPrefix(value, 'Phone: ');
    }
    if (field === 'email') {
      value = addPrefix(value, 'Email: ');
    }
    const updatedData = { ...data, [field]: value };
    onChange(updatedData);
  };

  // Update social links fields.
  const handleSocialLinkChange = (platform: keyof typeof data.socialLinks, value: string) => {
    if (platform === 'linkedin') {
      value = addPrefix(value, 'LinkedIn: ');
    }
    if (platform === 'github') {
      value = addPrefix(value, 'Github: ');
    }
    const updatedData = {
      ...data,
      socialLinks: { ...data.socialLinks, [platform]: value }
    };
    onChange(updatedData);
  };

  const handleAIExtract = async (text: string, skipExtraction: boolean = false) => {
    setIsExtracting(true);
    try {
      if (skipExtraction) {
        const result = JSON.parse(text);

        let updatedData = { ...data };
        const newFields = new Set<string>();
        const changes: Record<string, string> = {};
        const existingData: Record<string, string> = {};
        let hasConflicts = false;

        const fieldMappings: Record<string, string | [string, string]> = {
          full_name: 'fullName',
          professional_title: 'title',
          email: 'email',
          phone_number: 'phone',
          location: 'location',
          website_url: 'website',
          linkedin_url: ['socialLinks', 'linkedin'],
          professional_summary: 'summary'
        };

        Object.entries(result).forEach(([apiField, apiValue]) => {
          const mapping = fieldMappings[apiField];
          if (!mapping) return;

          if (typeof apiValue !== 'string' || apiValue.trim() === '' || apiValue === 'N/A') {
            return;
          }

          const processedValue = apiValue.trim();

          if (Array.isArray(mapping)) {
            const [parent, child] = mapping;
            const currentValue = data[parent]?.[child] || '';
            if (currentValue && currentValue !== processedValue) {
              hasConflicts = true;
              changes[`${parent}.${child}`] = processedValue;
              existingData[`${parent}.${child}`] = currentValue;
            } else if (!currentValue) {
              updatedData = {
                ...updatedData,
                [parent]: {
                  ...updatedData[parent],
                  [child]: processedValue
                }
              };
              newFields.add(`${parent}.${child}`);
            }
          } else {
            const currentValue = data[mapping] || '';
            if (currentValue && currentValue !== processedValue) {
              hasConflicts = true;
              changes[mapping] = processedValue;
              existingData[mapping] = currentValue;
            } else if (!currentValue) {
              updatedData[mapping] = processedValue;
              newFields.add(mapping);
            }
          }
        });

        if (hasConflicts) {
          setPendingChanges(changes);
          setShowConfirmation(true);
          setIsExtracting(false);
          return;
        }

        if (newFields.size > 0) {
          onChange(updatedData);
          setAiFilledFields(newFields);
          toast.success('Information loaded successfully!');

          setTimeout(() => {
            setAiFilledFields(new Set());
          }, 3000);
        } else {
          toast('No new information found to load', { icon: 'ℹ️' });
        }

        return;
      }

      // Build the payload including the resume_text and,
      // if available, the job_description from local storage.
      const jobDescription = localStorage.getItem('Current_JobDescription');
      const payload: { resume_text: string; job_description?: string } = { resume_text: text };
      if (jobDescription) {
        payload.job_description = jobDescription;
      }

      const response = await fetch('https://fastapi-drab-iota.vercel.app/extract_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      const result = apiResponse.resume_data;

      if (!result) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem('extracted_resume_data', JSON.stringify(result));

      let updatedData = { ...data };
      const newFields = new Set<string>();
      const changes: Record<string, string> = {};
      const existingData: Record<string, string> = {};
      let hasConflicts = false;

      const fieldMappings: Record<string, string | [string, string]> = {
        full_name: 'fullName',
        professional_title: 'title',
        email: 'email',
        phone_number: 'phone',
        location: 'location',
        website_url: 'website',
        linkedin_url: ['socialLinks', 'linkedin'],
        professional_summary: 'summary'
      };

      Object.entries(result).forEach(([apiField, apiValue]) => {
        const mapping = fieldMappings[apiField];
        if (!mapping) return;

        if (typeof apiValue !== 'string' || apiValue.trim() === '' || apiValue === 'N/A') {
          return;
        }

        const processedValue = apiValue.trim();

        if (Array.isArray(mapping)) {
          const [parent, child] = mapping;
          const currentValue = data[parent]?.[child] || '';
          if (currentValue && currentValue !== processedValue) {
            hasConflicts = true;
            changes[`${parent}.${child}`] = processedValue;
            existingData[`${parent}.${child}`] = currentValue;
          } else if (!currentValue) {
            updatedData = {
              ...updatedData,
              [parent]: {
                ...updatedData[parent],
                [child]: processedValue
              }
            };
            newFields.add(`${parent}.${child}`);
          }
        } else {
          const currentValue = data[mapping] || '';
          if (currentValue && currentValue !== processedValue) {
            hasConflicts = true;
            changes[mapping] = processedValue;
            existingData[mapping] = currentValue;
          } else if (!currentValue) {
            updatedData[mapping] = processedValue;
            newFields.add(mapping);
          }
        }
      });

      if (hasConflicts) {
        setPendingChanges(changes);
        setShowConfirmation(true);
        setIsExtracting(false);
        return;
      }

      if (newFields.size > 0) {
        onChange(updatedData);
        setAiFilledFields(newFields);
        toast.success('Information extracted successfully!');

        setTimeout(() => {
          setAiFilledFields(new Set());
        }, 3000);
      } else {
        toast('No new information found to extract', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error extracting information:', error);
      toast.error('Failed to extract information. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmChanges = (selectedFields: Record<string, string>) => {
    if (!pendingChanges) return;

    let updatedData = { ...data };
    const updatedFields = new Set<string>();

    Object.entries(selectedFields).forEach(([field, value]) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updatedData = {
          ...updatedData,
          [parent]: {
            ...updatedData[parent],
            [child]: value
          }
        };
        updatedFields.add(field);
      } else {
        updatedData[field] = value;
        updatedFields.add(field);
      }
    });

    onChange(updatedData);

    setAiFilledFields(updatedFields);
    setTimeout(() => {
      setAiFilledFields(new Set());
    }, 3000);

    setPendingChanges(null);
    setShowConfirmation(false);
    toast.success('Selected information updated successfully!');
  };

  const handleCancelChanges = () => {
    setPendingChanges(null);
    setShowConfirmation(false);
  };

  // Warn user before leaving the page if required fields are not filled.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check required fields – adjust these as needed.
      if (!data.fullName || !data.email || !data.phone) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data]);

  // Listen for messages from the parent (or another window) to trigger the AI extraction.
  useEffect(() => {
    const handleSearchMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SEARCH_QUERY' && event.data?.query) {
        const extractedData = localStorage.getItem('extracted_resume_data');
        if (extractedData) {
          handleAIExtract(extractedData, true);
        } else {
          handleAIExtract(event.data.query);
        }
      }
    };

    window.addEventListener('message', handleSearchMessage);
    return () => window.removeEventListener('message', handleSearchMessage);
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              disabled={isExtracting}
              className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition-all duration-300 text-base
                ${isExtracting ? 'bg-gray-50' : ''}
                ${aiFilledFields.has('fullName') ? 
                  'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                }`}
              placeholder="Enter your full name"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Professional Title */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Professional Title</label>
          <div className="relative">
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={isExtracting}
              className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition-all duration-300 text-base
                ${isExtracting ? 'bg-gray-50' : ''}
                ${aiFilledFields.has('title') ? 
                  'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                }`}
              placeholder="e.g., Senior Software Engineer"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Email</label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isExtracting}
              className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition-all duration-300 text-base
                ${isExtracting ? 'bg-gray-50' : ''}
                ${aiFilledFields.has('email') ? 
                  'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                }`}
              placeholder="your.email@example.com"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Phone</label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isExtracting}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-base"
              placeholder="+1 (555) 000-0000"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Location</label>
          <div className="relative">
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={isExtracting}
              className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition-all duration-300 text-base
                ${isExtracting ? 'bg-gray-50' : ''}
                ${aiFilledFields.has('location') ? 
                  'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                }`}
              placeholder="City, Country"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700">Website</label>
          <div className="relative">
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              disabled={isExtracting}
              className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                transition-all duration-300 text-base
                ${isExtracting ? 'bg-gray-50' : ''}
                ${aiFilledFields.has('website') ? 
                  'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                }`}
              placeholder="https://yourwebsite.com"
            />
            {isExtracting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-4">
        <label className="block text-base font-medium text-gray-700">Professional Summary</label>
        <div className="relative">
          <textarea
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            disabled={isExtracting}
            rows={4}
            className={`block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
              transition-all duration-300 text-base resize-none
              ${isExtracting ? 'bg-gray-50' : ''}
              ${aiFilledFields.has('summary') ? 
                'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
              }`}
            placeholder="Write a brief summary of your professional background and key achievements..."
          />
          {isExtracting && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Social Links Toggle */}
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setShowSocialLinks(!showSocialLinks)}
          className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {showSocialLinks ? 'Hide Social Links' : 'Add Social Links'}
        </button>

        {/* Social Links Inputs */}
        {showSocialLinks && (
          <div className="space-y-6">
            {/* LinkedIn */}
            <div className="flex items-center space-x-4">
              <Linkedin className="h-6 w-6 text-blue-600" />
              <div className="relative flex-1">
                <input
                  type="url"
                  value={data.socialLinks.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  disabled={isExtracting}
                  placeholder="LinkedIn Profile URL"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    transition-all duration-300 text-base
                    ${isExtracting ? 'bg-gray-50' : ''}
                    ${aiFilledFields.has('socialLinks.linkedin') ? 
                      'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                    }`}
                />
                {isExtracting && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-center space-x-4">
              <Github className="h-6 w-6 text-gray-900" />
              <div className="relative flex-1">
                <input
                  type="url"
                  value={data.socialLinks.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  disabled={isExtracting}
                  placeholder="GitHub Profile URL"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    transition-all duration-300 text-base
                    ${isExtracting ? 'bg-gray-50' : ''}
                    ${aiFilledFields.has('socialLinks.github') ? 
                      'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                    }`}
                />
                {isExtracting && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio */}
            <div className="flex items-center space-x-4">
              <Globe className="h-6 w-6 text-green-600" />
              <div className="relative flex-1">
                <input
                  type="url"
                  value={data.socialLinks.portfolio || ''}
                  onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                  disabled={isExtracting}
                  placeholder="Portfolio Website URL"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    transition-all duration-300 text-base
                    ${isExtracting ? 'bg-gray-50' : ''}
                    ${aiFilledFields.has('socialLinks.portfolio') ? 
                      'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                    }`}
                />
                {isExtracting && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Twitter */}
            <div className="flex items-center space-x-4">
              <Twitter className="h-6 w-6 text-blue-400" />
              <div className="relative flex-1">
                <input
                  type="url"
                  value={data.socialLinks.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  disabled={isExtracting}
                  placeholder="Twitter Profile URL"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    transition-colors text-base
                    ${isExtracting ? 'bg-gray-50' : ''}
                    ${aiFilledFields.has('socialLinks.twitter') ? 
                      'animate-pulse border-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' : ''
                    }`}
                />
                {isExtracting && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && pendingChanges && (
        <ConfirmationModal
          existingData={{
            ...Object.fromEntries(
              Object.entries(data).filter(([key]) => key !== 'socialLinks')
            ),
            ...Object.fromEntries(
              Object.entries(data.socialLinks).map(([key, value]) => [`socialLinks.${key}`, value])
            )
          }}
          newData={pendingChanges}
          onConfirm={handleConfirmChanges}
          onCancel={handleCancelChanges}
        />
      )}
    </div>
  );
}
