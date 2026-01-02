import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Save,
  RefreshCw,
  Search,
  Timer,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus,
  Wifi,
  WifiOff,
  MousePointer,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Zap,
  Code,
  BookOpen
} from 'lucide-react';

// Custom Hook: useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Custom Hook: useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom Hook: useFetch
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Custom Hook: useToggle
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Custom Hook: useCounter
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return { count, increment, decrement, reset, set };
}

// Custom Hook: useOnlineStatus
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Custom Hook: useMouse
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Custom Hook: useClipboard
function useClipboard() {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, []);

  return { copied, copy };
}

// Custom Hook: useInterval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Custom Hook: useWindowSize
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const CustomHooksDemo: React.FC = () => {
  // Hook demonstrations
  const [name, setName] = useLocalStorage('demo-name', '');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: posts, loading, error, refetch } = useFetch<any[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const darkMode = useToggle(false);
  const counter = useCounter(0);
  const isOnline = useOnlineStatus();
  const mousePosition = useMouse();
  const { copied, copy } = useClipboard();
  const windowSize = useWindowSize();

  // Timer demo
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  useInterval(() => {
    setSeconds(s => s + 1);
  }, timerActive ? 1000 : null);

  const resetTimer = () => {
    setSeconds(0);
    setTimerActive(false);
  };

  const hooks = [
    {
      name: 'useLocalStorage',
      description: 'Persist state in localStorage with automatic serialization',
      code: `const [name, setName] = useLocalStorage('demo-name', '');`,
      features: ['Automatic serialization', 'Error handling', 'SSR safe']
    },
    {
      name: 'useDebounce',
      description: 'Delay state updates to reduce API calls and improve performance',
      code: `const debouncedValue = useDebounce(searchTerm, 500);`,
      features: ['Configurable delay', 'Automatic cleanup', 'Performance optimization']
    },
    {
      name: 'useFetch',
      description: 'Simplified data fetching with loading states and error handling',
      code: `const { data, loading, error, refetch } = useFetch(url);`,
      features: ['Loading states', 'Error handling', 'Refetch capability']
    },
    {
      name: 'useToggle',
      description: 'Boolean state management with convenient toggle methods',
      code: `const { value, toggle, setTrue, setFalse } = useToggle();`,
      features: ['Multiple setters', 'Optimized callbacks', 'Simple API']
    },
    {
      name: 'useCounter',
      description: 'Counter state with increment, decrement, and reset functionality',
      code: `const { count, increment, decrement, reset } = useCounter(0);`,
      features: ['Multiple operations', 'Custom initial value', 'Reset capability']
    },
    {
      name: 'useOnlineStatus',
      description: 'Track network connectivity status in real-time',
      code: `const isOnline = useOnlineStatus();`,
      features: ['Real-time updates', 'Event listeners', 'Browser API integration']
    },
    {
      name: 'useMouse',
      description: 'Track mouse position coordinates across the viewport',
      code: `const { x, y } = useMouse();`,
      features: ['Real-time tracking', 'Global mouse position', 'Event cleanup']
    },
    {
      name: 'useClipboard',
      description: 'Copy text to clipboard with success feedback',
      code: `const { copied, copy } = useClipboard();`,
      features: ['Async clipboard API', 'Success feedback', 'Error handling']
    },
    {
      name: 'useInterval',
      description: 'Declarative interval hook with automatic cleanup',
      code: `useInterval(() => setCount(c => c + 1), 1000);`,
      features: ['Declarative API', 'Automatic cleanup', 'Dynamic delay']
    },
    {
      name: 'useWindowSize',
      description: 'Track window dimensions with automatic updates on resize',
      code: `const { width, height } = useWindowSize();`,
      features: ['Responsive design', 'Real-time updates', 'Performance optimized']
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode.value ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${
        darkMode.value ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Custom Hooks Demo</h1>
              <p className={`text-lg ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                Explore reusable custom hooks for common React patterns and functionality
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                darkMode.value ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Offline</span>
                  </>
                )}
              </div>
              <button
                onClick={darkMode.toggle}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode.value 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode.value ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* useLocalStorage Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Save className="w-5 h-5 mr-2 text-blue-500" />
              useLocalStorage Demo
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (persisted in localStorage)"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode.value 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <p className={`text-sm ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                Value persists across page reloads: <strong>{name || 'No name set'}</strong>
              </p>
            </div>
          </div>

          {/* useDebounce Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-500" />
              useDebounce Demo
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search (debounced)"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode.value 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className={`text-sm ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Current: <strong>{searchTerm}</strong></p>
                <p>Debounced (500ms): <strong>{debouncedSearchTerm}</strong></p>
              </div>
            </div>
          </div>

          {/* useFetch Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2 text-purple-500" />
              useFetch Demo
            </h3>
            <div className="space-y-4">
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refetch Posts</span>
              </button>
              {loading && <p className="text-purple-500">Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {posts && (
                <div className="space-y-2">
                  <p className={`text-sm ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loaded {posts.length} posts:
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {posts.map((post) => (
                      <div key={post.id} className={`text-xs p-2 rounded ${
                        darkMode.value ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {post.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* useToggle Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              {darkMode.value ? (
                <ToggleRight className="w-5 h-5 mr-2 text-yellow-500" />
              ) : (
                <ToggleLeft className="w-5 h-5 mr-2 text-gray-500" />
              )}
              useToggle Demo
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={darkMode.toggle}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode.value 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Toggle Dark Mode
                </button>
                <button
                  onClick={darkMode.setTrue}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Set True
                </button>
                <button
                  onClick={darkMode.setFalse}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Set False
                </button>
              </div>
              <p className={`text-sm ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                Current state: <strong>{darkMode.value ? 'Dark' : 'Light'}</strong>
              </p>
            </div>
          </div>

          {/* useCounter Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-500" />
              useCounter Demo
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={counter.decrement}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-bold w-16 text-center">{counter.count}</span>
                <button
                  onClick={counter.increment}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={counter.reset}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => counter.set(10)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Set to 10
                </button>
              </div>
            </div>
          </div>

          {/* useInterval Demo */}
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Timer className="w-5 h-5 mr-2 text-orange-500" />
              useInterval Demo
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold mb-4">
                  {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      timerActive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {timerActive ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mouse Position & Clipboard Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MousePointer className="w-5 h-5 mr-2 text-indigo-500" />
              useMouse Demo
            </h3>
            <div className="space-y-4">
              <p className={`${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                Mouse position: <strong>X: {mousePosition.x}, Y: {mousePosition.y}</strong>
              </p>
              <div className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${
                darkMode.value ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <p className={`text-sm ${darkMode.value ? 'text-gray-400' : 'text-gray-500'}`}>
                  Move your mouse around
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm ${
            darkMode.value ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Copy className="w-5 h-5 mr-2 text-teal-500" />
              useClipboard Demo
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => copy('Hello from custom hooks!')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
              <p className={`text-sm ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                Window size: <strong>{windowSize.width} × {windowSize.height}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Hooks Documentation */}
        <div className={`p-8 rounded-xl shadow-sm ${
          darkMode.value ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
            Custom Hooks Documentation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hooks.map((hook, index) => (
              <div key={index} className={`p-6 rounded-lg border ${
                darkMode.value ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
              }`}>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Code className="w-4 h-4 mr-2 text-purple-500" />
                  {hook.name}
                </h3>
                <p className={`mb-4 ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                  {hook.description}
                </p>
                <div className={`p-3 rounded-lg font-mono text-sm mb-4 ${
                  darkMode.value ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-green-600'
                }`}>
                  {hook.code}
                </div>
                <div className="flex flex-wrap gap-2">
                  {hook.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className={`px-2 py-1 text-xs rounded-full ${
                        darkMode.value 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className={`mt-8 p-8 rounded-xl shadow-sm ${
          darkMode.value ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-yellow-500" />
            Custom Hooks Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Do</h3>
              <ul className={`space-y-2 ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Start hook names with "use"</li>
                <li>• Keep hooks focused and single-purpose</li>
                <li>• Use useCallback for expensive operations</li>
                <li>• Handle cleanup in useEffect</li>
                <li>• Provide TypeScript types</li>
                <li>• Include error handling</li>
                <li>• Make hooks reusable and configurable</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">❌ Don't</h3>
              <ul className={`space-y-2 ${darkMode.value ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Call hooks conditionally</li>
                <li>• Use hooks inside loops or nested functions</li>
                <li>• Forget to handle edge cases</li>
                <li>• Make hooks too complex</li>
                <li>• Ignore memory leaks</li>
                <li>• Skip error boundaries</li>
                <li>• Overuse custom hooks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomHooksDemo; 