import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Tag, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Circle,
  Star,
  ArrowRight,
  Filter,
  Search,
  Settings,
  Save,
  RotateCcw,
  User,
  Paperclip,
  MessageSquare,
  Eye,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Types
interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'highest';
  status: string;
  assignees: User[];
  labels: Label[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  attachments: number;
  comments: number;
  subtasks: Subtask[];
  boardId: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  limit?: number;
  order: number;
  cards: KanbanCard[];
}

interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  users: User[];
  labels: Label[];
  settings: BoardSettings;
}

interface BoardSettings {
  showAssignees: boolean;
  showLabels: boolean;
  showDueDates: boolean;
  showEstimates: boolean;
  enableWIP: boolean;
  autoSave: boolean;
  swimlanes: 'none' | 'assignee' | 'priority' | 'labels';
}

interface KanbanState {
  boards: Board[];
  activeBoard: string;
  filters: {
    assignees: string[];
    labels: string[];
    priority: string[];
    search: string;
  };
}

// Sample Data
const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', avatar: '👩‍💻', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob Smith', avatar: '👨‍💼', email: 'bob@example.com', role: 'member' },
  { id: '3', name: 'Charlie Brown', avatar: '👨‍🎨', email: 'charlie@example.com', role: 'member' },
  { id: '4', name: 'Diana Prince', avatar: '👩‍🔬', email: 'diana@example.com', role: 'member' },
  { id: '5', name: 'Eve Wilson', avatar: '👩‍🚀', email: 'eve@example.com', role: 'viewer' }
];

const SAMPLE_LABELS: Label[] = [
  { id: '1', name: 'Frontend', color: 'bg-blue-500' },
  { id: '2', name: 'Backend', color: 'bg-green-500' },
  { id: '3', name: 'Bug', color: 'bg-red-500' },
  { id: '4', name: 'Feature', color: 'bg-purple-500' },
  { id: '5', name: 'Documentation', color: 'bg-yellow-500' },
  { id: '6', name: 'Testing', color: 'bg-pink-500' },
  { id: '7', name: 'DevOps', color: 'bg-indigo-500' },
  { id: '8', name: 'UI/UX', color: 'bg-orange-500' }
];

