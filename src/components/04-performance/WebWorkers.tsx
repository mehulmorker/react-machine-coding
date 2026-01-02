import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cpu,
  Play,
  Pause,
  Square,
  Settings,
  Zap,
  Clock,
  Activity,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface WorkerTask {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  result?: any;
  startTime?: number;
  endTime?: number;
  progress?: number;
}

interface PerformanceMetrics {
  mainThreadTime: number;
  workerTime: number;
  improvement: number;
}

const WebWorkers: React.FC = () => {
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string>('fibonacci');
  const [workerMessages, setWorkerMessages] = useState<Array<{ type: 'sent' | 'received', message: string, timestamp: number }>>([]);
  
  const workersRef = useRef<{ [key: string]: Worker }>({});
  const taskIdRef = useRef(0);

  // Check Web Worker support
  useEffect(() => {
    setIsSupported(typeof Worker !== 'undefined');
  }, []);

  // Cleanup workers on unmount
  useEffect(() => {
    return () => {
      Object.values(workersRef.current).forEach(worker => {
        worker.terminate();
      });
      workersRef.current = {};
    };
  }, []);

  // Create a Web Worker for CPU-intensive tasks
  const createCPUWorker = useCallback(() => {
    const workerCode = `
      self.onmessage = function(e) {
        const { type, data, taskId } = e.data;
        
        try {
          switch (type) {
            case 'fibonacci':
              const result = fibonacci(data.n);
              self.postMessage({ type: 'result', taskId, result });
              break;
              
            case 'primeNumbers':
              const primes = findPrimes(data.max);
              self.postMessage({ type: 'result', taskId, result: primes });
              break;
              
            case 'sortLargeArray':
              const sorted = bubbleSort([...data.array]);
              self.postMessage({ type: 'result', taskId, result: sorted });
              break;
              
            case 'matrixMultiplication':
              const matrix = multiplyMatrices(data.matrix1, data.matrix2);
              self.postMessage({ type: 'result', taskId, result: matrix });
              break;
              
            default:
              throw new Error('Unknown task type');
          }
        } catch (error) {
          self.postMessage({ type: 'error', taskId, error: error.message });
        }
      };
      
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      function findPrimes(max) {
        const primes = [];
        for (let i = 2; i <= max; i++) {
          let isPrime = true;
          for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) primes.push(i);
        }
        return primes;
      }
      
      function bubbleSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
          }
        }
        return arr;
      }
      
      function multiplyMatrices(a, b) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
          result[i] = [];
          for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
              sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
          }
        }
        return result;
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  }, []);

  // Create a Web Worker for progress tracking
  const createProgressWorker = useCallback(() => {
    const workerCode = `
      self.onmessage = function(e) {
        const { type, data, taskId } = e.data;
        
        if (type === 'longRunningTask') {
          const total = data.iterations;
          let completed = 0;
          
          const interval = setInterval(() => {
            completed++;
            const progress = (completed / total) * 100;
            
            self.postMessage({ 
              type: 'progress', 
              taskId, 
              progress: Math.round(progress),
              completed,
              total
            });
            
            if (completed >= total) {
              clearInterval(interval);
              self.postMessage({ 
                type: 'result', 
                taskId, 
                result: 'Task completed successfully!' 
              });
            }
          }, 100);
        }
      };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  }, []);

  // Execute task in main thread (for comparison)
  const executeInMainThread = useCallback(async (taskType: string, data: any): Promise<any> => {
    const startTime = performance.now();
    
    switch (taskType) {
      case 'fibonacci':
        const fibonacci = (n: number): number => {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        };
        const result = fibonacci(data.n);
        const endTime = performance.now();
        return { result, time: endTime - startTime };
        
      case 'primeNumbers':
        const primes = [];
        for (let i = 2; i <= data.max; i++) {
          let isPrime = true;
          for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) primes.push(i);
        }
        const endTime2 = performance.now();
        return { result: primes, time: endTime2 - startTime };
        
      default:
        throw new Error('Unknown task type');
    }
  }, []);

  // Execute task in Web Worker
  const executeInWorker = useCallback((taskType: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const taskId = `task-${++taskIdRef.current}`;
      const worker = createCPUWorker();
      workersRef.current[taskId] = worker;
      
      const startTime = performance.now();
      
      worker.onmessage = (e) => {
        const { type, result, error } = e.data;
        const endTime = performance.now();
        
        if (type === 'result') {
          worker.terminate();
          delete workersRef.current[taskId];
          resolve({ result, time: endTime - startTime });
        } else if (type === 'error') {
          worker.terminate();
          delete workersRef.current[taskId];
          reject(new Error(error));
        }
      };
      
      worker.onerror = (error) => {
        worker.terminate();
        delete workersRef.current[taskId];
        reject(error);
      };
      
      // Log message
      setWorkerMessages(prev => [...prev, {
        type: 'sent',
        message: `Task: ${taskType} with data: ${JSON.stringify(data)}`,
        timestamp: Date.now()
      }]);
      
      worker.postMessage({ type: taskType, data, taskId });
    });
  }, [createCPUWorker]);

  // Run performance comparison
  const runPerformanceComparison = useCallback(async () => {
    const testData = { n: 40 }; // Fibonacci of 40
    
    try {
      // Run in main thread
      const mainThreadResult = await executeInMainThread('fibonacci', testData);
      
      // Run in worker
      const workerResult = await executeInWorker('fibonacci', testData);
      
      const improvement = ((mainThreadResult.time - workerResult.time) / mainThreadResult.time) * 100;
      
      setPerformanceMetrics({
        mainThreadTime: mainThreadResult.time,
        workerTime: workerResult.time,
        improvement: improvement
      });
    } catch (error) {
      console.error('Performance comparison failed:', error);
    }
  }, [executeInMainThread, executeInWorker]);

  // Start a new task
  const startTask = useCallback((taskType: string, taskName: string, data: any) => {
    const taskId = `task-${++taskIdRef.current}`;
    const newTask: WorkerTask = {
      id: taskId,
      name: taskName,
      description: `Running ${taskType} with parameters: ${JSON.stringify(data)}`,
      status: 'running',
      startTime: Date.now()
    };
    
    setTasks(prev => [...prev, newTask]);
    
    if (taskType === 'longRunningTask') {
      const worker = createProgressWorker();
      workersRef.current[taskId] = worker;
      
      worker.onmessage = (e) => {
        const { type, progress, result, completed, total } = e.data;
        
        if (type === 'progress') {
          setTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { ...task, progress }
              : task
          ));
        } else if (type === 'result') {
          setTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { ...task, status: 'completed', result, endTime: Date.now() }
              : task
          ));
          worker.terminate();
          delete workersRef.current[taskId];
        }
      };
      
      worker.postMessage({ type: 'longRunningTask', data, taskId });
    } else {
      executeInWorker(taskType, data)
        .then((result) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { ...task, status: 'completed', result: result.result, endTime: Date.now() }
              : task
          ));
          
          setWorkerMessages(prev => [...prev, {
            type: 'received',
            message: `Result: ${JSON.stringify(result.result).substring(0, 100)}...`,
            timestamp: Date.now()
          }]);
        })
        .catch((error) => {
          setTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { ...task, status: 'error', result: error.message, endTime: Date.now() }
              : task
          ));
        });
    }
  }, [createProgressWorker, executeInWorker]);

  // Stop a task
  const stopTask = useCallback((taskId: string) => {
    const worker = workersRef.current[taskId];
    if (worker) {
      worker.terminate();
      delete workersRef.current[taskId];
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'error', result: 'Task terminated', endTime: Date.now() }
        : task
    ));
  }, []);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    Object.values(workersRef.current).forEach(worker => {
      worker.terminate();
    });
    workersRef.current = {};
    setTasks([]);
    setWorkerMessages([]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const demos = [
    {
      id: 'fibonacci',
      name: 'Fibonacci Calculation',
      description: 'Calculate Fibonacci numbers using recursive approach',
      data: { n: 35 },
      taskName: 'Fibonacci(35)'
    },
    {
      id: 'primeNumbers',
      name: 'Prime Number Generation',
      description: 'Find all prime numbers up to a given limit',
      data: { max: 10000 },
      taskName: 'Primes up to 10,000'
    },
    {
      id: 'sortLargeArray',
      name: 'Large Array Sorting',
      description: 'Sort a large array using bubble sort algorithm',
      data: { array: Array.from({ length: 5000 }, () => Math.floor(Math.random() * 1000)) },
      taskName: 'Sort 5,000 elements'
    },
    {
      id: 'longRunningTask',
      name: 'Progress Tracking',
      description: 'Long-running task with progress updates',
      data: { iterations: 50 },
      taskName: 'Progress Demo'
    }
  ];

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Web Workers Not Supported</h1>
          <p className="text-gray-600">
            Your browser doesn't support Web Workers. Please use a modern browser to view this demo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Cpu className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Web Workers Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore background processing with Web Workers for CPU-intensive tasks, thread management,
            and non-blocking user interfaces.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Demo Controls</h2>
            <div className="flex space-x-3">
              <button
                onClick={runPerformanceComparison}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance Test
              </button>
              <button
                onClick={clearTasks}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Clear All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demos.map((demo) => (
              <div key={demo.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{demo.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{demo.description}</p>
                <button
                  onClick={() => startTask(demo.id, demo.taskName, demo.data)}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Start Task
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Active Tasks
              </h3>
              
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Cpu className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div>No tasks running. Start a demo to see Web Workers in action!</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.name}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.status === 'running' && (
                            <button
                              onClick={() => stopTask(task.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Square className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {task.progress !== undefined && (
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {task.result && task.status === 'completed' && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                          <strong>Result:</strong> {typeof task.result === 'object' 
                            ? JSON.stringify(task.result).substring(0, 100) + '...' 
                            : task.result}
                        </div>
                      )}
                      
                      {task.startTime && task.endTime && (
                        <div className="mt-2 text-xs text-gray-500">
                          Execution time: {task.endTime - task.startTime}ms
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats and Messages */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            {performanceMetrics && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-700">Main Thread</span>
                    <span className="font-medium text-red-900">
                      {performanceMetrics.mainThreadTime.toFixed(2)}ms
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Web Worker</span>
                    <span className="font-medium text-green-900">
                      {performanceMetrics.workerTime.toFixed(2)}ms
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Improvement</span>
                    <span className="font-medium text-blue-900">
                      {performanceMetrics.improvement > 0 ? '+' : ''}{performanceMetrics.improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Worker Messages */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Worker Messages
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {workerMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm">No messages yet</div>
                  </div>
                ) : (
                  workerMessages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded text-xs ${
                      msg.type === 'sent' ? 'bg-blue-50 text-blue-900' : 'bg-green-50 text-green-900'
                    }`}>
                      <div className="flex items-center mb-1">
                        {msg.type === 'sent' ? (
                          <Upload className="w-3 h-3 mr-1" />
                        ) : (
                          <Download className="w-3 h-3 mr-1" />
                        )}
                        <span className="font-medium">
                          {msg.type === 'sent' ? 'Sent' : 'Received'}
                        </span>
                        <span className="ml-auto text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Workers</span>
                  <span className="font-medium">{Object.keys(workersRef.current).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium">{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Running</span>
                  <span className="font-medium">{tasks.filter(t => t.status === 'running').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Web Workers Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Do's
              </h3>
              <ul className="space-y-3">
                {[
                  'Use for CPU-intensive computations',
                  'Transfer data efficiently (use transferable objects)',
                  'Handle worker errors and termination properly',
                  'Use structured clone algorithm for data transfer',
                  'Implement progress reporting for long tasks',
                  'Terminate workers when no longer needed'
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
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                Don'ts
              </h3>
              <ul className="space-y-3">
                {[
                  "Don't access DOM directly from workers",
                  "Don't use workers for simple synchronous tasks",
                  "Don't forget to handle worker errors",
                  "Don't transfer large objects unnecessarily",
                  "Don't create too many concurrent workers",
                  "Don't ignore browser compatibility"
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

export default WebWorkers; 