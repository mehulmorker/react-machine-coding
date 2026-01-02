import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layout, 
  Database, 
  Globe, 
  Zap, 
  PuzzleIcon, 
  Calculator, 
  Building, 
  Cpu 
} from 'lucide-react';

const Home: React.FC = () => {
  const categories = [
    {
      title: 'UI Widgets & Core Components',
      description: 'Essential UI building blocks like counters, modals, carousels, and more',
      icon: Layout,
      color: 'bg-blue-500',
      items: ['Counter App', 'Todo List', 'Accordion', 'Tabs', 'Modal', 'Carousel'],
      path: '/ui-widgets'
    },
    {
      title: 'State Management & Data Flow',
      description: 'Complex state handling patterns including shopping carts and kanban boards',
      icon: Database,
      color: 'bg-green-500',
      items: ['Shopping Cart', 'Voting System', 'Drag & Drop', 'Form Builder', 'Kanban'],
      path: '/state-management'
    },
    {
      title: 'API Integration & Async UI',
      description: 'Real-world API integration with loading states and error handling',
      icon: Globe,
      color: 'bg-purple-500',
      items: ['GitHub Search', 'Weather App', 'Infinite Scroll', 'CRUD', 'File Upload'],
      path: '/api-integration'
    },
    {
      title: 'Performance Optimization',
      description: 'Advanced optimization techniques for high-performance React apps',
      icon: Zap,
      color: 'bg-yellow-500',
      items: ['Virtualized List', 'Lazy Loading', 'Debounce/Throttle', 'Theme Toggle'],
      path: '/performance'
    },
    {
      title: 'System Design Projects',
      description: 'End-to-end applications mimicking real-world systems',
      icon: Building,
      color: 'bg-red-500',
      items: ['Tic-Tac-Toe', 'URL Shortener', 'Expense Tracker', 'Chat UI', 'Code Editor'],
      path: '/system-design'
    },
    {
      title: 'Algorithm + UI Challenges',
      description: 'Interactive visualizations of algorithms and data structures',
      icon: Calculator,
      color: 'bg-indigo-500',
      items: ['Word Counter', 'Password Strength', 'OTP Input', 'Date Picker', 'Timer'],
      path: '/algorithms'
    },
    {
      title: 'Real-World Inspired',
      description: 'UI patterns inspired by popular apps like LinkedIn, Swiggy, Netflix',
      icon: PuzzleIcon,
      color: 'bg-pink-500',
      items: ['LinkedIn Features', 'Swiggy UI', 'Flipkart Filters', 'Netflix Cards'],
      path: '/real-world'
    },
    {
      title: 'Advanced Concepts',
      description: 'Advanced React patterns, hooks, and architectural concepts',
      icon: Cpu,
      color: 'bg-gray-500',
      items: ['Custom Hooks', 'Virtual Scroll', 'React Query', 'Micro Frontend', 'Redux Clone'],
      path: '/advanced'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          React Machine Coding
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive collection of React projects designed for interview preparation 
          and skill development
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            TypeScript
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            React Router
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Modern Hooks
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">50+</div>
          <div className="text-sm text-gray-600">Projects</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">100%</div>
          <div className="text-sm text-gray-600">TypeScript</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">Ready</div>
          <div className="text-sm text-gray-600">Interview</div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={index}
              to={category.path}
              className="group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 space-y-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Includes
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                    {category.items.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{category.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Why This Collection?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <PuzzleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Interview Ready</h3>
            <p className="text-sm text-gray-600">
              Projects specifically designed to match common machine coding interview patterns
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Production Grade</h3>
            <p className="text-sm text-gray-600">
              Clean, well-documented code following React best practices and patterns
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Cpu className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Modern Tech</h3>
            <p className="text-sm text-gray-600">
              Built with latest React patterns, TypeScript, and modern development tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 