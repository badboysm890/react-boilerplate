import { ResumeData } from '../../types/resume';

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900">
            {data.personalInfo.fullName}
          </h1>
          <p className="text-xl text-gray-600 mt-2">{data.personalInfo.title}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-base text-gray-700">
            {data.personalInfo.email && (
              <p>
                <span className="font-medium">Email:</span> {data.personalInfo.email}
              </p>
            )}
            {(data.personalInfo.phone || data.personalInfo.socialLinks.linkedin) && (
              <p>
                {data.personalInfo.phone && (
                  <>
                    <span className="font-medium">Phone:</span> {data.personalInfo.phone}
                  </>
                )}
                {data.personalInfo.phone && data.personalInfo.socialLinks.linkedin && (
                  <span className="mx-2">|</span>
                )}
                {data.personalInfo.socialLinks.linkedin && (
                  <>
                    <span className="font-medium">LinkedIn:</span> {data.personalInfo.socialLinks.linkedin}
                  </>
                )}
              </p>
            )}
            {data.personalInfo.location && (
              <p>
                <span className="font-medium">Location:</span> {data.personalInfo.location}
              </p>
            )}
            {data.personalInfo.website && (
              <p>
                <span className="font-medium">Website:</span> {data.personalInfo.website}
              </p>
            )}
            {data.personalInfo.socialLinks.github && (
              <p>
                <span className="font-medium">GitHub:</span> {data.personalInfo.socialLinks.github}
              </p>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <p>
                <span className="font-medium">Twitter:</span> {data.personalInfo.socialLinks.twitter}
              </p>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-10">
          {/* PROFESSIONAL SUMMARY */}
          {data.personalInfo.summary && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-1">
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">
                      {exp.company} &bull; {exp.location}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TECHNICAL SKILLS */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-1">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.skills.map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {skill.name}
                    {skill.level && <span className="ml-1">&bull; {skill.level}</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-1">
                Education
              </h2>
              <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {edu.institution}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">
                      {edu.degree} in {edu.field}
                      {edu.grade && (
                        <span className="ml-1">&bull; GPA: {edu.grade}</span>
                      )}
                    </p>
                    {edu.description && (
                      <p className="mt-2 text-gray-700">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM SECTIONS */}
          {data.customSections.map(section => (
            <section key={section.id}>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 border-b pb-1">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.items.map(item => (
                  <div key={item.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      {item.date && (
                        <span className="text-sm text-gray-500">{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="mt-1 text-gray-600">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-gray-700">{item.description}</p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                        {item.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
