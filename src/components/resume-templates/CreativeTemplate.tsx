import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Star } from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="p-8 max-w-[21cm] mx-auto bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header with creative design */}
      <div className="relative mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-24 translate-x-24" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-16 -translate-x-16" />
        
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            {data.personalInfo.fullName}
          </h1>
          <p className="text-2xl mt-3 text-gray-600 font-light italic">
            {data.personalInfo.title}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                <Mail className="h-4 w-4 mr-2" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-700">
                <Phone className="h-4 w-4 mr-2" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                <MapPin className="h-4 w-4 mr-2" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-700">
                <Globe className="h-4 w-4 mr-2" />
                {data.personalInfo.website}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-9 top-2 w-3 h-3 bg-white border-2 border-purple-400 rounded-full" />
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                      <p className="text-purple-600 font-medium">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <p className="text-lg text-pink-600 mb-2">{exp.company} • {exp.location}</p>
                    {exp.description && (
                      <p className="text-gray-600 mb-3">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-600 flex items-start">
                            <Star className="h-4 w-4 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                >
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  {skill.level && (
                    <span className="ml-2 text-sm text-purple-600">• {skill.level}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative">
                  <div className="absolute -left-9 top-2 w-3 h-3 bg-white border-2 border-purple-400 rounded-full" />
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-gray-800">{edu.institution}</h3>
                      <p className="text-purple-600 font-medium">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                    <p className="text-lg text-pink-600">
                      {edu.degree} in {edu.field}
                      {edu.grade && <span className="text-gray-600 ml-2">• GPA: {edu.grade}</span>}
                    </p>
                    {edu.description && (
                      <p className="mt-2 text-gray-600">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <div key={section.id} className="mb-12 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-9 top-2 w-3 h-3 bg-white border-2 border-purple-400 rounded-full" />
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                      {item.date && <p className="text-purple-600 font-medium">{item.date}</p>}
                    </div>
                    {item.subtitle && (
                      <p className="text-lg text-pink-600">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-gray-600">{item.description}</p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {item.bullets.map((bullet, index) => (
                          <li key={index} className="text-gray-600 flex items-start">
                            <Star className="h-4 w-4 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Social Links */}
      {Object.values(data.personalInfo.socialLinks).some(link => link) && (
        <div className="mt-12 pt-6 border-t border-purple-100">
          <div className="flex justify-center space-x-6">
            {data.personalInfo.socialLinks.linkedin && (
              <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-600">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.github && (
              <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-600">
                <Github className="h-6 w-6" />
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-600">
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
