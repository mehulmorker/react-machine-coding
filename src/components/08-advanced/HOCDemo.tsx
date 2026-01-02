import React, { useState, useEffect, ComponentType, ReactNode } from 'react';
import { 
  Shield, 
  Loader, 
  AlertTriangle, 
  FileText, 
  Database, 
  User as UserIcon, 
  Lock, 
  Unlock,
  Activity,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Check,
  X,
  Info,
  Code,
  Layers,
  Zap
} from 'lucide-react';

// Types
interface WithAuthProps {
  isAuthenticated: boolean;
}

interface WithLoadingProps {
  isLoading: boolean;
}

interface WithErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface WithLoggerProps {
  componentName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
}

// Sample data
const sampleUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
};

// Higher-Order Component: withAuth
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P & WithAuthProps) {
    const { isAuthenticated, ...restProps } = props;

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <Lock className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Access Denied</h3>
          <p className="text-red-600 text-center">
            You need to be authenticated to view this content.
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Sign In
          </button>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Higher-Order Component: withLoading
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  loadingMessage: string = 'Loading...'
) {
  return function LoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...restProps } = props;

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-blue-600">{loadingMessage}</p>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Higher-Order Component: withErrorBoundary
function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackComponent?: ComponentType<{ error: Error; resetError: () => void }>
) {
  return class ErrorBoundaryComponent extends React.Component<P, WithErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): WithErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error caught by HOC:', error, errorInfo);
    }

    resetError = () => {
      this.setState({ hasError: false, error: undefined });
    };

    render() {
      if (this.state.hasError) {
        if (fallbackComponent) {
          const FallbackComponent = fallbackComponent;
          return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
        }

        return (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h3>
            <p className="text-red-600 text-center mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.resetError}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

// Higher-Order Component: withLogger
function withLogger<P extends object>(
  WrappedComponent: ComponentType<P>,
  logEvents: string[] = ['mount', 'unmount', 'update']
) {
  return function LoggerComponent(props: P & WithLoggerProps) {
    const { componentName, ...restProps } = props;

    useEffect(() => {
      if (logEvents.includes('mount')) {
        console.log(`[${componentName}] Component mounted`, { props: restProps });
      }

      return () => {
        if (logEvents.includes('unmount')) {
          console.log(`[${componentName}] Component unmounted`);
        }
      };
    }, [componentName, restProps]);

    useEffect(() => {
      if (logEvents.includes('update')) {
        console.log(`[${componentName}] Component updated`, { props: restProps });
      }
    }, [componentName, restProps]);

    return <WrappedComponent {...(restProps as P)} />;
  };
}

// Higher-Order Component: withLocalStorage
function withLocalStorage<P extends object, T = any>(
  WrappedComponent: ComponentType<P & { value: T; setValue: (value: T) => void }>,
  storageKey: string,
  defaultValue: T
) {
  return function LocalStorageComponent(props: P) {
    const [value, setValue] = useState<T>(() => {
      try {
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading localStorage key "${storageKey}":`, error);
        return defaultValue;
      }
    });

    const setStorageValue = (newValue: T) => {
      try {
        setValue(newValue);
        localStorage.setItem(storageKey, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${storageKey}":`, error);
      }
    };

    return (
      <WrappedComponent
        {...props}
        value={value}
        setValue={setStorageValue}
      />
    );
  };
}

// Base Components for demonstration
const UserProfile: React.FC<{ user?: User }> = ({ user = sampleUser }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center space-x-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.role === 'user' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.role}
        </span>
      </div>
    </div>
  </div>
);

const DataList: React.FC = () => {
  const [items] = useState([
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'inactive' },
    { id: 3, name: 'Item 3', status: 'pending' }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data List</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>{item.name}</span>
            <span className={`px-2 py-1 text-xs rounded ${
              item.status === 'active' ? 'bg-green-100 text-green-800' :
              item.status === 'inactive' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorProneComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error('This is a simulated error for demonstration purposes');
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Error-Prone Component</h3>
      <p className="text-gray-600">This component is working correctly!</p>
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-green-700">✅ No errors detected</p>
      </div>
    </div>
  );
};

const CounterComponent: React.FC<{ value: number; setValue: (value: number) => void }> = ({
  value,
  setValue
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Persistent Counter</h3>
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={() => setValue(value - 1)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        -
      </button>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <button
        onClick={() => setValue(value + 1)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        +
      </button>
    </div>
    <p className="text-sm text-gray-500 text-center mt-2">
      Value persists in localStorage
    </p>
  </div>
);

const SettingsComponent: React.FC<{ value: any; setValue: (value: any) => void }> = ({
  value,
  setValue
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Settings</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Dark Mode</label>
        <button
          onClick={() => setValue({ ...value, darkMode: !value.darkMode })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value.darkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value.darkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Notifications</label>
        <button
          onClick={() => setValue({ ...value, notifications: !value.notifications })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value.notifications ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value.notifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <select
          value={value.theme || 'blue'}
          onChange={(e) => setValue({ ...value, theme: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="red">Red</option>
        </select>
      </div>
    </div>
  </div>
);

// Enhanced components using HOCs
const AuthenticatedUserProfile = withAuth(UserProfile);
const LoadingDataList = withLoading(DataList, 'Loading data...');
const SafeErrorProneComponent = withErrorBoundary(ErrorProneComponent);
const LoggedUserProfile = withLogger(UserProfile);
const PersistentCounter = withLocalStorage<{}, number>(CounterComponent, 'hoc-counter', 0);
const PersistentSettings = withLocalStorage<{}, any>(SettingsComponent, 'hoc-settings', {
  darkMode: false,
  notifications: true,
  theme: 'blue'
});

const HOCDemo: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldError, setShouldError] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const hocPatterns = [
    {
      name: 'withAuth',
      description: 'Provides authentication and authorization logic',
      code: `withAuth(Component, requiredRole?)`,
      features: ['Access control', 'Role-based permissions', 'Fallback UI', 'Security enforcement']
    },
    {
      name: 'withLoading',
      description: 'Adds loading states and spinner functionality',
      code: `withLoading(Component, loadingMessage?)`,
      features: ['Loading states', 'Custom messages', 'Spinner UI', 'Async operation handling']
    },
    {
      name: 'withErrorBoundary',
      description: 'Catches and handles component errors gracefully',
      code: `withErrorBoundary(Component, FallbackComponent?)`,
      features: ['Error catching', 'Fallback UI', 'Error recovery', 'Error logging']
    },
    {
      name: 'withLogger',
      description: 'Adds comprehensive logging for component lifecycle',
      code: `withLogger(Component, logEvents?)`,
      features: ['Lifecycle logging', 'Props tracking', 'Debug information', 'Development tools']
    },
    {
      name: 'withLocalStorage',
      description: 'Provides persistent state using localStorage',
      code: `withLocalStorage(Component, key, defaultValue)`,
      features: ['State persistence', 'Auto-sync', 'Error handling', 'Default values']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Higher-Order Components Demo</h1>
          <p className="text-lg text-gray-600">
            Explore HOC patterns for component composition, enhancement, and reusability
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setIsAuthenticated(!isAuthenticated)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
            </button>

            <button
              onClick={simulateLoading}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Loader className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Simulate Loading</span>
            </button>

            <button
              onClick={() => setShouldError(!shouldError)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                shouldError 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{shouldError ? 'Will Error' : 'Toggle Error'}</span>
            </button>

            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showConsole 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showConsole ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Console Logs</span>
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Storage</span>
            </button>
          </div>
        </div>

        {/* Console Output */}
        {showConsole && (
          <div className="bg-gray-900 rounded-lg p-4 mb-8 font-mono text-sm text-green-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Console Output (Check browser console for full logs)</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs space-y-1">
              <div>[LoggedUserProfile] Component mounted</div>
              <div>[LoggedUserProfile] Component updated</div>
              <div className="text-yellow-400">HOC logging is active - check browser console for detailed logs</div>
            </div>
          </div>
        )}

        {/* Demo Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* withAuth Demo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              withAuth HOC
            </h3>
            <AuthenticatedUserProfile isAuthenticated={isAuthenticated} />
          </div>

          {/* withLoading Demo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Loader className="w-5 h-5 mr-2 text-green-500" />
              withLoading HOC
            </h3>
            <LoadingDataList isLoading={isLoading} />
          </div>

          {/* withErrorBoundary Demo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              withErrorBoundary HOC
            </h3>
            <SafeErrorProneComponent shouldError={shouldError} />
          </div>

          {/* withLogger Demo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-500" />
              withLogger HOC
            </h3>
            <LoggedUserProfile componentName="LoggedUserProfile" />
          </div>

          {/* withLocalStorage Demo - Counter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-500" />
              withLocalStorage HOC - Counter
            </h3>
            <PersistentCounter />
          </div>

          {/* withLocalStorage Demo - Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-teal-500" />
              withLocalStorage HOC - Settings
            </h3>
            <PersistentSettings />
          </div>
        </div>

        {/* HOC Patterns Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-blue-500" />
            HOC Patterns & Usage
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hocPatterns.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-purple-500" />
                  {pattern.name}
                </h3>
                <p className="text-gray-600 mb-4">{pattern.description}</p>
                
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm mb-4 text-gray-800">
                  {pattern.code}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pattern.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-yellow-500" />
            HOC Best Practices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Best Practices</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Don't use HOCs inside render methods</li>
                <li>• Copy static methods from wrapped component</li>
                <li>• Pass through unrelated props</li>
                <li>• Use display names for debugging</li>
                <li>• Compose HOCs for complex functionality</li>
                <li>• Handle ref forwarding properly</li>
                <li>• Keep HOCs pure and side-effect free</li>
                <li>• Document HOC behavior clearly</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">❌ Common Pitfalls</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Mutating the original component</li>
                <li>• Creating HOCs in render method</li>
                <li>• Not passing through props</li>
                <li>• Overusing HOCs for simple logic</li>
                <li>• Breaking component tree in DevTools</li>
                <li>• Creating too many wrapper divs</li>
                <li>• Ignoring performance implications</li>
                <li>• Poor error handling</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Modern Alternatives</h3>
            <p className="text-blue-700 text-sm">
              While HOCs are still useful, consider modern patterns like Custom Hooks, 
              Render Props, or Component Composition for many use cases. Custom Hooks 
              often provide better TypeScript support and easier testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOCDemo; 