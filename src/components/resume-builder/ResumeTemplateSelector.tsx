import { useState } from 'react';
import { Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  features: string[];
}

interface ResumeTemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    thumbnail: 'https://source.unsplash.com/400x600?resume&1',
    description: 'Clean and professional design with a modern touch',
    features: [
      'Minimalist header with social links',
      'Skills displayed as tags',
      'Timeline-style experience section',
    ],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    thumbnail: 'https://source.unsplash.com/400x600?resume&2',
    description: 'Sophisticated design for senior professionals',
    features: [
      'Bold header with professional title',
      'Achievements-focused layout',
      'Elegant typography',
    ],
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    thumbnail: 'https://source.unsplash.com/400x600?resume&3',
    description: 'Stand out with a unique, creative design',
    features: [
      'Custom color accents',
      'Portfolio gallery section',
      'Innovative layout structure',
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal Impact',
    thumbnail: 'https://source.unsplash.com/400x600?resume&4',
    description: 'Clean, focused design that lets your content shine',
    features: [
      'Maximized content space',
      'Perfect for ATS systems',
      'Easy to scan sections',
    ],
  },
  {
    id: 'tech',
    name: 'Tech Innovator',
    thumbnail: 'https://source.unsplash.com/400x600?resume&5',
    description: 'Perfect for tech professionals and developers',
    features: [
      'Skills matrix visualization',
      'GitHub contribution graph',
      'Code snippet styling',
    ],
  },
  {
    id: 'academic',
    name: 'Academic Excellence',
    thumbnail: 'https://source.unsplash.com/400x600?resume&6',
    description: 'Ideal for academic and research positions',
    features: [
      'Publications section',
      'Research highlights',
      'Teaching experience layout',
    ],
  },
];

export default function ResumeTemplateSelector({
  // If retained, ensure props are set to not display
  selectedTemplate,
  onSelect,
  showTemplates,
  setShowTemplates,
}: ResumeTemplateSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Remove the toggle button as it's controlled from sidebar */}
      
      {/* Template Grid */}
      {showTemplates && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 group ${
                selectedTemplate === template.id
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Thumbnail Image */}
              <div className="w-full h-40 sm:h-48 lg:h-56 overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>

              {/* Template Details */}
              <div className="p-3 sm:p-4">
                <h3 className="text-md sm:text-lg font-medium text-gray-900 flex items-center justify-between">
                  {template.name}
                  {selectedTemplate === template.id && (
                    <span className="bg-blue-500 rounded-full p-1 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  {template.description}
                </p>
                <ul className="mt-2 space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
