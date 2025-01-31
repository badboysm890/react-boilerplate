import { useState, memo } from 'react';
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react';
import { CustomSection, CustomSectionItem } from '../../types/resume';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStoredResumeData } from '../../hooks/useStoredResumeData';
import AutoFillButton from './AutoFillButton';

interface DraggableItemProps {
  item: CustomSectionItem;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (item: CustomSectionItem) => void;
  provided: any;
}

const DraggableItem = memo<DraggableItemProps>(({ item, onDelete, onEdit, provided }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    className="bg-gray-50 p-4 rounded-md group hover:bg-white hover:border-blue-500 hover:border transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div
        {...provided.dragHandleProps}
        className="flex items-center flex-1"
      >
        <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
        <div>
          <h4 className="font-medium">{item.title}</h4>
          {item.subtitle && (
            <p className="text-sm text-gray-500">{item.subtitle}</p>
          )}
          {item.date && (
            <p className="text-sm text-gray-500">{item.date}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
));

DraggableItem.displayName = 'DraggableItem';

interface CustomSectionFormProps {
  sections: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
}

export default function CustomSectionForm({ sections, onChange }: CustomSectionFormProps) {
  const [showForm, setShowForm] = useState(false);
  const { hasStoredData, populateSection } = useStoredResumeData();
  const [currentSection, setCurrentSection] = useState<CustomSection>({
    id: '',
    title: '',
    items: [],
  });
  const [currentItem, setCurrentItem] = useState<CustomSectionItem>({
    id: '',
    title: '',
    subtitle: '',
    date: '',
    description: '',
    bullets: [],
  });
  const [editingItem, setEditingItem] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleAutoFill = async () => {
    const data = await populateSection('custom');
    if (data) {
      onChange(data);
    }
  };

  const handleAddSection = () => {
    if (editingSectionId) {
      // Update existing section
      const updatedSections = sections.map((section) =>
        section.id === editingSectionId ? { ...currentSection } : section
      );
      onChange(updatedSections);
      setEditingSectionId(null);
    } else {
      // Add new section
      const newSection = {
        ...currentSection,
        id: crypto.randomUUID(),
      };
      onChange([...sections, newSection]);
    }
    
    setCurrentSection({
      id: '',
      title: '',
      items: [],
    });
    setShowForm(false);
  };

  const handleEditSection = (section: CustomSection) => {
    setCurrentSection(section);
    setEditingSectionId(section.id);
    setShowForm(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    onChange(sections.filter((section) => section.id !== sectionId));
  };

  const handleAddItem = (sectionId: string) => {
    if (editingItemId) {
      // Update existing item
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === editingItemId ? { ...currentItem } : item
            ),
          };
        }
        return section;
      });
      onChange(updatedSections);
      setEditingItemId(null);
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        id: crypto.randomUUID(),
      };
      
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [...section.items, newItem],
          };
        }
        return section;
      });
      
      onChange(updatedSections);
    }
    
    setCurrentItem({
      id: '',
      title: '',
      subtitle: '',
      date: '',
      description: '',
      bullets: [],
    });
    setEditingItem(false);
  };

  const handleEditItem = (sectionId: string, item: CustomSectionItem) => {
    setCurrentItem(item);
    setEditingItemId(item.id);
    setEditingItem(true);
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        };
      }
      return section;
    });
    
    onChange(updatedSections);
  };

  const handleAddBullet = () => {
    setCurrentItem({
      ...currentItem,
      bullets: [...currentItem.bullets, ''],
    });
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...currentItem.bullets];
    newBullets[index] = value;
    setCurrentItem({
      ...currentItem,
      bullets: newBullets,
    });
  };

  const handleDeleteBullet = (index: number) => {
    setCurrentItem({
      ...currentItem,
      bullets: currentItem.bullets.filter((_, i) => i !== index),
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    if (sourceDroppableId === 'sections') {
      const items = Array.from(sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      onChange(items);
    } else {
      const sectionId = sourceDroppableId.split('-')[1];
      const section = sections.find((s) => s.id === sectionId);
      
      if (section) {
        const items = Array.from(section.items);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        const updatedSections = sections.map((s) => {
          if (s.id === sectionId) {
            return { ...s, items };
          }
          return s;
        });
        
        onChange(updatedSections);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Additional Sections</h2>
        {hasStoredData && sections.length === 0 && (
          <AutoFillButton onFill={handleAutoFill} section="Projects" />
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div {...provided.dragHandleProps} className="flex items-center">
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditSection(section)}
                            className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={`items-${section.id}`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {section.items.map((item, itemIndex) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={itemIndex}
                              >
                                {(provided) => (
                                  <DraggableItem
                                    item={item}
                                    index={itemIndex}
                                    onDelete={(itemId: string) =>
                                      handleDeleteItem(section.id, itemId)
                                    }
                                    onEdit={(item: CustomSectionItem) =>
                                      handleEditItem(section.id, item)
                                    }
                                    provided={provided}
                                  />
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {!editingItem ? (
                        <button
                          onClick={() => setEditingItem(true)}
                          className="mt-4 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </button>
                      ) : (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                value={currentItem.title}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    title: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Subtitle
                              </label>
                              <input
                                type="text"
                                value={currentItem.subtitle || ''}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    subtitle: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Date
                              </label>
                              <input
                                type="text"
                                value={currentItem.date || ''}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    date: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., 2023 or Jan 2023 - Present"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                value={currentItem.description || ''}
                                onChange={(e) =>
                                  setCurrentItem({
                                    ...currentItem,
                                    description: e.target.value,
                                  })
                                }
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Bullet Points
                              </label>
                              <div className="mt-2 space-y-2">
                                {currentItem.bullets.map((bullet, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={bullet}
                                      onChange={(e) =>
                                        handleBulletChange(index, e.target.value)
                                      }
                                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                      onClick={() => handleDeleteBullet(index)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleAddBullet}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Bullet
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(false);
                                setEditingItemId(null);
                                setCurrentItem({
                                  id: '',
                                  title: '',
                                  subtitle: '',
                                  date: '',
                                  description: '',
                                  bullets: [],
                                });
                              }}
                              className="px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddItem(section.id)}
                              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                              {editingItemId ? 'Update Item' : 'Add Item'}
                            </button>
                          </div>
                        </div>
                      )}
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
          Add Custom Section
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700">Section Title</label>
            <input
              type="text"
              value={currentSection.title}
              onChange={(e) =>
                setCurrentSection({ ...currentSection, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Volunteer Work, Publications"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingSectionId(null);
                setCurrentSection({
                  id: '',
                  title: '',
                  items: [],
                });
              }}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              {editingSectionId ? 'Update Section' : 'Add Section'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}