import React, { Suspense, lazy, useState, useEffect } from 'react';
import { 
  Code,
  Loader,
  Zap,
  Package,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

// Lazy loaded components
const LazyComponent1 = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700 mb-4">
              <Package className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Lazy Component 1</h3>
            </div>
            <p className="text-blue-600">
              This component was loaded lazily with a 2-second delay to simulate network loading.
            </p>
          </div>
        )
      });
    }, 2000);
  })
);

const LazyComponent2 = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Lazy Component 2</h3>
            </div>
            <p className="text-green-600">
              This component loads faster (1 second) to demonstrate different loading times.
            </p>
          </div>
        )
      });
    }, 1000);
  })
);

const LazyErrorComponent = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to load component'));
    }, 1500);
  })
);

// Custom loading component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
    <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
);

// Data fetching component with Suspense
const DataComponent: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate async data fetching
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData('Data loaded successfully!');
    };
    
    fetchData();
  }, []);

  if (!data) {
    throw new Promise(resolve => {
      setTimeout(() => {
        resolve(setData('Data loaded successfully!'));
      }, 1500);
    });
  }

  return (
    <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-center space-x-2 text-purple-700 mb-4">
        <Zap className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Async Data Component</h3>
      </div>
      <p className="text-purple-600">{data}</p>
    </div>
  );
};

// Error boundary for Suspense
class SuspenseErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Suspense Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700 mb-4">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Loading Failed</h3>
          </div>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'Component failed to load'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const SuspenseDemo: React.FC = () => {
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const [showDataComponent, setShowDataComponent] = useState(false);

  const resetAll = () => {
    setShowComponent1(false);
    setShowComponent2(false);
    setShowErrorComponent(false);
    setShowDataComponent(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">React Suspense Demo</h1>
          <p className="text-lg text-gray-600">
            Explore React Suspense for handling loading states and code splitting
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setShowComponent1(true)}
              disabled={showComponent1}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Package className="w-4 h-4" />
              <span>Load Component 1</span>
            </button>

            <button
              onClick={() => setShowComponent2(true)}
              disabled={showComponent2}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Load Component 2</span>
            </button>

            <button
              onClick={() => setShowErrorComponent(true)}
              disabled={showErrorComponent}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Load Error Component</span>
            </button>

            <button
              onClick={() => setShowDataComponent(true)}
              disabled={showDataComponent}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>Load Data Component</span>
            </button>

            <button
              onClick={resetAll}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Lazy Component 1 Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-500" />
            Lazy Component 1 (2s delay)
          </h2>
          {showComponent1 && (
            <Suspense fallback={<LoadingSpinner message="Loading Component 1..." />}>
              <LazyComponent1 />
            </Suspense>
          )}
        </div>

        {/* Lazy Component 2 Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
            Lazy Component 2 (1s delay)
          </h2>
          {showComponent2 && (
            <Suspense fallback={<LoadingSpinner message="Loading Component 2..." />}>
              <LazyComponent2 />
            </Suspense>
          )}
        </div>

        {/* Error Component Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Error Component Demo
          </h2>
          {showErrorComponent && (
            <SuspenseErrorBoundary>
              <Suspense fallback={<LoadingSpinner message="Loading Error Component..." />}>
                <LazyErrorComponent />
              </Suspense>
            </SuspenseErrorBoundary>
          )}
        </div>

        {/* Data Component Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-500" />
            Data Fetching with Suspense
          </h2>
          {showDataComponent && (
            <Suspense fallback={<LoadingSpinner message="Fetching data..." />}>
              <DataComponent />
            </Suspense>
          )}
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Suspense Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What is Suspense?</h3>
            <p className="text-gray-600 mb-4">
              Suspense is a React feature that lets you declaratively specify the loading state for a part of the component tree if it's not yet ready to be displayed. It's commonly used with lazy loading and data fetching.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Declarative loading states</li>
              <li>Code splitting and lazy loading</li>
              <li>Better user experience</li>
              <li>Simplified async state management</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Lazy loading components</li>
              <li>Data fetching with libraries like React Query</li>
              <li>Code splitting for performance</li>
              <li>Progressive loading</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Suspense boundaries catch loading states from child components</li>
                    <li>• Use Error Boundaries to handle loading errors</li>
                    <li>• Suspense works best with React.lazy() and data fetching libraries</li>
                    <li>• Multiple Suspense boundaries can be nested</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspenseDemo; 