import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Award, Briefcase, GraduationCap, Code2 } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <div className="p-8 max-w-[21cm] mx-auto bg-white">
      {/* Header */}
      <div className="relative mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-900 rounded-bl-full opacity-5" />
        <div className="relative">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight border-b-4 border-gray-900 pb-4 mb-4">
            {data.personalInfo.fullName}
          </h1>
          <p className="text-2xl text-gray-700 font-light">{data.personalInfo.title}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            {data.personalInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-3 text-gray-400" />
                {data.personalInfo.website}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <Award className="h-6 w-6 mr-3 text-gray-700" />
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
            <Briefcase className="h-6 w-6 mr-3 text-gray-700" />
            Professional Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-gray-900 before:rounded-full">
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="text-gray-800 font-semibold mb-2">{exp.company} • {exp.location}</p>
                {exp.description && (
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">›</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
            <Code2 className="h-6 w-6 mr-3 text-gray-700" />
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                <span className="text-gray-800 font-medium">{skill.name}</span>
                {skill.level && (
                  <span className="ml-2 text-sm text-gray-500">• {skill.level}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
            <GraduationCap className="h-6 w-6 mr-3 text-gray-700" />
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-gray-900 before:rounded-full">
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600 font-medium">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                <p className="text-gray-800">
                  {edu.degree} in {edu.field}
                  {edu.grade && <span className="ml-3 text-gray-600">• GPA: {edu.grade}</span>}
                </p>
                {edu.description && (
                  <p className="mt-2 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <div key={section.id} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
          <div className="space-y-6">
            {section.items.map((item) => (
              <div key={item.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-gray-900 before:rounded-full">
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  {item.date && <p className="text-gray-600 font-medium">{item.date}</p>}
                </div>
                {item.subtitle && (
                  <p className="text-gray-800 mb-2">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="text-gray-700 mb-3">{item.description}</p>
                )}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {item.bullets.map((bullet, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">›</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Social Links */}
      {Object.values(data.personalInfo.socialLinks).some(link => link) && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-8">
            {data.personalInfo.socialLinks.linkedin && (
              <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.github && (
              <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                <Github className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}