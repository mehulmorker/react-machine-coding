import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle,
  RefreshCw,
  Code,
  Bug,
  Shield,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Basic Error Boundary
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Something went wrong</h3>
          </div>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Prone Component
const ErrorProneComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error('This is a simulated error for demonstration purposes');
  }

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2 text-green-700">
        <Shield className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Component is working correctly!</h3>
      </div>
      <p className="text-green-600 mt-2">
        No errors detected in this component.
      </p>
    </div>
  );
};

// Nested Error Boundary Example
const NestedErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-700 mb-4">
          <Shield className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Nested Error Boundary</h3>
        </div>
        {children}
      </div>
    </ErrorBoundary>
  );
};

const ErrorBoundaryDemo: React.FC = () => {
  const [shouldError, setShouldError] = React.useState(false);
  const [showNestedError, setShowNestedError] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Boundary Demo</h1>
          <p className="text-lg text-gray-600">
            Explore React's Error Boundary pattern for graceful error handling
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShouldError(!shouldError)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                shouldError 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>{shouldError ? 'Will Error' : 'Toggle Error'}</span>
            </button>

            <button
              onClick={() => setShowNestedError(!showNestedError)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showNestedError 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{showNestedError ? 'Will Nested Error' : 'Toggle Nested Error'}</span>
            </button>
          </div>
        </div>

        {/* Basic Error Boundary Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Basic Error Boundary
          </h2>
          <ErrorBoundary>
            <ErrorProneComponent shouldError={shouldError} />
          </ErrorBoundary>
        </div>

        {/* Nested Error Boundary Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Nested Error Boundary
          </h2>
          <ErrorBoundary>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">This component is protected by the outer error boundary</p>
              </div>
              <NestedErrorBoundary>
                <ErrorProneComponent shouldError={showNestedError} />
              </NestedErrorBoundary>
            </div>
          </ErrorBoundary>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Error Boundary Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are Error Boundaries?</h3>
            <p className="text-gray-600 mb-4">
              Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Catch JavaScript errors in child components</li>
              <li>Display fallback UI when errors occur</li>
              <li>Log error information for debugging</li>
              <li>Prevent the entire app from crashing</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Place error boundaries strategically</li>
              <li>Use multiple error boundaries for different parts of the app</li>
              <li>Provide meaningful error messages</li>
              <li>Include recovery options when possible</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Error boundaries don't catch errors in event handlers</li>
                    <li>• Error boundaries don't catch errors in async code</li>
                    <li>• Error boundaries don't catch errors in server-side rendering</li>
                    <li>• Error boundaries don't catch errors in error boundaries themselves</li>
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

export default ErrorBoundaryDemo; 