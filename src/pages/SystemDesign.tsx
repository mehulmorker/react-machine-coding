import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  MessageSquare,
  Music,
  Palette,
  Calculator,
  Timer,
  FileText,
  Code,
  PenTool,
  Play,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';

interface ComponentInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
  features: string[];
}

const SystemDesign: React.FC = () => {
  const components: ComponentInfo[] = [
    {
      title: 'Tic-Tac-Toe Game',
      description: 'Interactive tic-tac-toe game with AI opponent and game history',
      icon: <Building className="w-6 h-6" />,
      path: '/system-design/tic-tac-toe',
      difficulty: 'Easy',
      concepts: ['Game Logic', 'State Management', 'AI Algorithm', 'Turn-based Play'],
      features: ['Single/multiplayer modes', 'AI opponent', 'Game history', 'Win detection', 'Score tracking']
    },
    {
      title: 'Chat Application UI',
      description: 'Modern chat interface with real-time messaging capabilities',
      icon: <MessageSquare className="w-6 h-6" />,
      path: '/system-design/chat-app',
      difficulty: 'Hard',
      concepts: ['Real-time Communication', 'Message Threading', 'User Management', 'WebSocket'],
      features: ['Message bubbles', 'Typing indicators', 'Emoji support', 'File sharing', 'User presence']
    },
    {
      title: 'Music Player',
      description: 'Feature-rich music player with playlist management and audio controls',
      icon: <Music className="w-6 h-6" />,
      path: '/system-design/music-player',
      difficulty: 'Hard',
      concepts: ['Audio API', 'Playlist Management', 'Media Controls', 'Visualization'],
      features: ['Play/pause controls', 'Playlist creation', 'Volume control', 'Progress bar', 'Audio visualization']
    },
    {
      title: 'Drawing App',
      description: 'Canvas-based drawing application with multiple tools and layers',
      icon: <Palette className="w-6 h-6" />,
      path: '/system-design/drawing-app',
      difficulty: 'Hard',
      concepts: ['Canvas API', 'Drawing Tools', 'Layer Management', 'Event Handling'],
      features: ['Multiple brush types', 'Color palette', 'Layer system', 'Undo/redo', 'Export functionality']
    },
    {
      title: 'Calculator',
      description: 'Scientific calculator with advanced mathematical operations',
      icon: <Calculator className="w-6 h-6" />,
      path: '/system-design/calculator',
      difficulty: 'Medium',
      concepts: ['Mathematical Operations', 'Expression Parsing', 'Keyboard Input', 'Error Handling'],
      features: ['Basic operations', 'Scientific functions', 'Memory functions', 'Keyboard support', 'History tracking']
    },
    {
      title: 'Timer/Stopwatch',
      description: 'Multi-functional timer and stopwatch with lap tracking',
      icon: <Timer className="w-6 h-6" />,
      path: '/system-design/timer-stopwatch',
      difficulty: 'Medium',
      concepts: ['Time Management', 'Interval Handling', 'Notification API', 'Local Storage'],
      features: ['Countdown timer', 'Stopwatch', 'Lap tracking', 'Notifications', 'Preset timers']
    },
    {
      title: 'Text Editor',
      description: 'Rich text editor with formatting options and document management',
      icon: <FileText className="w-6 h-6" />,
      path: '/system-design/text-editor',
      difficulty: 'Hard',
      concepts: ['Rich Text Editing', 'Document Management', 'File Operations', 'Formatting'],
      features: ['Text formatting', 'Document tabs', 'Auto-save', 'Export options', 'Find/replace']
    },
    {
      title: 'Code Editor',
      description: 'Syntax-highlighted code editor with multiple language support',
      icon: <Code className="w-6 h-6" />,
      path: '/system-design/code-editor',
      difficulty: 'Hard',
      concepts: ['Syntax Highlighting', 'Code Parsing', 'Language Support', 'Editor Features'],
      features: ['Syntax highlighting', 'Auto-completion', 'Line numbers', 'Theme support', 'Multiple tabs']
    },
    {
      title: 'Whiteboard',
      description: 'Collaborative whiteboard for drawing and annotation',
      icon: <PenTool className="w-6 h-6" />,
      path: '/system-design/whiteboard',
      difficulty: 'Hard',
      concepts: ['Canvas Drawing', 'Real-time Collaboration', 'Shape Tools', 'Annotation'],
      features: ['Drawing tools', 'Shape library', 'Text annotations', 'Collaboration', 'Export/import']
    },
    {
      title: 'Video Player',
      description: 'Custom video player with advanced playback controls',
      icon: <Play className="w-6 h-6" />,
      path: '/system-design/video-player',
      difficulty: 'Hard',
      concepts: ['Video API', 'Media Controls', 'Streaming', 'Accessibility'],
      features: ['Custom controls', 'Playback speed', 'Subtitles', 'Fullscreen', 'Playlist support']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = 10; // All System Design components are now complete
  const totalCount = components.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Building className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            System Design & End-to-End Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Build complete applications that demonstrate system design principles and 
            end-to-end development skills with real-world functionality.
          </p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((completedCount / totalCount) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Concepts Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Building className="w-5 h-5" />, title: 'Architecture', desc: 'System design patterns' },
              { icon: <Clock className="w-5 h-5" />, title: 'Real-time', desc: 'Live interactions' },
              { icon: <Star className="w-5 h-5" />, title: 'Features', desc: 'Complete functionality' },
              { icon: <Settings className="w-5 h-5" />, title: 'Integration', desc: 'End-to-end flow' }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="bg-red-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-red-600">{concept.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{concept.title}</h3>
                <p className="text-sm text-gray-600">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((component, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <div className="text-red-600">{component.icon}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                    {component.difficulty}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {component.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {component.description}
                </p>

                {/* Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Concepts:</h4>
                  <div className="flex flex-wrap gap-1">
                    {component.concepts.map((concept, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {component.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                    {component.features.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{component.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <Link
                  to={component.path}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                >
                  Explore Component
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{totalCount}</div>
            <div className="text-gray-600">Total Components</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{completedCount}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {components.reduce((acc, comp) => acc + comp.features.length, 0)}
            </div>
            <div className="text-gray-600">Total Features</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDesign; 