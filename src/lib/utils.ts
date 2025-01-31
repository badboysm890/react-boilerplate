import React from 'react';
import { ResumeData } from '../types/resume';
import ModernTemplate from '../components/resume-templates/ModernTemplate';
import ExecutiveTemplate from '../components/resume-templates/ExecutiveTemplate';
import CreativeTemplate from '../components/resume-templates/CreativeTemplate';
import MinimalTemplate from '../components/resume-templates/MinimalTemplate';
import NeoTemplate from '../components/resume-templates/NeoTemplate';

export function getResumeTemplate(template: string, data: ResumeData): React.ReactElement {
  switch (template) {
    case 'modern':
      return React.createElement(ModernTemplate, { data });
    case 'creative':
      return React.createElement(CreativeTemplate, { data });
    case 'executive':
      return React.createElement(ExecutiveTemplate, { data });
    case 'minimal':
      return React.createElement(MinimalTemplate, { data });
    case 'neo':
      return React.createElement(NeoTemplate, { data });
    default:
      return React.createElement(ModernTemplate, { data });
  }
}