import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Star } from 'lucide-react';

interface NeoTemplateProps {
  data: ResumeData;
}

export default function NeoTemplate({ data }: NeoTemplateProps) {
  return (
    <div className="p-8 max-w-[21cm] mx-auto bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50">
      {/* Header with neon effect */}
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-10 blur-3xl transform -skew-y-12"></div>
        <div className="relative">
          <h1 className="text-6xl font-black bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            {data.personalInfo.fullName}
          </h1>
          <p className="mt-2 text-2xl font-light text-gray-600 tracking-wide">
            {data.personalInfo.title}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            {data.personalInfo.email && (
              <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-50 to-cyan-50 border border-gray-200">
                <Mail className="h-4 w-4 text-fuchsia-500 mr-2" />
                <span className="text-gray-700">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-50 to-cyan-50 border border-gray-200">
                <Phone className="h-4 w-4 text-cyan-500 mr-2" />
                <span className="text-gray-700">{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-50 to-cyan-50 border border-gray-200">
                <MapPin className="h-4 w-4 text-fuchsia-500 mr-2" />
                <span className="text-gray-700">{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-12 relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 to-cyan-500 rounded-full"></div>
          <p className="text-gray-700 leading-relaxed text-lg pl-4">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-fuchsia-500 before:to-cyan-500 before:rounded-full">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 font-medium mb-2">{exp.company} • {exp.location}</p>
                {exp.description && (
                  <p className="text-gray-600 mb-3">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <Star className="h-4 w-4 text-cyan-500 mr-2 mt-1 flex-shrink-0" />
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
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-50 to-cyan-50 border border-gray-200"
              >
                <div className="font-medium text-gray-900">{skill.name}</div>
                {skill.level && (
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                      style={{
                        width: skill.level === 'Beginner' ? '25%' :
                               skill.level === 'Intermediate' ? '50%' :
                               skill.level === 'Advanced' ? '75%' : '100%'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-fuchsia-500 before:to-cyan-500 before:rounded-full">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{edu.institution}</h3>
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

      {/* Social Links */}
      {Object.values(data.personalInfo.socialLinks).some(link => link) && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-6">
            {data.personalInfo.socialLinks.linkedin && (
              <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fuchsia-500 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.github && (
              <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-500 transition-colors">
                <Github className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fuchsia-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}