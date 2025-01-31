import { useState } from 'react';
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { Experience } from '../../types/resume';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStoredResumeData } from '../../hooks/useStoredResumeData';
import AutoFillButton from './AutoFillButton';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export default function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const [showForm, setShowForm] = useState(false);
  const { hasStoredData, populateSection } = useStoredResumeData();
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAutoFill = async () => {
    const data = await populateSection('experience');
    if (data) {
      onChange(data);
    }
  };

  const handleAdd = () => {
    if (editingId) {
      // Update existing experience
      const updatedExperiences = experiences.map((exp) =>
        exp.id === editingId ? { ...currentExperience } : exp
      );
      onChange(updatedExperiences);
      setEditingId(null);
    } else {
      // Add new experience
      const newExperience = {
        ...currentExperience,
        id: crypto.randomUUID(),
      };
      onChange([...experiences, newExperience]);
    }
    
    setCurrentExperience({
      id: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setShowForm(false);
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setEditingId(experience.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const handleAchievementAdd = () => {
    setCurrentExperience({
      ...currentExperience,
      achievements: [...currentExperience.achievements, ''],
    });
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...currentExperience.achievements];
    newAchievements[index] = value;
    setCurrentExperience({
      ...currentExperience,
      achievements: newAchievements,
    });
  };

  const handleAchievementDelete = (index: number) => {
    setCurrentExperience({
      ...currentExperience,
      achievements: currentExperience.achievements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Professional Experience</h2>
        {hasStoredData && experiences.length === 0 && (
          <AutoFillButton onFill={handleAutoFill} section="Experience" />
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experiences">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {experiences.map((exp, index) => (
                <Draggable key={exp.id} draggableId={exp.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div {...provided.dragHandleProps} className="flex items-center flex-1">
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <h4 className="font-medium">{exp.position}</h4>
                            <p className="text-sm text-gray-500">
                              {exp.company} • {exp.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Experience
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={currentExperience.company}
                onChange={(e) =>
                  setCurrentExperience({ ...currentExperience, company: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={currentExperience.position}
                onChange={(e) =>
                  setCurrentExperience({ ...currentExperience, position: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={currentExperience.location}
                onChange={(e) =>
                  setCurrentExperience({ ...currentExperience, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                value={currentExperience.startDate}
                onChange={(e) =>
                  setCurrentExperience({ ...currentExperience, startDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentExperience.current}
                  onChange={(e) =>
                    setCurrentExperience({ ...currentExperience, current: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">I currently work here</label>
              </div>
            </div>

            {!currentExperience.current && (
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="month"
                  value={currentExperience.endDate}
                  onChange={(e) =>
                    setCurrentExperience({ ...currentExperience, endDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={currentExperience.description}
                onChange={(e) =>
                  setCurrentExperience({ ...currentExperience, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
              <div className="mt-2 space-y-2">
                {currentExperience.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Describe a key achievement..."
                    />
                    <button
                      onClick={() => handleAchievementDelete(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAchievementAdd}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setCurrentExperience({
                  id: '',
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: '',
                  achievements: [],
                });
              }}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}