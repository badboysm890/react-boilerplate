import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { Skill } from '../../types/resume';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStoredResumeData } from '../../hooks/useStoredResumeData';
import AutoFillButton from './AutoFillButton';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

/**
 * A modal to let the user choose which autofilled skills to apply.
 */
function AutoFillModal({
  autofilledSkills,
  onApply,
  onCancel,
}: {
  autofilledSkills: Skill[];
  onApply: (selectedSkills: Skill[]) => void;
  onCancel: () => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Initially select all autofilled skills
    setSelectedIds(autofilledSkills.map((skill) => skill.id));
  }, [autofilledSkills]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    const selectedSkills = autofilledSkills.filter((skill) =>
      selectedIds.includes(skill.id)
    );
    onApply(selectedSkills);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Autofill Skills</h2>
        <p className="mb-4 text-gray-600">
          Please select which skills you would like to add from the autofill data.
        </p>
        <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
          {autofilledSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-gray-500">
                  {skill.category && `${skill.category} • `}
                  {skill.level}
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(skill.id)}
                  onChange={() => toggleSelection(skill.id)}
                  className="h-4 w-4"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [showForm, setShowForm] = useState(false);
  const { hasStoredData, populateSection } = useStoredResumeData();
  const [currentSkill, setCurrentSkill] = useState<Skill>({
    id: '',
    name: '',
    level: 'Intermediate',
    category: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for handling the autofill modal
  const [showAutofillModal, setShowAutofillModal] = useState(false);
  const [autofilledSkills, setAutofilledSkills] = useState<Skill[]>([]);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleAutoFill = async () => {
    const data = await populateSection('skills');
    if (data && data.length > 0) {
      // Instead of directly filling, open a modal to choose which skills to apply
      setAutofilledSkills(data);
      setShowAutofillModal(true);
    }
  };

  const handleAdd = () => {
    if (editingId) {
      // Update an existing skill
      const updatedSkills = skills.map((skill) =>
        skill.id === editingId ? { ...currentSkill } : skill
      );
      onChange(updatedSkills);
      setEditingId(null);
    } else {
      // Add a new skill
      const newSkill = {
        ...currentSkill,
        id: crypto.randomUUID(),
      };
      onChange([...skills, newSkill]);
    }

    setCurrentSkill({
      id: '',
      name: '',
      level: 'Intermediate',
      category: '',
    });
    setShowForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const handleAutofillApply = (selectedSkills: Skill[]) => {
    // Merge the selected autofilled skills with current skills.
    // If a skill with the same name (case-insensitive) exists, update it; otherwise, add it.
    const mergedSkills = [...skills];
    selectedSkills.forEach((autoSkill) => {
      const existingIndex = mergedSkills.findIndex(
        (skill) =>
          skill.name.trim().toLowerCase() === autoSkill.name.trim().toLowerCase()
      );
      if (existingIndex !== -1) {
        // Update the existing skill with autofilled data
        mergedSkills[existingIndex] = autoSkill;
      } else {
        mergedSkills.push({ ...autoSkill, id: crypto.randomUUID() });
      }
    });
    onChange(mergedSkills);
    setShowAutofillModal(false);
  };

  const handleAutofillCancel = () => {
    setShowAutofillModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Technical Skills
        </h2>
        {hasStoredData && skills.length === 0 && (
          <AutoFillButton onFill={handleAutoFill} section="Skills" />
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {skills.map((skill, index) => (
                <Draggable key={skill.id} draggableId={skill.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center flex-1"
                        >
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-gray-500">
                              {skill.category && `${skill.category} • `}
                              {skill.level}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
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
          Add Skill
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill Name
              </label>
              <input
                type="text"
                value={currentSkill.name}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., JavaScript, Project Management"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category (Optional)
              </label>
              <input
                type="text"
                value={currentSkill.category || ''}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Programming, Soft Skills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proficiency Level
              </label>
              <select
                value={currentSkill.level}
                onChange={(e) =>
                  setCurrentSkill({
                    ...currentSkill,
                    level: e.target.value as Skill['level'],
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setCurrentSkill({
                  id: '',
                  name: '',
                  level: 'Intermediate',
                  category: '',
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
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </div>
      )}

      {showAutofillModal && (
        <AutoFillModal
          autofilledSkills={autofilledSkills}
          onApply={handleAutofillApply}
          onCancel={handleAutofillCancel}
        />
      )}
    </div>
  );
}
