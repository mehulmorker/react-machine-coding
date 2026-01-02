import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Trash2,
  Settings,
  BarChart3,
  Clock,
  Cpu,
  MemoryStick,
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Monitor
} from 'lucide-react';

interface MemoryData {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface LeakPattern {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

const MemoryLeakDemo: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [memoryData, setMemoryData] = useState<MemoryData[]>([]);
  const [currentMemory, setCurrentMemory] = useState<MemoryData | null>(null);
  const [leakPatterns, setLeakPatterns] = useState<LeakPattern[]>([
    {
      id: 'event-listeners',
      name: 'Event Listeners Leak',
      description: 'Adds event listeners without proper cleanup',
      isActive: false,
      severity: 'high',
      impact: 'DOM event listeners accumulate over time'
    },
    {
      id: 'intervals',
      name: 'Interval/Timeout Leak',
      description: 'Creates intervals and timeouts without clearing them',
      isActive: false,
      severity: 'medium',
      impact: 'Background timers continue running after component unmount'
    },
    {
      id: 'closures',
      name: 'Closure References',
      description: 'Creates closures that hold references to large objects',
      isActive: false,
      severity: 'medium',
      impact: 'Large objects remain in memory due to closure references'
    },
    {
      id: 'global-variables',
      name: 'Global Variables',
      description: 'Stores data in global variables without cleanup',
      isActive: false,
      severity: 'low',
      impact: 'Global scope pollution prevents garbage collection'
    },
    {
      id: 'dom-references',
      name: 'DOM References',
      description: 'Holds references to DOM nodes that prevent cleanup',
      isActive: false,
      severity: 'high',
      impact: 'DOM nodes and their children cannot be garbage collected'
    }
  ]);

  const monitoringRef = useRef<NodeJS.Timeout | null>(null);
  const leakDataRef = useRef<{ [key: string]: any }>({});
  const eventListenersRef = useRef<Array<() => void>>([]);
  const intervalsRef = useRef<Array<NodeJS.Timeout>>([]);
  const domReferencesRef = useRef<HTMLElement[]>([]);

  // Memory monitoring
  useEffect(() => {
    if (isMonitoring) {
      monitoringRef.current = setInterval(() => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const data: MemoryData = {
            timestamp: Date.now(),
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          };
          
          setCurrentMemory(data);
          setMemoryData(prev => [...prev.slice(-29), data]); // Keep last 30 data points
        }
      }, 1000);
    } else if (monitoringRef.current) {
      clearInterval(monitoringRef.current);
      monitoringRef.current = null;
    }

