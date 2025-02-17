/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  socialLinks: SocialLinks;
  website?: string;
}

export interface ResumeData {
  id?: string;
  title: string;
  template: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  customSections: CustomSection[];
  settings: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
    primaryColor: string;
    showDates: boolean;
    showSectionTitles: boolean;
    compactLayout: boolean;
  };
}

export interface Resume {
  id: string;
  title: string;
  created_at: string | number | Date;
  is_public: boolean;
  template: string;
  content: any;
}

export interface UploadedResume {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  file: File;
  previewUrl?: string;
  conversionProgress: number;
  status: 'pending' | 'converting' | 'completed' | 'error';
  _forceUpdate?: number;
}