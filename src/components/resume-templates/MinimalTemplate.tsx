import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Star } from 'lucide-react';

interface MinimalTemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div className="p-8 max-w-[21cm] mx-auto bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-lg text-gray-600 font-light">{data.personalInfo.title}</p>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {data.personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {data.personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 mb-2">{exp.company} • {exp.location}</p>
                {exp.description && (
                  <p className="text-gray-600 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
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
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {skill.name}
                {skill.level && <span className="ml-1 text-gray-500">• {skill.level}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{edu.institution}</h3>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                <p className="text-gray-700">
                  {edu.degree} in {edu.field}
                  {edu.grade && <span className="text-gray-500 ml-2">• GPA: {edu.grade}</span>}
                </p>
                {edu.description && (
                  <p className="mt-1 text-gray-600">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  {item.date && <p className="text-sm text-gray-500">{item.date}</p>}
                </div>
                {item.subtitle && (
                  <p className="text-gray-700">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="mt-1 text-gray-600">{item.description}</p>
                )}
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.bullets.map((bullet, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
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
              <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo.socialLinks.github && (
              <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Github className="h-5 w-5" />
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}