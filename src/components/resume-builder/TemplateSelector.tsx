import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import ModernTemplate from '../resume-templates/ModernTemplate';
import ExecutiveTemplate from '../resume-templates/ExecutiveTemplate';
import CreativeTemplate from '../resume-templates/CreativeTemplate';
import MinimalTemplate from '../resume-templates/MinimalTemplate';
import NeoTemplate from '../resume-templates/NeoTemplate';
import { ResumeData } from '../../types/resume';

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
  data: ResumeData;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on readability',
    features: [
      'Minimalist header with blue accents',
      'Timeline-style experience sections',
      'Tag-based skills display',
    ],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional layout ideal for senior positions',
    features: [
      'Bold typography with thick borders',
      'Section icons for visual hierarchy',
      'Grid-based competency display',
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique and artistic design',
    features: [
      'Gradient accents and decorative elements',
      'Timeline with visual markers',
      'Modern card-based layout',
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design that puts content first',
    features: [
      'Lightweight typography',
      'Subtle dividers and spacing',
      'Perfect for ATS systems',
    ],
  },
  {
    id: 'neo',
    name: 'Neo GenZ',
    description: 'Bold and trendy design for the digital age',
    features: [
      'Gradient effects and neon accents',
      'Modern skill visualization',
      'Eye-catching typography',
    ],
  },
];

export default function TemplateSelector({
  currentTemplate,
  onTemplateChange,
  data,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const getTemplateComponent = (templateId: string) => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'neo':
        return <NeoTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
            onClick={() => setIsOpen(true)}
            className="
              fixed 
              bottom-[110px] 
              right-6
              z-50
              p-3.5
              bg-white 
              rounded-full 
              drop-shadow-lg drop-shadow-purple-500
              transition-all 
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-purple-500
              hover:scale-105
              hover:drop-shadow-xl hover:drop-shadow-purple-600
            "
            title="Change Template"
            aria-label="Change Template"
          >
        <Palette className="
          relative
          h-6 
          w-6 
          text-gray-600
          group-hover:text-blue-600
          transition-colors
          duration-300
          animate-bounce-subtle
        " />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-[64px] bottom-[56px] w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close Template Selector"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Templates List */}
          <div className="p-6 space-y-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  currentTemplate === template.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onMouseEnter={() => setPreviewTemplate(template.id)}
                onMouseLeave={() => setPreviewTemplate(null)}
                onClick={() => {
                  onTemplateChange(template.id);
                  setIsOpen(false);
                }}
              >
                {/* Preview Container */}
                <div className="relative bg-gray-50 h-64 sm:h-80 md:h-64 lg:h-80">
                  <div className="absolute inset-0 transform scale-[0.55] origin-top-center overflow-hidden">
                    <div className="transform scale-[0.95] origin-top">
                      {getTemplateComponent(previewTemplate || template.id)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
                </div>

                {/* Template Info */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                    {currentTemplate === template.id && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <ul className="space-y-2">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-500 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-[55]" // Changed from z-30 to z-[55]
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}