import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Code, 
  Zap, 
  Layers, 
  Database, 
  Cpu, 
  Brain, 
  Rocket, 
  Target, 
  CheckCircle, 
  ArrowRight 
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

const Advanced: React.FC = () => {
  const components: ComponentInfo[] = [
    {
      title: 'Custom Hooks Demo',
      description: 'Collection of reusable custom hooks for common React patterns',
      icon: <Cpu className="w-6 h-6" />,
      path: '/advanced/custom-hooks',
      difficulty: 'Medium',
      concepts: ['Custom Hooks', 'Reusability', 'State Logic', 'Side Effects'],
      features: ['useLocalStorage', 'useDebounce', 'useFetch', 'useToggle', 'useCounter']
    },
    {
      title: 'Higher-Order Components',
      description: 'HOC patterns for component composition and enhancement',
      icon: <Layers className="w-6 h-6" />,
      path: '/advanced/hoc',
      difficulty: 'Hard',
      concepts: ['HOCs', 'Component Enhancement', 'Props Manipulation', 'Composition'],
      features: ['withAuth', 'withLoading', 'withErrorBoundary', 'withLogger', 'Component wrapping']
    },
    {
      title: 'Render Props Pattern',
      description: 'Render props for flexible component composition and data sharing',
      icon: <ExternalLink className="w-6 h-6" />,
      path: '/advanced/render-props',
      difficulty: 'Hard',
      concepts: ['Render Props', 'Function as Children', 'Data Sharing', 'Composition'],
      features: ['Mouse tracker', 'Data fetcher', 'Toggle state', 'Form validation', 'Scroll position']
    },
    {
      title: 'Context API Demo',
      description: 'Advanced Context API patterns for state management',
      icon: <Database className="w-6 h-6" />,
      path: '/advanced/context-api',
      difficulty: 'Medium',
      concepts: ['Context API', 'Provider Pattern', 'State Management', 'Component Communication'],
      features: ['Theme context', 'User context', 'Nested providers', 'Context optimization', 'Multiple contexts']
    },
    {
      title: 'Error Boundaries',
      description: 'Error handling and recovery mechanisms for React applications',
      icon: <Brain className="w-6 h-6" />,
      path: '/advanced/error-boundary',
      difficulty: 'Medium',
      concepts: ['Error Boundaries', 'Error Handling', 'Fallback UI', 'Error Recovery'],
      features: ['Catch JS errors', 'Fallback components', 'Error logging', 'Recovery mechanisms', 'Error reporting']
    },
    {
      title: 'Portals Demo',
      description: 'React Portals for rendering outside component hierarchy',
      icon: <Rocket className="w-6 h-6" />,
      path: '/advanced/portals',
      difficulty: 'Medium',
      concepts: ['Portals', 'DOM Manipulation', 'Event Bubbling', 'Component Hierarchy'],
      features: ['Modal portals', 'Tooltip portals', 'Notification portals', 'Event handling', 'Z-index management']
    },
    {
      title: 'Suspense & Lazy',
      description: 'Code splitting and loading states with Suspense and React.lazy',
      icon: <Zap className="w-6 h-6" />,
      path: '/advanced/suspense',
      difficulty: 'Hard',
      concepts: ['Suspense', 'React.lazy', 'Code Splitting', 'Loading States'],
      features: ['Lazy components', 'Suspense boundaries', 'Loading fallbacks', 'Error boundaries', 'Nested suspense']
    },
    {
      title: 'Concurrent Features',
      description: 'React 18 concurrent features for improved performance',
      icon: <Target className="w-6 h-6" />,
      path: '/advanced/concurrent-features',
      difficulty: 'Hard',
      concepts: ['Concurrent Rendering', 'Transitions', 'Deferred Values', 'Automatic Batching'],
      features: ['useTransition', 'useDeferredValue', 'Automatic batching', 'Priority updates', 'Concurrent mode']
    },
    {
      title: 'Micro Frontend',
      description: 'Micro frontend architecture with module federation',
      icon: <Code className="w-6 h-6" />,
      path: '/advanced/micro-frontend',
      difficulty: 'Hard',
      concepts: ['Micro Frontends', 'Module Federation', 'Independent Deployment', 'Shared Dependencies'],
      features: ['Independent apps', 'Shared components', 'Runtime integration', 'Isolated state', 'Dynamic loading']
    },
    {
      title: 'Server Components',
      description: 'React Server Components for server-side rendering',
      icon: <CheckCircle className="w-6 h-6" />,
      path: '/advanced/server-components',
      difficulty: 'Hard',
      concepts: ['Server Components', 'SSR', 'Hydration', 'Client-Server Boundary'],
      features: ['Server rendering', 'Client hydration', 'Mixed components', 'Data fetching', 'Performance optimization']
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

  const completedCount = 10;
  const totalCount = components.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <Cpu className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Concepts & Hooks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Master advanced React patterns, architectural concepts, and cutting-edge 
            features for building scalable and performant applications.
          </p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Section Progress</h2>
              <span className="text-2xl font-bold text-green-600">10/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">10 components completed out of 10</p>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Concepts Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Cpu className="w-5 h-5" />, title: 'Patterns', desc: 'Advanced React patterns' },
              { icon: <Layers className="w-5 h-5" />, title: 'Architecture', desc: 'Scalable architecture' },
              { icon: <Zap className="w-5 h-5" />, title: 'Performance', desc: 'Optimization techniques' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Modern', desc: 'Latest React features' }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-gray-600">{concept.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{concept.title}</h3>
                <p className="text-sm text-gray-600">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Custom Hooks Demo */}
          <Link to="/advanced/custom-hooks" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Code className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Hooks Demo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Collection of reusable custom hooks including useLocalStorage, useDebounce, useFetch, and more
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Higher-Order Components */}
          <Link to="/advanced/hoc" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Layers className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Higher-Order Components</h3>
              <p className="text-gray-600 text-sm mb-4">
                HOC patterns including withAuth, withLoading, withErrorBoundary, withLogger, and withLocalStorage
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Render Props Pattern */}
          <Link to="/advanced/render-props" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ExternalLink className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Render Props Pattern</h3>
              <p className="text-gray-600 text-sm mb-4">
                Render props for flexible component composition including mouse tracker, data fetcher, and form validation
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Context API Demo */}
          <Link to="/advanced/context-api" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Context API Demo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Advanced Context API patterns with theme context, user context, and nested providers
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Error Boundaries */}
          <Link to="/advanced/error-boundary" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Boundaries</h3>
              <p className="text-gray-600 text-sm mb-4">
                Error handling and recovery mechanisms with fallback components and error logging
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Portals Demo */}
          <Link to="/advanced/portals" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Rocket className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portals Demo</h3>
              <p className="text-gray-600 text-sm mb-4">
                React Portals for rendering outside component hierarchy with modal and tooltip portals
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Suspense & Lazy */}
          <Link to="/advanced/suspense" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Suspense & Lazy</h3>
              <p className="text-gray-600 text-sm mb-4">
                Code splitting and loading states with Suspense, React.lazy, and error boundaries
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Concurrent Features */}
          <Link to="/advanced/concurrent-features" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Concurrent Features</h3>
              <p className="text-gray-600 text-sm mb-4">
                React 18 concurrent features with useTransition, useDeferredValue, and automatic batching
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Micro Frontend */}
          <Link to="/advanced/micro-frontend" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Code className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Micro Frontend</h3>
              <p className="text-gray-600 text-sm mb-4">
                Micro frontend architecture with module federation and independent deployment patterns
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Server Components */}
          <Link to="/advanced/server-components" className="group block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Server Components</h3>
              <p className="text-gray-600 text-sm mb-4">
                React Server Components for server-side rendering with client hydration and mixed components
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  ✅ Completed
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">{totalCount}</div>
            <div className="text-gray-600">Total Components</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
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

export default Advanced; 