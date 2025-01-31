import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="p-8 max-w-[21cm] mx-auto bg-gradient-to-br from-blue-50 to-white">
      {/* Header with modern gradient accent */}
      <div className="relative mb-8 pb-8">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-br-3xl opacity-10" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
          <p className="text-xl text-blue-600 mt-2 font-medium">{data.personalInfo.title}</p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {data.personalInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-600" />
                {data.personalInfo.website}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Professional Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 font-medium">{exp.company} • {exp.location}</p>
                {exp.description && (
                  <p className="mt-2 text-gray-600">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">›</span>
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
              >
                {skill.name}
                {skill.level && <span className="ml-1 opacity-75">• {skill.level}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-900">{edu.institution}</h3>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                <p className="text-gray-700">
                  {edu.degree} in {edu.field}
                  {edu.grade && <span className="ml-2 text-gray-500">• GPA: {edu.grade}</span>}
                </p>
                {edu.description && (
                  <p className="mt-2 text-gray-600">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-600 before:rounded-full">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  {item.date && <p className="text-sm text-gray-500">{item.date}</p>}
                </div>
                {item.subtitle && (
                  <p className="text-gray-700">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="mt-2 text-gray-600">{item.description}</p>
                )}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {item.bullets.map((bullet, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">›</span>
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
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-center space-x-6">
            {data.personalInfo.socialLinks.linkedin && (
              <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo.socialLinks.github && (
              <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}