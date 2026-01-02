import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Vote, 
  MoveVertical, 
  FormInput, 
  Trello,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Table,
  TreePine,
  ClipboardList,
  FolderOpen,
  BarChart3
} from 'lucide-react';

interface Component {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  completed: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
}

const StateManagement: React.FC = () => {
  const components: Component[] = [
    {
      id: 'shopping-cart',
      title: 'Shopping Cart',
      description: 'Complete e-commerce cart with Context API, local storage, and real-time calculations',
      path: '/shopping-cart',
      icon: <ShoppingCart className="h-6 w-6" />,
      completed: true,
      difficulty: 'Medium',
      concepts: ['Context API', 'useReducer', 'Local Storage', 'TypeScript']
    },
    {
      id: 'voting-system',
      title: 'Voting System',
      description: 'Comprehensive polling system with single/multiple choice polls, real-time results, anonymous voting, and local storage persistence',
      path: '/voting-system',
      icon: <Vote className="h-6 w-6" />,
      completed: true,
      difficulty: 'Medium',
      concepts: ['State Management', 'Real-time Updates', 'Data Persistence', 'Local Storage']
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop List',
      description: 'Interactive drag & drop task board with state management, multiple lists, and advanced task features',
      path: '/drag-drop-list',
      icon: <MoveVertical className="h-6 w-6" />,
      completed: true,
      difficulty: 'Hard',
      concepts: ['Drag & Drop API', 'State Updates', 'Event Handling', 'Local Storage']
    },
    {
      id: 'form-builder',
      title: 'Dynamic Form Builder',
      description: 'Build forms dynamically with complex state management, 25+ field types, and validation rules',
      path: '/form-builder',
      icon: <FormInput className="h-6 w-6" />,
      completed: true,
      difficulty: 'Hard',
      concepts: ['Dynamic State', 'Form Validation', 'Component Generation', 'JSON Schema']
    },
    {
      id: 'kanban',
      title: 'Kanban Board',
      description: 'Project management board with drag & drop, user management, WIP limits, and state persistence',
      path: '/kanban',
      icon: <Trello className="h-6 w-6" />,
      completed: true,
      difficulty: 'Hard',
      concepts: ['Complex State', 'Drag & Drop', 'Data Structures', 'Time Tracking']
    },
    {
      id: 'data-table',
      title: 'Data Table',
      description: 'Advanced data table with sorting, filtering, pagination, inline editing, and CRUD operations',
      path: '/data-table',
      icon: <Table className="h-6 w-6" />,
      completed: true,
      difficulty: 'Medium',
      concepts: ['Table Management', 'Sorting & Filtering', 'Inline Editing', 'Data Export']
    },
    {
      id: 'tree-view',
      title: 'Tree View',
      description: 'Hierarchical file explorer with expandable nodes, context menu, and file operations',
      path: '/tree-view',
      icon: <TreePine className="h-6 w-6" />,
      completed: true,
      difficulty: 'Medium',
      concepts: ['Tree Structures', 'Recursive Components', 'Context Menu', 'File Operations']
    },
    {
      id: 'multi-step-form',
      title: 'Multi-Step Form',
      description: '5-step registration form with validation, progress tracking, and local storage persistence',
      path: '/multi-step-form',
      icon: <ClipboardList className="h-6 w-6" />,
      completed: true,
      difficulty: 'Medium',
      concepts: ['Multi-Step Forms', 'Form Validation', 'Progress Tracking', 'Session Storage']
    },
    {
      id: 'file-explorer',
      title: 'File Explorer',
      description: 'File system explorer with folder navigation, file operations, and hierarchical structure',
      path: '/file-explorer',
      icon: <FolderOpen className="h-6 w-6" />,
      completed: true,
      difficulty: 'Hard',
      concepts: ['File System', 'Navigation', 'CRUD Operations', 'Nested State']
    },
    {
      id: 'chart-dashboard',
      title: 'Chart Dashboard',
      description: 'Interactive dashboard with multiple chart types, real-time updates, and data visualization',
      path: '/chart-dashboard',
      icon: <BarChart3 className="h-6 w-6" />,
      completed: true,
      difficulty: 'Hard',
      concepts: ['Data Visualization', 'Charts', 'Real-time Updates', 'Dashboard Design']
    }
  ];

  const completedCount = components.filter(c => c.completed).length;
  const totalCount = components.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            State Management & Data Flow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master React state management patterns with Context API, useReducer, and complex data flow scenarios.
            Build real-world applications with persistent state and optimized performance.
          </p>
          
          {/* Progress Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{completedCount}/{totalCount}</div>
              <div className="text-sm text-gray-600">Components Completed</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{progressPercentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">10</div>
              <div className="text-sm text-gray-600">Total Components</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <div key={component.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${component.completed ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={component.completed ? 'text-blue-600' : 'text-gray-400'}>
                      {component.icon}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                      {component.difficulty}
                    </span>
                    {component.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {component.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {component.description}
                </p>
                
                {/* Concepts */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {component.concepts.map((concept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={component.path}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      component.completed
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {component.completed ? 'View Component' : 'Coming Soon'}
                  </Link>
                  {component.completed && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Star className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Concepts Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Key State Management Concepts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Context API</h3>
              <p className="text-sm text-gray-600">Global state management without prop drilling</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MoveVertical className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">useReducer</h3>
              <p className="text-sm text-gray-600">Complex state logic with predictable updates</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FormInput className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Persistence</h3>
              <p className="text-sm text-gray-600">Local storage and state synchronization</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Trello className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Optimized updates and re-renders</p>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Recommended Learning Path</h2>
            <p className="text-blue-100 mb-6">
              Follow this progression to master React state management from basic to advanced concepts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">1. Shopping Cart</span>
                <span className="text-blue-200 text-sm block">Context + useReducer basics</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">2. Voting System</span>
                <span className="text-blue-200 text-sm block">Real-time state updates</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">3. Drag & Drop</span>
                <span className="text-blue-200 text-sm block">Complex interactions</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">4. Form Builder</span>
                <span className="text-blue-200 text-sm block">Dynamic state structure</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="font-medium">5. Kanban Board</span>
                <span className="text-blue-200 text-sm block">Advanced state patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateManagement; 