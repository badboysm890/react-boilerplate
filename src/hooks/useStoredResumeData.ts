import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Education, Experience, Skill, CustomSection } from '../types/resume';

export function useStoredResumeData() {
  const [storedData, setStoredData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('extracted_resume_data');
    if (data) {
      try {
        setStoredData(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing stored resume data:', error);
      }
    }
  }, []);

  const populateEducation = (): Education[] => {
    if (!storedData?.education) return [];

    return storedData.education.map((edu: any) => ({
      id: crypto.randomUUID(),
      institution: edu.institution_name || '',
      degree: edu.degree || '',
      field: edu.field_of_study || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      grade: edu.grade_gpa || '',
      description: edu.description || '',
    }));
  };

  const populateExperience = (): Experience[] => {
    if (!storedData?.experience) return [];

    return storedData.experience.map((exp: any) => ({
      id: crypto.randomUUID(),
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location === 'null' ? '' : exp.location || '',
      startDate: exp.start_date === 'null' ? '' : exp.start_date || '',
      endDate: exp.end_date === 'null' ? '' : exp.end_date || '',
      current: false,
      description: exp.description === 'null' ? '' : exp.description || '',
      achievements: exp.key_achievements?.filter((achievement: string) => achievement !== 'null') || [],
    }));
  };

  const populateSkills = (): Skill[] => {
    if (!storedData?.skills) return [];

    return storedData.skills.map((skill: string) => ({
      id: crypto.randomUUID(),
      name: skill,
      level: 'Intermediate',
      category: '',
    }));
  };

  const populateProjects = (): CustomSection[] => {
    if (!storedData?.github_projects) return [];

    const projects: CustomSection = {
      id: crypto.randomUUID(),
      title: 'Projects',
      items: storedData.github_projects.map((project: any) => ({
        id: crypto.randomUUID(),
        title: project.title || '',
        subtitle: project.subtitle || '',
        date: project.date || '',
        description: project.description === 'null' ? '' : project.description || '',
        bullets: [],
      })),
    };

    return [projects];
  };

  const populateSection = async (section: 'education' | 'experience' | 'skills' | 'custom') => {
    setIsLoading(true);
    try {
      let data;
      switch (section) {
        case 'education':
          data = populateEducation();
          break;
        case 'experience':
          data = populateExperience();
          break;
        case 'skills':
          data = populateSkills();
          break;
        case 'custom':
          data = populateProjects();
          break;
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error(`Error populating ${section}:`, error);
      toast.error(`Failed to populate ${section}`);
      setIsLoading(false);
      return null;
    }
  };

  return {
    hasStoredData: !!storedData,
    isLoading,
    populateSection,
  };
}