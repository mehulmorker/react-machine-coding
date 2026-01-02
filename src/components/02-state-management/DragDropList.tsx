import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Archive, 
  CheckCircle, 
  Circle, 
  Star,
  Clock,
  User,
  Tag,
  RotateCcw,
  Save,
  Settings
} from 'lucide-react';

// Types
interface DragItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done' | 'archived';
  assignee: string;
  tags: string[];
  createdAt: Date;
  dueDate?: Date;
  completed: boolean;
}

interface DragList {
  id: string;
  title: string;
  items: DragItem[];
  color: string;
  maxItems?: number;
}

interface DragDropState {
  lists: DragList[];
  draggedItem: DragItem | null;
  draggedFromList: string | null;
  settings: {
    showDueDates: boolean;
    showAssignees: boolean;
    showTags: boolean;
    autoSave: boolean;
  };
}

// Sample Data
const SAMPLE_ITEMS: DragItem[] = [
  {
    id: '1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design',
    priority: 'high',
    status: 'todo',
    assignee: 'Alice Johnson',
    tags: ['design', 'ui/ux', 'frontend'],
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-01-25'),
    completed: false
  },
  {
    id: '2',
    title: 'Setup Database Schema',
    description: 'Configure PostgreSQL database with proper indexes and relationships',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Bob Smith',
    tags: ['backend', 'database', 'postgresql'],
    createdAt: new Date('2024-01-14'),
    dueDate: new Date('2024-01-22'),
    completed: false
  },
  {
    id: '3',
    title: 'Write API Documentation',
    description: 'Document all REST endpoints with examples and response schemas',
    priority: 'medium',
    status: 'todo',
    assignee: 'Charlie Brown',
    tags: ['documentation', 'api', 'backend'],
    createdAt: new Date('2024-01-13'),
    dueDate: new Date('2024-01-30'),
    completed: false
  },
  {
    id: '4',
    title: 'Implement User Authentication',
    description: 'Add JWT-based authentication with password reset functionality',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Diana Prince',
    tags: ['backend', 'security', 'auth'],
    createdAt: new Date('2024-01-12'),
    dueDate: new Date('2024-01-28'),
    completed: false
  },
  {
    id: '5',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    priority: 'medium',
    status: 'done',
    assignee: 'Eve Wilson',
    tags: ['devops', 'ci/cd', 'automation'],
    createdAt: new Date('2024-01-10'),
    dueDate: new Date('2024-01-20'),
    completed: true
  },
  {
    id: '6',
    title: 'Mobile Responsive Testing',
    description: 'Test application across different mobile devices and screen sizes',
    priority: 'low',
    status: 'todo',
    assignee: 'Frank Miller',
    tags: ['testing', 'mobile', 'responsive'],
    createdAt: new Date('2024-01-11'),
    completed: false
  }
];

const INITIAL_LISTS: DragList[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: SAMPLE_ITEMS.filter(item => item.status === 'todo'),
    color: 'bg-blue-500'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: SAMPLE_ITEMS.filter(item => item.status === 'in-progress'),
    color: 'bg-yellow-500',
    maxItems: 3
  },
  {
    id: 'done',
    title: 'Done',
    items: SAMPLE_ITEMS.filter(item => item.status === 'done'),
    color: 'bg-green-500'
  },
  {
    id: 'archived',
    title: 'Archived',
    items: SAMPLE_ITEMS.filter(item => item.status === 'archived'),
    color: 'bg-gray-500'
  }
];

