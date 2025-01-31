import { useState } from 'react';
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { Education } from '../../types/resume';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStoredResumeData } from '../../hooks/useStoredResumeData';
import AutoFillButton from './AutoFillButton';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationForm({ education, onChange }: EducationFormProps) {
  const [showForm, setShowForm] = useState(false);
  const { hasStoredData, populateSection } = useStoredResumeData();
  const [currentEducation, setCurrentEducation] = useState<Education>({
    id: '',
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAutoFill = async () => {
    const data = await populateSection('education');
    if (data) {
      onChange(data);
    }
  };

  const handleAdd = () => {
    if (editingId) {
      // Update existing education
      const updatedEducation = education.map((edu) =>
        edu.id === editingId ? { ...currentEducation } : edu
      );
      onChange(updatedEducation);
      setEditingId(null);
    } else {
      // Add new education
      const newEducation = {
        ...currentEducation,
        id: crypto.randomUUID(),
      };
      onChange([...education, newEducation]);
    }
    
    setCurrentEducation({
      id: '',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleEdit = (edu: Education) => {
    setCurrentEducation(edu);
    setEditingId(edu.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(education);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Education History</h2>
        {hasStoredData && education.length === 0 && (
          <AutoFillButton onFill={handleAutoFill} section="Education" />
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {education.map((edu, index) => (
                <Draggable key={edu.id} draggableId={edu.id} index={index}>
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
                            <h4 className="font-medium">{edu.institution}</h4>
                            <p className="text-sm text-gray-500">
                              {edu.degree} in {edu.field}
                            </p>
                            <p className="text-sm text-gray-500">
                              {edu.startDate} - {edu.endDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(edu)}
                            className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(edu.id)}
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
          Add Education
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                value={currentEducation.institution}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, institution: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter institution name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                value={currentEducation.degree}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, degree: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Bachelor's, Master's"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Field of Study</label>
              <input
                type="text"
                value={currentEducation.field}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, field: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Grade/GPA</label>
              <input
                type="text"
                value={currentEducation.grade || ''}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, grade: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                value={currentEducation.startDate}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, startDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="month"
                value={currentEducation.endDate}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, endDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                value={currentEducation.description || ''}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, description: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add any relevant details about your education..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setCurrentEducation({
                  id: '',
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  grade: '',
                  description: '',
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
              {editingId ? 'Update Education' : 'Add Education'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}