const SAMPLE_CARDS: KanbanCard[] = [
  {
    id: '1',
    title: 'Redesign User Dashboard',
    description: 'Create a modern, responsive dashboard with improved UX and data visualization',
    priority: 'high',
    status: 'todo',
    assignees: [SAMPLE_USERS[0], SAMPLE_USERS[2]],
    labels: [SAMPLE_LABELS[0], SAMPLE_LABELS[7]],
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    estimatedHours: 40,
    actualHours: 12,
    attachments: 3,
    comments: 8,
    subtasks: [
      { id: '1-1', title: 'Create wireframes', completed: true },
      { id: '1-2', title: 'Design mockups', completed: true },
      { id: '1-3', title: 'Implement responsive layout', completed: false },
      { id: '1-4', title: 'Add data visualization', completed: false }
    ],
    boardId: 'board-1'
  },
  {
    id: '2',
    title: 'API Rate Limiting',
    description: 'Implement rate limiting middleware to prevent API abuse and ensure fair usage',
    priority: 'medium',
    status: 'in-progress',
    assignees: [SAMPLE_USERS[1]],
    labels: [SAMPLE_LABELS[1], SAMPLE_LABELS[3]],
    dueDate: new Date('2024-02-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    estimatedHours: 16,
    actualHours: 8,
    attachments: 1,
    comments: 4,
    subtasks: [
      { id: '2-1', title: 'Research rate limiting strategies', completed: true },
      { id: '2-2', title: 'Implement middleware', completed: false },
      { id: '2-3', title: 'Add monitoring', completed: false }
    ],
    boardId: 'board-1'
  },
  {
    id: '3',
    title: 'Fix Authentication Bug',
    description: 'Users are being logged out unexpectedly after password reset',
    priority: 'highest',
    status: 'in-progress',
    assignees: [SAMPLE_USERS[3]],
    labels: [SAMPLE_LABELS[2], SAMPLE_LABELS[1]],
    dueDate: new Date('2024-01-25'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    estimatedHours: 8,
    actualHours: 6,
    attachments: 2,
    comments: 12,
    subtasks: [
      { id: '3-1', title: 'Reproduce bug', completed: true },
      { id: '3-2', title: 'Identify root cause', completed: true },
      { id: '3-3', title: 'Implement fix', completed: false },
      { id: '3-4', title: 'Test solution', completed: false }
    ],
    boardId: 'board-1'
  },
  {
    id: '4',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions',
    priority: 'medium',
    status: 'done',
    assignees: [SAMPLE_USERS[4]],
    labels: [SAMPLE_LABELS[6], SAMPLE_LABELS[3]],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    estimatedHours: 24,
    actualHours: 22,
    attachments: 0,
    comments: 6,
    subtasks: [
      { id: '4-1', title: 'Setup GitHub Actions', completed: true },
      { id: '4-2', title: 'Configure testing', completed: true },
      { id: '4-3', title: 'Setup deployment', completed: true },
      { id: '4-4', title: 'Documentation', completed: true }
    ],
    boardId: 'board-1'
  },
  {
    id: '5',
    title: 'Mobile App Testing',
    description: 'Comprehensive testing across different mobile devices and operating systems',
    priority: 'low',
    status: 'todo',
    assignees: [SAMPLE_USERS[2], SAMPLE_USERS[4]],
    labels: [SAMPLE_LABELS[5], SAMPLE_LABELS[0]],
    dueDate: new Date('2024-03-01'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    estimatedHours: 32,
    attachments: 0,
    comments: 2,
    subtasks: [
      { id: '5-1', title: 'Create test plan', completed: false },
      { id: '5-2', title: 'iOS testing', completed: false },
      { id: '5-3', title: 'Android testing', completed: false }
    ],
    boardId: 'board-1'
  }
];

const INITIAL_BOARD: Board = {
  id: 'board-1',
  title: 'Product Development',
  description: 'Main product development board for tracking features, bugs, and improvements',
  users: SAMPLE_USERS,
  labels: SAMPLE_LABELS,
  settings: {
    showAssignees: true,
    showLabels: true,
    showDueDates: true,
    showEstimates: true,
    enableWIP: true,
    autoSave: true,
    swimlanes: 'none'
  },
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-gray-500',
      order: 0,
      cards: SAMPLE_CARDS.filter(card => card.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-500',
      limit: 3,
      order: 1,
      cards: SAMPLE_CARDS.filter(card => card.status === 'in-progress')
    },
    {
      id: 'review',
      title: 'Code Review',
      color: 'bg-yellow-500',
      limit: 2,
      order: 2,
      cards: []
    },
    {
      id: 'testing',
      title: 'Testing',
      color: 'bg-purple-500',
      order: 3,
      cards: []
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-500',
      order: 4,
      cards: SAMPLE_CARDS.filter(card => card.status === 'done')
    }
  ]
};

// Priority colors and labels
const PRIORITY_CONFIG = {
  lowest: { color: 'text-gray-400', bg: 'bg-gray-100', label: 'Lowest' },
  low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High' },
  highest: { color: 'text-red-600', bg: 'bg-red-100', label: 'Highest' }
};

// Kanban Card Component
const KanbanCardComponent: React.FC<{
  card: KanbanCard;
  settings: BoardSettings;
  onEdit: (card: KanbanCard) => void;
  onDelete: (cardId: string) => void;
  isDragging: boolean;
}> = ({ card, settings, onEdit, onDelete, isDragging }) => {
  
  const completedSubtasks = card.subtasks.filter(st => st.completed).length;
  const totalSubtasks = card.subtasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  
  const isOverdue = card.dueDate && new Date() > card.dueDate;
  const isDueSoon = card.dueDate && !isOverdue && 
    (card.dueDate.getTime() - Date.now()) < (2 * 24 * 60 * 60 * 1000); // 2 days
  
  const priorityConfig = PRIORITY_CONFIG[card.priority];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={`
        bg-white rounded-lg shadow-sm border p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 transform rotate-1 scale-105' : ''}
        ${isOverdue ? 'border-red-300 ring-1 ring-red-200' : ''}
        ${isDueSoon ? 'border-yellow-300 ring-1 ring-yellow-200' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
          {card.title}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} ${priorityConfig.bg}`}>
            {priorityConfig.label}
          </div>
          <button
            onClick={() => onEdit(card)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {settings.showLabels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.slice(0, 3).map((label) => (
            <span
              key={label.id}
              className={`px-2 py-1 rounded-full text-xs text-white ${label.color}`}
            >
              {label.name}
            </span>
          ))}
          {card.labels.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
              +{card.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Due Date & Estimates */}
      {(settings.showDueDates || settings.showEstimates) && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {settings.showDueDates && card.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''}`}>
              <Calendar className="h-3 w-3" />
              <span>{card.dueDate.toLocaleDateString()}</span>
            </div>
          )}
          
          {settings.showEstimates && card.estimatedHours && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{card.actualHours || 0}h/{card.estimatedHours}h</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignees */}
        {settings.showAssignees && (
          <div className="flex -space-x-2">
            {card.assignees.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center border-2 border-white">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Attachments & Comments */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {card.attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span>{card.attachments}</span>
            </div>
          )}
          {card.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{card.comments}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Column Component
const KanbanColumn: React.FC<{
  column: Column;
  board: Board;
  onCardMove: (cardId: string, targetColumnId: string) => void;
  onCardEdit: (card: KanbanCard) => void;
  onCardDelete: (cardId: string) => void;
  onAddCard: (columnId: string) => void;
  draggedCard: string | null;
  filteredCards: KanbanCard[];
}> = ({ column, board, onCardMove, onCardEdit, onCardDelete, onAddCard, draggedCard, filteredCards }) => {
  
  const [dragOver, setDragOver] = useState(false);
  
  const columnCards = filteredCards.filter(card => card.status === column.id);
  const canAcceptMoreCards = !column.limit || columnCards.length < column.limit;
  
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
    const cardId = e.dataTransfer.getData('text/plain');
    onCardMove(cardId, column.id);
    setDragOver(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-96 flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
            {columnCards.length}
            {column.limit && `/${column.limit}`}
          </span>
        </div>
        
        <button
          onClick={() => onAddCard(column.id)}
          disabled={!canAcceptMoreCards}
          className={`p-1 rounded transition-colors ${
            canAcceptMoreCards 
              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title={canAcceptMoreCards ? 'Add card' : 'Column limit reached'}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* WIP Limit Warning */}
      {column.limit && columnCards.length >= column.limit && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2 text-orange-700 text-xs">
            <AlertCircle className="h-4 w-4" />
            <span>WIP limit reached ({column.limit})</span>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 rounded-lg border-2 border-dashed transition-all duration-200 ${
          dragOver && canAcceptMoreCards
            ? 'border-blue-500 bg-blue-50'
            : dragOver && !canAcceptMoreCards
            ? 'border-red-500 bg-red-50'
            : 'border-transparent'
        }`}
      >
        {/* Cards */}
        {columnCards.map((card) => (
          <KanbanCardComponent
            key={card.id}
            card={card}
            settings={board.settings}
            onEdit={onCardEdit}
            onDelete={onCardDelete}
            isDragging={draggedCard === card.id}
          />
        ))}

        {/* Empty State */}
        {columnCards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Circle className="h-8 w-8 mb-2" />
            <p className="text-sm">No cards</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Card Form Component
const AddCardForm: React.FC<{
  columnId: string;
  board: Board;
  onSubmit: (columnId: string, cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt' | 'boardId'>) => void;
  onCancel: () => void;
}> = ({ columnId, board, onSubmit, onCancel }) => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<KanbanCard['priority']>('medium');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt' | 'boardId'> = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status: columnId,
      assignees: board.users.filter(user => assignees.includes(user.id)),
      labels: board.labels.filter(label => labels.includes(label.id)),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedHours: estimatedHours ? parseInt(estimatedHours) : undefined,
      actualHours: 0,
      attachments: 0,
      comments: 0,
      subtasks: []
    };

    onSubmit(columnId, cardData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Card</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Card description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as KanbanCard['priority'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lowest">Lowest</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="highest">Highest</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="Hours"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard: React.FC = () => {
  const [state, setState] = useState<KanbanState>({
    boards: [INITIAL_BOARD],
    activeBoard: 'board-1',
    filters: {
      assignees: [],
      labels: [],
      priority: [],
      search: ''
    }
  });

  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const activeBoard = state.boards.find(board => board.id === state.activeBoard);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanban-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const boards = parsed.boards.map((board: any) => ({
          ...board,
          columns: board.columns.map((column: any) => ({
            ...column,
            cards: column.cards.map((card: any) => ({
              ...card,
              createdAt: new Date(card.createdAt),
              updatedAt: new Date(card.updatedAt),
              dueDate: card.dueDate ? new Date(card.dueDate) : undefined
            }))
          }))
        }));
        setState(prev => ({ ...prev, boards }));
      } catch (error) {
        console.error('Error loading kanban state:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (activeBoard?.settings.autoSave) {
      localStorage.setItem('kanban-state', JSON.stringify(state));
    }
  }, [state, activeBoard?.settings.autoSave]);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    if (!activeBoard) return [];
    
    const allCards = activeBoard.columns.flatMap(column => column.cards);
    
    return allCards.filter(card => {
      // Search filter
      if (state.filters.search && !card.title.toLowerCase().includes(state.filters.search.toLowerCase()) &&
          !card.description.toLowerCase().includes(state.filters.search.toLowerCase())) {
        return false;
      }
      
      // Assignee filter
      if (state.filters.assignees.length > 0 && 
          !card.assignees.some(assignee => state.filters.assignees.includes(assignee.id))) {
        return false;
      }
      
      // Label filter
      if (state.filters.labels.length > 0 && 
          !card.labels.some(label => state.filters.labels.includes(label.id))) {
        return false;
      }
      
      // Priority filter
      if (state.filters.priority.length > 0 && 
          !state.filters.priority.includes(card.priority)) {
        return false;
      }
      
      return true;
    });
  }, [activeBoard, state.filters]);

  const handleCardMove = useCallback((cardId: string, targetColumnId: string) => {
    setState(prev => {
      const newBoards = prev.boards.map(board => {
        if (board.id !== prev.activeBoard) return board;
        
        // Find and remove card from current column
        let movedCard: KanbanCard | null = null;
        const newColumns = board.columns.map(column => ({
          ...column,
          cards: column.cards.filter(card => {
            if (card.id === cardId) {
              movedCard = { ...card, status: targetColumnId, updatedAt: new Date() };
              return false;
            }
            return true;
          })
        }));
        
        // Add card to target column
        if (movedCard) {
          const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
          if (targetColumnIndex !== -1) {
            // Check WIP limit
            const targetColumn = newColumns[targetColumnIndex];
            if (!targetColumn.limit || targetColumn.cards.length < targetColumn.limit) {
              newColumns[targetColumnIndex] = {
                ...targetColumn,
                cards: [...targetColumn.cards, movedCard]
              };
            }
          }
        }
        
        return { ...board, columns: newColumns };
      });
      
      return { ...prev, boards: newBoards };
    });
  }, []);

  const handleAddCard = useCallback((columnId: string, cardData: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt' | 'boardId'>) => {
    const newCard: KanbanCard = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      boardId: state.activeBoard
    };

    setState(prev => {
      const newBoards = prev.boards.map(board => {
        if (board.id !== prev.activeBoard) return board;
        
        const newColumns = board.columns.map(column => {
          if (column.id === columnId) {
            return { ...column, cards: [...column.cards, newCard] };
          }
          return column;
        });
        
        return { ...board, columns: newColumns };
      });
      
      return { ...prev, boards: newBoards };
    });
    
    setShowAddCard(null);
  }, [state.activeBoard]);

  const handleCardDelete = useCallback((cardId: string) => {
    setState(prev => {
      const newBoards = prev.boards.map(board => {
        if (board.id !== prev.activeBoard) return board;
        
        const newColumns = board.columns.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== cardId)
        }));
        
        return { ...board, columns: newColumns };
      });
      
      return { ...prev, boards: newBoards };
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem('kanban-state', JSON.stringify(state));
    alert('Board saved successfully!');
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      boards: [INITIAL_BOARD]
    }));
  };

  if (!activeBoard) return <div>Loading...</div>;

  const boardStats = {
    totalCards: activeBoard.columns.reduce((sum, col) => sum + col.cards.length, 0),
    completedCards: activeBoard.columns.find(col => col.id === 'done')?.cards.length || 0,
    overdueCards: activeBoard.columns.reduce((sum, col) => 
      sum + col.cards.filter(card => 
        card.dueDate && new Date() > card.dueDate && col.id !== 'done'
      ).length, 0),
    totalEstimatedHours: activeBoard.columns.reduce((sum, col) => 
      sum + col.cards.reduce((cardSum, card) => cardSum + (card.estimatedHours || 0), 0), 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{activeBoard.title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {activeBoard.description}
        </p>
      </div>

      {/* Stats & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{boardStats.totalCards}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{boardStats.completedCards}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{boardStats.overdueCards}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{boardStats.totalEstimatedHours}h</div>
            <div className="text-sm text-gray-600">Est. Hours</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={state.filters.search}
              onChange={(e) => setState(prev => ({
                ...prev,
                filters: { ...prev.filters, search: e.target.value }
              }))}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          
          {!activeBoard.settings.autoSave && (
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {activeBoard.columns
          .sort((a, b) => a.order - b.order)
          .map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              board={activeBoard}
              onCardMove={handleCardMove}
              onCardEdit={() => {}}
              onCardDelete={handleCardDelete}
              onAddCard={(columnId) => setShowAddCard(columnId)}
              draggedCard={draggedCard}
              filteredCards={filteredCards}
            />
          ))}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <AddCardForm
          columnId={showAddCard}
          board={activeBoard}
          onSubmit={handleAddCard}
          onCancel={() => setShowAddCard(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoard; 