// Drag Item Component
const DragItemCard: React.FC<{
  item: DragItem;
  onEdit: (item: DragItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: DragItem) => void;
  onToggleComplete: (id: string) => void;
  settings: DragDropState['settings'];
  isDragging: boolean;
}> = ({ item, onEdit, onDelete, onDuplicate, onToggleComplete, settings, isDragging }) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const isOverdue = item.dueDate && new Date() > item.dueDate && !item.completed;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={`
        bg-white rounded-lg shadow-sm border-l-4 p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200
        ${getPriorityColor(item.priority)}
        ${isDragging ? 'opacity-50 transform rotate-2' : ''}
        ${item.completed ? 'opacity-75' : ''}
        ${isOverdue ? 'ring-2 ring-red-300' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => onToggleComplete(item.id)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            {item.completed ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
          <h3 className={`font-semibold text-gray-900 ${item.completed ? 'line-through' : ''}`}>
            {item.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDuplicate(item)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className={`text-sm text-gray-600 mb-3 ${item.completed ? 'line-through' : ''}`}>
          {item.description}
        </p>
      )}

      {/* Tags */}
      {settings.showTags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {settings.showAssignees && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{item.assignee}</span>
            </div>
          )}
          
          {settings.showDueDates && item.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
              <Clock className="h-3 w-3" />
              <span>{item.dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Star className={`h-3 w-3 ${item.priority === 'high' ? 'text-red-500' : 'text-gray-400'}`} />
          <span className="capitalize">{item.priority}</span>
        </div>
      </div>
    </div>
  );
};

// Add Item Form Component
const AddItemForm: React.FC<{
  listId: string;
  onAdd: (listId: string, item: Omit<DragItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ listId, onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignee, setAssignee] = useState('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: Omit<DragItem, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status: listId as DragItem['status'],
      assignee: assignee.trim() || 'Unassigned',
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false
    };

    onAdd(listId, newItem);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 mb-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          autoFocus
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Drag List Component
const DragListColumn: React.FC<{
  list: DragList;
  onItemEdit: (item: DragItem) => void;
  onItemDelete: (listId: string, itemId: string) => void;
  onItemDuplicate: (listId: string, item: DragItem) => void;
  onItemToggleComplete: (listId: string, itemId: string) => void;
  onItemAdd: (listId: string, item: Omit<DragItem, 'id' | 'createdAt'>) => void;
  onDrop: (listId: string, itemId: string) => void;
  settings: DragDropState['settings'];
  draggedItem: DragItem | null;
}> = ({ 
  list, 
  onItemEdit, 
  onItemDelete, 
  onItemDuplicate, 
  onItemToggleComplete, 
  onItemAdd, 
  onDrop, 
  settings,
  draggedItem 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    onDrop(list.id, itemId);
    setDragOver(false);
  };

  const canAcceptMoreItems = !list.maxItems || list.items.length < list.maxItems;

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-96">
      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${list.color}`} />
          <h2 className="text-lg font-semibold text-gray-900">{list.title}</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {list.items.length}
            {list.maxItems && `/${list.maxItems}`}
          </span>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!canAcceptMoreItems}
          className={`p-2 rounded-lg transition-colors ${
            canAcceptMoreItems 
              ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title={canAcceptMoreItems ? 'Add new item' : 'Maximum items reached'}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <AddItemForm
          listId={list.id}
          onAdd={(listId, item) => {
            onItemAdd(listId, item);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-32 rounded-lg border-2 border-dashed transition-all duration-200 ${
          dragOver && canAcceptMoreItems
            ? 'border-blue-500 bg-blue-50'
            : dragOver && !canAcceptMoreItems
            ? 'border-red-500 bg-red-50'
            : 'border-transparent'
        }`}
      >
        {/* Items */}
        {list.items.map((item) => (
          <DragItemCard
            key={item.id}
            item={item}
            onEdit={onItemEdit}
            onDelete={(id) => onItemDelete(list.id, id)}
            onDuplicate={(item) => onItemDuplicate(list.id, item)}
            onToggleComplete={(id) => onItemToggleComplete(list.id, id)}
            settings={settings}
            isDragging={draggedItem?.id === item.id}
          />
        ))}

        {/* Empty State */}
        {list.items.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Archive className="h-8 w-8 mx-auto mb-2" />
            <p>No items yet</p>
            <p className="text-sm">Drag items here or click + to add</p>
          </div>
        )}

        {/* Max Items Warning */}
        {!canAcceptMoreItems && (
          <div className="text-center text-orange-600 py-4 bg-orange-50 rounded-lg mt-2">
            <p className="text-sm">Maximum items reached ({list.maxItems})</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Drag & Drop Component
const DragDropList: React.FC = () => {
  const [state, setState] = useState<DragDropState>({
    lists: INITIAL_LISTS,
    draggedItem: null,
    draggedFromList: null,
    settings: {
      showDueDates: true,
      showAssignees: true,
      showTags: true,
      autoSave: true
    }
  });

  const [editingItem, setEditingItem] = useState<DragItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('drag-drop-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const lists = parsed.lists.map((list: any) => ({
          ...list,
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }))
        }));
        setState(prev => ({ ...prev, lists, settings: parsed.settings || prev.settings }));
      } catch (error) {
        console.error('Error loading state:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (state.settings.autoSave) {
      localStorage.setItem('drag-drop-state', JSON.stringify({
        lists: state.lists,
        settings: state.settings
      }));
    }
  }, [state.lists, state.settings]);

  const handleDrop = useCallback((targetListId: string, itemId: string) => {
    setState(prev => {
      const newLists = prev.lists.map(list => ({
        ...list,
        items: list.items.filter(item => item.id !== itemId)
      }));

      const draggedItem = prev.lists
        .flatMap(list => list.items)
        .find(item => item.id === itemId);

      if (!draggedItem) return prev;

      const targetList = newLists.find(list => list.id === targetListId);
      if (!targetList) return prev;

      // Check max items constraint
      if (targetList.maxItems && targetList.items.length >= targetList.maxItems) {
        return prev; // Don't allow drop if max items reached
      }

      // Update item status based on target list
      const updatedItem = {
        ...draggedItem,
        status: targetListId as DragItem['status']
      };

      targetList.items.push(updatedItem);

      return { ...prev, lists: newLists };
    });
  }, []);

  const handleItemAdd = useCallback((listId: string, itemData: Omit<DragItem, 'id' | 'createdAt'>) => {
    const newItem: DragItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, items: [...list.items, newItem] }
          : list
      )
    }));
  }, []);

  const handleItemDelete = useCallback((listId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      )
    }));
  }, []);

  const handleItemDuplicate = useCallback((listId: string, item: DragItem) => {
    const duplicatedItem: DragItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${item.title} (Copy)`,
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, items: [...list.items, duplicatedItem] }
          : list
      )
    }));
  }, []);

  const handleItemToggleComplete = useCallback((listId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              )
            }
          : list
      )
    }));
  }, []);

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      lists: INITIAL_LISTS
    }));
  };

  const handleSave = () => {
    localStorage.setItem('drag-drop-state', JSON.stringify({
      lists: state.lists,
      settings: state.settings
    }));
    alert('State saved successfully!');
  };

  const stats = {
    totalItems: state.lists.reduce((sum, list) => sum + list.items.length, 0),
    completedItems: state.lists.reduce((sum, list) => 
      sum + list.items.filter(item => item.completed).length, 0),
    overdueItems: state.lists.reduce((sum, list) => 
      sum + list.items.filter(item => 
        item.dueDate && new Date() > item.dueDate && !item.completed
      ).length, 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Drag & Drop Task Board</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Organize tasks with intuitive drag & drop functionality, state persistence, and advanced task management features
        </p>
      </div>

      {/* Stats & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedItems}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdueItems}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          
          {!state.settings.autoSave && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(state.settings).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    settings: { ...prev.settings, [key]: e.target.checked }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {state.lists.map((list) => (
          <DragListColumn
            key={list.id}
            list={list}
            onItemEdit={setEditingItem}
            onItemDelete={handleItemDelete}
            onItemDuplicate={handleItemDuplicate}
            onItemToggleComplete={handleItemToggleComplete}
            onItemAdd={handleItemAdd}
            onDrop={handleDrop}
            settings={state.settings}
            draggedItem={state.draggedItem}
          />
        ))}
      </div>
    </div>
  );
};

export default DragDropList; 