    return () => {
      if (monitoringRef.current) {
        clearInterval(monitoringRef.current);
      }
    };
  }, [isMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up event listeners
      eventListenersRef.current.forEach(cleanup => cleanup());
      eventListenersRef.current = [];
      
      // Clean up intervals
      intervalsRef.current.forEach(interval => clearInterval(interval));
      intervalsRef.current = [];
      
      // Clear leak data
      leakDataRef.current = {};
      
      // Clear DOM references
      domReferencesRef.current = [];
    };
  }, []);

  // Leak pattern implementations
  const startEventListenerLeak = useCallback(() => {
    const handleClick = () => {
      // Create a large object that gets captured in closure
      const largeData = new Array(100000).fill(0).map((_, i) => ({ id: i, data: `data-${i}` }));
      leakDataRef.current[`click-${Date.now()}`] = largeData;
    };

    const handleScroll = () => {
      const largeData = new Array(50000).fill(0).map((_, i) => ({ id: i, scroll: Date.now() }));
      leakDataRef.current[`scroll-${Date.now()}`] = largeData;
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    const cleanup = () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };

    eventListenersRef.current.push(cleanup);
  }, []);

  const startIntervalLeak = useCallback(() => {
    const interval1 = setInterval(() => {
      const largeArray = new Array(10000).fill(0).map((_, i) => ({ 
        id: i, 
        timestamp: Date.now(),
        data: `interval-data-${i}`
      }));
      leakDataRef.current[`interval1-${Date.now()}`] = largeArray;
    }, 500);

    const interval2 = setInterval(() => {
      const largeObject = {
        data: new Array(5000).fill(0).map((_, i) => ({ value: Math.random() * 1000 })),
        timestamp: Date.now()
      };
      leakDataRef.current[`interval2-${Date.now()}`] = largeObject;
    }, 300);

    intervalsRef.current.push(interval1, interval2);
  }, []);

  const startClosureLeak = useCallback(() => {
    const createClosure = () => {
      const largeData = new Array(50000).fill(0).map((_, i) => ({
        id: i,
        value: Math.random(),
        description: `Large data object ${i} with substantial content`
      }));

      return () => {
        // This closure holds a reference to largeData
        leakDataRef.current[`closure-${Date.now()}`] = largeData;
      };
    };

    // Create multiple closures
    for (let i = 0; i < 10; i++) {
      const closure = createClosure();
      setTimeout(closure, i * 100);
    }
  }, []);

  const startGlobalVariableLeak = useCallback(() => {
    // Add data to global scope
    if (typeof window !== 'undefined') {
      (window as any).leakData = (window as any).leakData || {};
      const timestamp = Date.now();
      (window as any).leakData[`global-${timestamp}`] = {
        largeArray: new Array(30000).fill(0).map((_, i) => ({ 
          id: i, 
          value: Math.random(),
          timestamp 
        })),
        metadata: {
          created: timestamp,
          size: 30000,
          type: 'global-leak'
        }
      };
    }
  }, []);

  const startDOMReferenceLeak = useCallback(() => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    
    // Create many DOM elements
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.textContent = `Leaked element ${i} with content that uses memory`;
      element.dataset.index = i.toString();
      container.appendChild(element);
    }
    
    document.body.appendChild(container);
    domReferencesRef.current.push(container);
    
    // Keep references to these elements
    const elements = Array.from(container.children);
    leakDataRef.current[`dom-${Date.now()}`] = elements;
  }, []);

  const toggleLeakPattern = (patternId: string) => {
    setLeakPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        const newIsActive = !pattern.isActive;
        
        if (newIsActive) {
          // Start the leak
          switch (patternId) {
            case 'event-listeners':
              startEventListenerLeak();
              break;
            case 'intervals':
              startIntervalLeak();
              break;
            case 'closures':
              startClosureLeak();
              break;
            case 'global-variables':
              startGlobalVariableLeak();
              break;
            case 'dom-references':
              startDOMReferenceLeak();
              break;
          }
        } else {
          // Stop the leak
          switch (patternId) {
            case 'event-listeners':
              eventListenersRef.current.forEach(cleanup => cleanup());
              eventListenersRef.current = [];
              break;
            case 'intervals':
              intervalsRef.current.forEach(interval => clearInterval(interval));
              intervalsRef.current = [];
              break;
            case 'dom-references':
              domReferencesRef.current.forEach(element => {
                if (element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              });
              domReferencesRef.current = [];
              break;
          }
        }
        
        return { ...pattern, isActive: newIsActive };
      }
      return pattern;
    }));
  };

  const cleanupAllLeaks = () => {
    // Stop all leak patterns
    setLeakPatterns(prev => prev.map(pattern => ({ ...pattern, isActive: false })));
    
    // Clean up event listeners
    eventListenersRef.current.forEach(cleanup => cleanup());
    eventListenersRef.current = [];
    
    // Clean up intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Clean up DOM references
    domReferencesRef.current.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    domReferencesRef.current = [];
    
    // Clear leak data
    leakDataRef.current = {};
    
    // Clear global data
    if (typeof window !== 'undefined') {
      delete (window as any).leakData;
    }
    
    // Suggest garbage collection
    if ('gc' in window) {
      (window as any).gc();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Memory Leak Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about common memory leak patterns, detection techniques, and prevention strategies
            in React applications through interactive demonstrations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isMonitoring
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isMonitoring ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              
              <button
                onClick={cleanupAllLeaks}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Cleanup All Leaks
              </button>
            </div>

            {currentMemory && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <MemoryStick className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-gray-600">Used: </span>
                  <span className="font-medium">{formatBytes(currentMemory.usedJSHeapSize)}</span>
                </div>
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium">{formatBytes(currentMemory.totalJSHeapSize)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Memory Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Memory Usage Over Time
              </h3>
              
              {memoryData.length > 0 ? (
                <div className="h-64 relative">
                  <svg className="w-full h-full">
                    {/* Grid lines */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={`${(i * 25)}%`}
                        x2="100%"
                        y2={`${(i * 25)}%`}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Memory usage line */}
                    {memoryData.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={memoryData.map((data, index) => {
                          const x = (index / (memoryData.length - 1)) * 100;
                          const maxMemory = Math.max(...memoryData.map(d => d.usedJSHeapSize));
                          const y = 100 - (data.usedJSHeapSize / maxMemory) * 100;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}
                  </svg>
                  
                  <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                    Memory Usage (MB)
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <div>Start monitoring to see memory usage</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Memory Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Statistics</h3>
              
              {currentMemory ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Used Heap</span>
                    <span className="font-medium text-blue-900">
                      {formatBytes(currentMemory.usedJSHeapSize)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Total Heap</span>
                    <span className="font-medium text-green-900">
                      {formatBytes(currentMemory.totalJSHeapSize)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700">Heap Limit</span>
                    <span className="font-medium text-purple-900">
                      {formatBytes(currentMemory.jsHeapSizeLimit)}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Memory Usage</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(currentMemory.usedJSHeapSize / currentMemory.totalJSHeapSize) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((currentMemory.usedJSHeapSize / currentMemory.totalJSHeapSize) * 100)}% used
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm">No memory data available</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leak Patterns */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Memory Leak Patterns</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leakPatterns.map((pattern) => (
              <div key={pattern.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {pattern.isActive ? (
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pattern.severity)}`}>
                      {pattern.severity}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{pattern.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-1">Impact:</div>
                    <div className="text-xs text-gray-600">{pattern.impact}</div>
                  </div>
                  
                  <button
                    onClick={() => toggleLeakPattern(pattern.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      pattern.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {pattern.isActive ? 'Stop Leak' : 'Start Leak'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Memory Leak Prevention Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Do's
              </h3>
              <ul className="space-y-3">
                {[
                  'Clean up event listeners in useEffect cleanup',
                  'Clear intervals and timeouts on component unmount',
                  'Use WeakMap and WeakSet for temporary references',
                  'Avoid storing large objects in global scope',
                  'Use React DevTools Profiler to monitor performance',
                  'Implement proper cleanup in custom hooks'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Don'ts
              </h3>
              <ul className="space-y-3">
                {[
                  "Don't forget to remove event listeners",
                  "Don't leave intervals running after unmount",
                  "Don't store DOM references in closures",
                  "Don't create circular references unnecessarily",
                  "Don't ignore warnings in React DevTools",
                  "Don't assume garbage collection will handle everything"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLeakDemo; 