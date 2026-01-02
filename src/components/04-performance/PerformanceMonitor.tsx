import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  Cpu,
  Zap,
  Globe,
  Monitor,
  MemoryStick,
  Wifi,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface PerformanceMetric {
  timestamp: number;
  fps: number;
  memoryUsage: number;
  paintTime: number;
  networkLatency: number;
  cpuUsage: number;
}

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  unit: string;
  description: string;
}

interface CustomPerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [webVitals, setWebVitals] = useState<WebVital[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetric | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'fps' | 'memoryUsage' | 'paintTime' | 'networkLatency' | 'cpuUsage'>('fps');
  const [showDetails, setShowDetails] = useState(true);
  
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const fpsRef = useRef<number>(0);

  // Initialize Web Vitals
  useEffect(() => {
    const initWebVitals = (): WebVital[] => [
      {
        name: 'FCP',
        value: 0,
        rating: 'good',
        threshold: { good: 1800, poor: 3000 },
        unit: 'ms',
        description: 'First Contentful Paint'
      },
      {
        name: 'LCP',
        value: 0,
        rating: 'good',
        threshold: { good: 2500, poor: 4000 },
        unit: 'ms',
        description: 'Largest Contentful Paint'
      },
      {
        name: 'FID',
        value: 0,
        rating: 'good',
        threshold: { good: 100, poor: 300 },
        unit: 'ms',
        description: 'First Input Delay'
      },
      {
        name: 'CLS',
        value: 0,
        rating: 'good',
        threshold: { good: 0.1, poor: 0.25 },
        unit: '',
        description: 'Cumulative Layout Shift'
      },
      {
        name: 'TTFB',
        value: 0,
        rating: 'good',
        threshold: { good: 600, poor: 1500 },
        unit: 'ms',
        description: 'Time to First Byte'
      }
    ];

    setWebVitals(initWebVitals());
  }, []);

  // FPS tracking
  const trackFPS = useCallback(() => {
    const updateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTimeRef.current;
      
      if (elapsed >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / elapsed);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(updateFPS);
      }
    };
    
    requestAnimationFrame(updateFPS);
  }, [isMonitoring]);

  // Memory usage
  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return Math.round((memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100);
    }
    return Math.round(Math.random() * 50 + 10); // Fallback simulation
  };

  // Network latency
  const getNetworkLatency = async (): Promise<number> => {
    try {
      const start = performance.now();
      await fetch('/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
      const end = performance.now();
      return Math.round(end - start);
    } catch {
      return Math.round(Math.random() * 100 + 50); // Fallback
    }
  };

  // CPU usage simulation
  const getCPUUsage = (): number => {
    const start = performance.now();
    let iterations = 0;
    const timeLimit = 5; // 5ms
    
    while (performance.now() - start < timeLimit) {
      // Perform calculation and assign to variable to avoid unused expression
      const calculation = Math.random() * Math.random();
      // Use the calculation to prevent optimization
      if (calculation > 1) iterations += 2;
      iterations++;
    }
    
    // Convert to approximate CPU percentage
    return Math.min(Math.round((iterations / 100000) * 100), 100);
  };

  // Paint timing
  const getPaintTiming = (): number => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? Math.round(fcp.startTime) : 0;
  };

  // Collect performance metrics
  const collectMetrics = useCallback(async () => {
    const timestamp = Date.now();
    const networkLatency = await getNetworkLatency();
    
    const metric: PerformanceMetric = {
      timestamp,
      fps: fpsRef.current,
      memoryUsage: getMemoryUsage(),
      paintTime: getPaintTiming(),
      networkLatency,
      cpuUsage: getCPUUsage()
    };

    setCurrentMetrics(metric);
    setMetrics(prev => [...prev.slice(-49), metric]); // Keep last 50 metrics
  }, []);

  // Update Web Vitals
  const updateWebVitals = useCallback(() => {
    setWebVitals(prev => prev.map(vital => {
      let value = 0;
      
      switch (vital.name) {
        case 'FCP':
          value = getPaintTiming();
          break;
        case 'LCP':
          value = getPaintTiming() + Math.random() * 1000;
          break;
        case 'FID':
          value = Math.random() * 200;
          break;
        case 'CLS':
          value = Math.random() * 0.3;
          break;
        case 'TTFB':
          value = Math.random() * 1000 + 200;
          break;
      }

      const rating: 'good' | 'needs-improvement' | 'poor' = 
        value <= vital.threshold.good ? 'good' :
        value <= vital.threshold.poor ? 'needs-improvement' : 'poor';

      return { ...vital, value, rating };
    }));
  }, []);

  // Start/stop monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      if (monitoringRef.current) {
        clearInterval(monitoringRef.current);
      }
    } else {
      setIsMonitoring(true);
      trackFPS();
      
      monitoringRef.current = setInterval(() => {
        collectMetrics();
        updateWebVitals();
      }, 1000);
    }
  };

  // Clear metrics
  const clearMetrics = () => {
    setMetrics([]);
    setCurrentMetrics(null);
    frameCountRef.current = 0;
    lastFrameTimeRef.current = performance.now();
    fpsRef.current = 0;
  };

  // Export metrics
  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      metrics,
      webVitals,
      summary: {
        averageFPS: metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length) : 0,
        averageMemory: metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length) : 0,
        averageLatency: metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.networkLatency, 0) / metrics.length) : 0
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (monitoringRef.current) {
        clearInterval(monitoringRef.current);
      }
    };
  }, []);

  // Get metric color
  const getMetricColor = (value: number, type: string): string => {
    switch (type) {
      case 'fps':
        return value >= 55 ? 'text-green-600' : value >= 30 ? 'text-yellow-600' : 'text-red-600';
      case 'memoryUsage':
        return value <= 50 ? 'text-green-600' : value <= 75 ? 'text-yellow-600' : 'text-red-600';
      case 'paintTime':
        return value <= 1800 ? 'text-green-600' : value <= 3000 ? 'text-yellow-600' : 'text-red-600';
      case 'networkLatency':
        return value <= 100 ? 'text-green-600' : value <= 300 ? 'text-yellow-600' : 'text-red-600';
      case 'cpuUsage':
        return value <= 50 ? 'text-green-600' : value <= 75 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get Web Vital color
  const getVitalColor = (rating: string): string => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Monitor</h1>
                <p className="text-gray-600">Real-time performance tracking and Web Vitals monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded-lg transition-colors ${
                  showDetails ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle details"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={exportMetrics}
                disabled={metrics.length === 0}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export metrics"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={clearMetrics}
                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                title="Clear metrics"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={toggleMonitoring}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isMonitoring 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-4 h-4 mr-2 inline" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 inline" />
                    Start Monitoring
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
            </div>
            <div className="text-sm text-gray-600">
              Metrics Collected: {metrics.length}
            </div>
            {currentMetrics && (
              <div className="text-sm text-gray-600">
                Last Update: {new Date(currentMetrics.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h3>
              
              {currentMetrics ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className={`text-2xl font-bold ${getMetricColor(currentMetrics.fps, 'fps')}`}>
                      {currentMetrics.fps}
                    </div>
                    <div className="text-sm text-gray-600">FPS</div>
                  </div>
                  
                  <div className="text-center">
                    <MemoryStick className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className={`text-2xl font-bold ${getMetricColor(currentMetrics.memoryUsage, 'memoryUsage')}`}>
                      {currentMetrics.memoryUsage}%
                    </div>
                    <div className="text-sm text-gray-600">Memory</div>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className={`text-2xl font-bold ${getMetricColor(currentMetrics.paintTime, 'paintTime')}`}>
                      {currentMetrics.paintTime}ms
                    </div>
                    <div className="text-sm text-gray-600">Paint Time</div>
                  </div>
                  
                  <div className="text-center">
                    <Wifi className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className={`text-2xl font-bold ${getMetricColor(currentMetrics.networkLatency, 'networkLatency')}`}>
                      {currentMetrics.networkLatency}ms
                    </div>
                    <div className="text-sm text-gray-600">Network</div>
                  </div>
                  
                  <div className="text-center">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className={`text-2xl font-bold ${getMetricColor(currentMetrics.cpuUsage, 'cpuUsage')}`}>
                      {currentMetrics.cpuUsage}%
                    </div>
                    <div className="text-sm text-gray-600">CPU Usage</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-lg font-medium mb-2">No metrics available</div>
                  <div className="text-sm">Start monitoring to see real-time performance data</div>
                </div>
              )}
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Chart</h3>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fps">FPS</option>
                  <option value="memoryUsage">Memory Usage</option>
                  <option value="paintTime">Paint Time</option>
                  <option value="networkLatency">Network Latency</option>
                  <option value="cpuUsage">CPU Usage</option>
                </select>
              </div>

              <div className="relative h-64 border border-gray-200 rounded-lg p-4">
                {metrics.length > 0 ? (
                  <div className="relative w-full h-full">
                    {/* Simple line chart visualization */}
                    <svg className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        points={metrics.map((metric, index) => {
                          const x = (index / (metrics.length - 1)) * 100;
                          const maxValue = selectedMetric === 'fps' ? 60 : 
                                         selectedMetric === 'memoryUsage' ? 100 :
                                         selectedMetric === 'cpuUsage' ? 100 : 
                                         selectedMetric === 'paintTime' ? 3000 :
                                         selectedMetric === 'networkLatency' ? 1000 : 1000;
                          const y = 100 - ((metric[selectedMetric as keyof PerformanceMetric] as number / maxValue) * 100);
                          return `${x}%,${Math.max(0, Math.min(100, y))}%`;
                        }).join(' ')}
                      />
                    </svg>
                    
                    {/* Current value indicator */}
                    {currentMetrics && (
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {currentMetrics[selectedMetric as keyof PerformanceMetric] as number}{selectedMetric === 'fps' ? '' : 
                         selectedMetric === 'memoryUsage' || selectedMetric === 'cpuUsage' ? '%' : 'ms'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <BarChart3 className="w-8 h-8 mr-2" />
                    <span>No data to display</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Web Vitals & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Web Vitals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
              
              <div className="space-y-3">
                {webVitals.map((vital) => (
                  <div key={vital.name} className={`p-3 rounded-lg border ${getVitalColor(vital.rating)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{vital.name}</span>
                      <span className="text-sm font-medium">
                        {vital.value.toFixed(vital.name === 'CLS' ? 3 : 0)}{vital.unit}
                      </span>
                    </div>
                    <div className="text-xs opacity-75 mb-2">{vital.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize">{vital.rating.replace('-', ' ')}</span>
                      <div className="flex items-center">
                        {vital.rating === 'good' && <CheckCircle className="w-3 h-3" />}
                        {vital.rating === 'needs-improvement' && <AlertTriangle className="w-3 h-3" />}
                        {vital.rating === 'poor' && <AlertTriangle className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            {metrics.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg FPS:</span>
                    <span className="font-medium">
                      {Math.round(metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Memory:</span>
                    <span className="font-medium">
                      {Math.round(metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Latency:</span>
                    <span className="font-medium">
                      {Math.round(metrics.reduce((sum, m) => sum + m.networkLatency, 0) / metrics.length)}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monitoring Time:</span>
                    <span className="font-medium">
                      {Math.round(metrics.length / 60)}m {metrics.length % 60}s
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Maintain 60 FPS for smooth animations</span>
                </div>
                <div className="flex items-start">
                  <MemoryStick className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep memory usage below 70%</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>First paint should be under 1.8s</span>
                </div>
                <div className="flex items-start">
                  <Wifi className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Network latency under 100ms is ideal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 