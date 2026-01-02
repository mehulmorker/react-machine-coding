import React from 'react';
import { Link } from 'react-router-dom';
import { 
  List, 
  Image, 
  Timer, 
  Zap, 
  Package, 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  Cpu,
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

const Performance: React.FC = () => {
  const components: ComponentInfo[] = [
    {
      title: 'Virtualized List',
      description: 'High-performance list rendering for thousands of items using virtual scrolling techniques',
      icon: <List className="w-6 h-6" />,
      path: '/virtualized-list',
      difficulty: 'Hard',
      concepts: ['Virtual Scrolling', 'Performance', 'DOM Optimization', 'Memory Management'],
      features: ['Virtual rendering', 'Smooth scrolling', 'Dynamic heights', 'Large datasets', 'Memory efficiency']
    },
    {
      title: 'Lazy Loading',
      description: 'Progressive content loading with intersection observer and dynamic imports',
      icon: <Image className="w-6 h-6" />,
      path: '/lazy-loading',
      difficulty: 'Medium',
      concepts: ['Intersection Observer', 'Dynamic Imports', 'Code Splitting', 'Loading Strategies'],
      features: ['Image lazy loading', 'Component lazy loading', 'Progressive enhancement', 'Loading states', 'Fallback handling']
    },
    {
      title: 'Image Optimization',
      description: 'Advanced image optimization with responsive images, WebP support, and lazy loading',
      icon: <Image className="w-6 h-6" />,
      path: '/image-optimization',
      difficulty: 'Medium',
      concepts: ['Responsive Images', 'WebP', 'Progressive Loading', 'Image Compression'],
      features: ['Responsive images', 'Format optimization', 'Progressive loading', 'Placeholder generation', 'Error handling']
    },
    {
      title: 'Memoization Demo',
      description: 'React memoization techniques with useMemo, useCallback, and React.memo examples',
      icon: <Zap className="w-6 h-6" />,
      path: '/memoization-demo',
      difficulty: 'Medium',
      concepts: ['React.memo', 'useMemo', 'useCallback', 'Re-render Optimization'],
      features: ['Component memoization', 'Expensive calculations', 'Dependency tracking', 'Performance comparison', 'Memory usage']
    },
    {
      title: 'Code Splitting',
      description: 'Dynamic code splitting with React.lazy and Suspense for optimized bundle loading',
      icon: <Package className="w-6 h-6" />,
      path: '/code-splitting',
      difficulty: 'Hard',
      concepts: ['React.lazy', 'Suspense', 'Dynamic Imports', 'Bundle Splitting'],
      features: ['Route-based splitting', 'Component splitting', 'Loading boundaries', 'Error boundaries', 'Chunk optimization']
    },
    {
      title: 'Bundle Analyzer',
      description: 'Bundle size analysis and optimization tools with visual dependency mapping',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/bundle-analyzer',
      difficulty: 'Hard',
      concepts: ['Bundle Analysis', 'Dependency Mapping', 'Tree Shaking', 'Optimization'],
      features: ['Bundle visualization', 'Size analysis', 'Dependency tracking', 'Optimization suggestions', 'Performance metrics']
    },
    {
      title: 'Performance Monitor',
      description: 'Real-time performance monitoring with metrics, profiling, and optimization insights',
      icon: <Activity className="w-6 h-6" />,
      path: '/performance-monitor',
      difficulty: 'Hard',
      concepts: ['Performance API', 'Profiling', 'Metrics Collection', 'Real-time Monitoring'],
      features: ['Performance metrics', 'Real-time monitoring', 'Profiling tools', 'Optimization insights', 'Historical data']
    },
    {
      title: 'Memory Leak Demo',
      description: 'Common memory leak patterns and solutions with monitoring and prevention techniques',
      icon: <AlertTriangle className="w-6 h-6" />,
      path: '/memory-leak-demo',
      difficulty: 'Hard',
      concepts: ['Memory Management', 'Leak Detection', 'Event Cleanup', 'Reference Management'],
      features: ['Leak detection', 'Memory monitoring', 'Cleanup patterns', 'Prevention techniques', 'Debugging tools']
    },
    {
      title: 'Web Workers',
      description: 'Background processing with Web Workers for CPU-intensive tasks and thread management',
      icon: <Cpu className="w-6 h-6" />,
      path: '/web-workers',
      difficulty: 'Hard',
      concepts: ['Web Workers', 'Threading', 'Background Processing', 'Message Passing'],
      features: ['Background processing', 'Thread management', 'Message communication', 'CPU-intensive tasks', 'Performance isolation']
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

  const completedCount = 9; // All performance components are now implemented and working
  const totalCount = components.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Performance Optimization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Master advanced performance optimization techniques including virtualization, memoization, 
            code splitting, and profiling to build lightning-fast React applications.
          </p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
              { icon: <Zap className="w-5 h-5" />, title: 'Optimization', desc: 'Performance techniques' },
              { icon: <Clock className="w-5 h-5" />, title: 'Rendering', desc: 'Efficient DOM updates' },
              { icon: <Star className="w-5 h-5" />, title: 'Memory', desc: 'Memory management' },
              { icon: <Settings className="w-5 h-5" />, title: 'Profiling', desc: 'Performance monitoring' }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-green-600">{concept.icon}</div>
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
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-green-600">{component.icon}</div>
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
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
            <div className="text-3xl font-bold text-green-600 mb-2">{totalCount}</div>
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

export default Performance; 