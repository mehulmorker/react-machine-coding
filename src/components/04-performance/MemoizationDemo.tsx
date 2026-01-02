import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  Zap,
  BarChart3,
  Clock,
  Cpu,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface MemoizationMetrics {
  componentName: string;
  renderCount: number;
  renderTime: number;
  memoryUsage: number;
  lastRenderReason: string;
  isMemoized: boolean;
}

interface ExpensiveCalculationProps {
  numbers: number[];
  multiplier: number;
  isMemoized: boolean;
  onMetricsUpdate: (metrics: Partial<MemoizationMetrics>) => void;
}

interface ListItemProps {
  item: { id: number; name: string; value: number };
  onClick: (id: number) => void;
  isMemoized: boolean;
  onRender: () => void;
}

// Non-memoized expensive calculation component
const ExpensiveCalculationNormal: React.FC<ExpensiveCalculationProps> = ({ 
  numbers, 
  multiplier, 
  onMetricsUpdate 
}) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  renderStart.current = performance.now();
  renderCount.current += 1;

  // Expensive calculation without memoization
  const expensiveResult = numbers.reduce((sum, num) => {
    // Simulate expensive computation
    for (let i = 0; i < 100000; i++) {
      Math.sqrt(num * multiplier + i);
    }
    return sum + num * multiplier;
  }, 0);

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    onMetricsUpdate({
      componentName: 'ExpensiveCalculation',
      renderCount: renderCount.current,
      renderTime,
      memoryUsage: Math.random() * 50 + 10, // Simulated
      lastRenderReason: 'No memoization',
      isMemoized: false
    });
  });

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-red-800">Without Memoization</h4>
        <div className="text-xs text-red-600">Renders: {renderCount.current}</div>
      </div>
      <div className="text-2xl font-bold text-red-700">{expensiveResult.toLocaleString()}</div>
      <div className="text-sm text-red-600 mt-1">
        Calculation performed on every render
      </div>
    </div>
  );
};

// Memoized expensive calculation component
const ExpensiveCalculationMemoized: React.FC<ExpensiveCalculationProps> = ({ 
  numbers, 
  multiplier, 
  onMetricsUpdate 
}) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  renderStart.current = performance.now();
  renderCount.current += 1;

  // Expensive calculation with useMemo
  const expensiveResult = useMemo(() => {
    const result = numbers.reduce((sum, num) => {
      // Simulate expensive computation
      for (let i = 0; i < 100000; i++) {
        Math.sqrt(num * multiplier + i);
      }
      return sum + num * multiplier;
    }, 0);
    return result;
  }, [numbers, multiplier]);

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    onMetricsUpdate({
      componentName: 'ExpensiveCalculationMemoized',
      renderCount: renderCount.current,
      renderTime,
      memoryUsage: Math.random() * 20 + 5, // Simulated - lower usage
      lastRenderReason: 'useMemo optimization',
      isMemoized: true
    });
  });

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-green-800">With useMemo</h4>
        <div className="text-xs text-green-600">Renders: {renderCount.current}</div>
      </div>
      <div className="text-2xl font-bold text-green-700">{expensiveResult.toLocaleString()}</div>
      <div className="text-sm text-green-600 mt-1">
        Calculation memoized based on dependencies
      </div>
    </div>
  );
};

// Non-memoized list item
const ListItemNormal: React.FC<ListItemProps> = ({ item, onClick, onRender }) => {
  onRender();
  
  return (
    <div 
      className="p-3 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100 transition-colors"
      onClick={() => onClick(item.id)}
    >
      <div className="font-medium text-red-800">{item.name}</div>
      <div className="text-sm text-red-600">Value: {item.value}</div>
    </div>
  );
};

// Memoized list item
const ListItemMemoized = memo<ListItemProps>(({ item, onClick, onRender }) => {
  onRender();
  
  return (
    <div 
      className="p-3 bg-green-50 border border-green-200 rounded cursor-pointer hover:bg-green-100 transition-colors"
      onClick={() => onClick(item.id)}
    >
      <div className="font-medium text-green-800">{item.name}</div>
      <div className="text-sm text-green-600">Value: {item.value}</div>
    </div>
  );
});

ListItemMemoized.displayName = 'ListItemMemoized';

const MemoizationDemo: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isAutoIncrement, setIsAutoIncrement] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [activeTab, setActiveTab] = useState<'calculation' | 'components' | 'callbacks'>('calculation');
  
  const [metrics, setMetrics] = useState<{ [key: string]: MemoizationMetrics }>({});
  const [renderCounts, setRenderCounts] = useState<{ [key: string]: number }>({
    normalList: 0,
    memoizedList: 0
  });

  const autoIncrementRef = useRef<NodeJS.Timeout | null>(null);

  // Sample data for calculations
  const numbers = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);
  
  // Sample data for list rendering
  const listItems = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000)
    })), []
  );

  // Auto increment effect
  useEffect(() => {
    if (isAutoIncrement) {
      autoIncrementRef.current = setInterval(() => {
        setCounter(prev => prev + 1);
      }, 1000);
    } else {
      if (autoIncrementRef.current) {
        clearInterval(autoIncrementRef.current);
      }
    }

    return () => {
      if (autoIncrementRef.current) {
        clearInterval(autoIncrementRef.current);
      }
    };
  }, [isAutoIncrement]);

  // Handle metrics updates
  const handleMetricsUpdate = useCallback((componentName: string, newMetrics: Partial<MemoizationMetrics>) => {
    setMetrics(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        ...newMetrics
      } as MemoizationMetrics
    }));
  }, []);

  // Non-memoized click handler (recreated on every render)
  const handleItemClickNormal = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Memoized click handler with useCallback
  const handleItemClickMemoized = useCallback((id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Render counters
  const handleNormalListRender = useCallback(() => {
    setRenderCounts(prev => ({ ...prev, normalList: prev.normalList + 1 }));
  }, []);

  const handleMemoizedListRender = useCallback(() => {
    setRenderCounts(prev => ({ ...prev, memoizedList: prev.memoizedList + 1 }));
  }, []);

  // Reset all metrics
  const resetMetrics = useCallback(() => {
    setMetrics({});
    setRenderCounts({ normalList: 0, memoizedList: 0 });
    setCounter(0);
    setSelectedItems(new Set());
  }, []);

  // Calculate performance comparison
  const performanceComparison = useMemo(() => {
    const normalMetrics = metrics['ExpensiveCalculation'];
    const memoizedMetrics = metrics['ExpensiveCalculationMemoized'];
    
    if (!normalMetrics || !memoizedMetrics) return null;
    
    const renderTimeDiff = normalMetrics.renderTime - memoizedMetrics.renderTime;
    const memoryDiff = normalMetrics.memoryUsage - memoizedMetrics.memoryUsage;
    const renderCountDiff = normalMetrics.renderCount - memoizedMetrics.renderCount;
    
    return {
      renderTimeImprovement: renderTimeDiff > 0 ? ((renderTimeDiff / normalMetrics.renderTime) * 100).toFixed(1) : '0',
      memoryImprovement: memoryDiff > 0 ? ((memoryDiff / normalMetrics.memoryUsage) * 100).toFixed(1) : '0',
      renderCountImprovement: renderCountDiff > 0 ? renderCountDiff : 0
    };
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Memoization Demo</h1>
                <p className="text-gray-600">React optimization with useMemo, useCallback, and React.memo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`p-2 rounded-lg transition-colors ${
                  showMetrics ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle metrics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAutoIncrement(!isAutoIncrement)}
                className={`p-2 rounded-lg transition-colors ${
                  isAutoIncrement ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={isAutoIncrement ? 'Stop auto increment' : 'Start auto increment'}
              >
                {isAutoIncrement ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={resetMetrics}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Reset metrics"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Counter: {counter}</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCounter(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Increment
                </button>
                <button
                  onClick={() => setCounter(0)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Multiplier: {multiplier}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Auto Increment</div>
                <div className={`text-sm font-medium ${isAutoIncrement ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAutoIncrement ? 'Running' : 'Stopped'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          {showMetrics && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Metrics
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm text-gray-900 mb-2">{metric.componentName}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Renders:</span>
                          <span className={`font-medium ${metric.isMemoized ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.renderCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{metric.renderTime?.toFixed(2)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Memory:</span>
                          <span className="font-medium">{metric.memoryUsage?.toFixed(1)}MB</span>
                        </div>
                        <div className="flex items-center mt-2">
                          {metric.isMemoized ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                          )}
                          <span className="text-xs text-gray-500">{metric.lastRenderReason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance comparison */}
                {performanceComparison && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Gains</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Render Time:</span>
                        <span className="font-medium text-green-600">
                          {performanceComparison.renderTimeImprovement}% faster
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Memory:</span>
                        <span className="font-medium text-green-600">
                          {performanceComparison.memoryImprovement}% less
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Render Counts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Render Counts
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Normal List:</span>
                    <span className="font-bold text-red-600">{renderCounts.normalList}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Memoized List:</span>
                    <span className="font-bold text-green-600">{renderCounts.memoizedList}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Difference: {renderCounts.normalList - renderCounts.memoizedList} fewer renders
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Content */}
          <div className={showMetrics ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {[
                    { id: 'calculation', name: 'useMemo Demo', icon: Cpu },
                    { id: 'components', name: 'React.memo Demo', icon: Clock },
                    { id: 'callbacks', name: 'useCallback Demo', icon: Zap }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* useMemo Demo */}
                {activeTab === 'calculation' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">useMemo Optimization</h3>
                      <p className="text-gray-600">
                        Compare expensive calculations with and without useMemo. Change the counter to see the difference.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ExpensiveCalculationNormal
                        numbers={numbers}
                        multiplier={multiplier}
                        isMemoized={false}
                        onMetricsUpdate={(metrics) => handleMetricsUpdate('ExpensiveCalculation', metrics)}
                      />
                      <ExpensiveCalculationMemoized
                        numbers={numbers}
                        multiplier={multiplier}
                        isMemoized={true}
                        onMetricsUpdate={(metrics) => handleMetricsUpdate('ExpensiveCalculationMemoized', metrics)}
                      />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Without useMemo: Calculation runs on every render</li>
                        <li>• With useMemo: Calculation only runs when dependencies change</li>
                        <li>• Dependencies: numbers array and multiplier value</li>
                        <li>• Counter changes don't trigger recalculation in memoized version</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* React.memo Demo */}
                {activeTab === 'components' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">React.memo Component Optimization</h3>
                      <p className="text-gray-600">
                        Compare component re-renders with and without React.memo. Click items to select them.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Normal List */}
                      <div>
                        <div className="mb-4">
                          <h4 className="font-semibold text-red-800 mb-2">Without React.memo</h4>
                          <p className="text-sm text-red-600">All items re-render when parent state changes</p>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {listItems.slice(0, 10).map((item) => (
                            <ListItemNormal
                              key={item.id}
                              item={item}
                              onClick={handleItemClickNormal}
                              isMemoized={false}
                              onRender={handleNormalListRender}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Memoized List */}
                      <div>
                        <div className="mb-4">
                          <h4 className="font-semibold text-green-800 mb-2">With React.memo</h4>
                          <p className="text-sm text-green-600">Only changed items re-render</p>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {listItems.slice(0, 10).map((item) => (
                            <ListItemMemoized
                              key={item.id}
                              item={item}
                              onClick={handleItemClickMemoized}
                              isMemoized={true}
                              onRender={handleMemoizedListRender}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• React.memo prevents re-renders when props haven't changed</li>
                        <li>• Shallow comparison of props by default</li>
                        <li>• Custom comparison function can be provided for deep comparison</li>
                        <li>• Most effective for components with stable props</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* useCallback Demo */}
                {activeTab === 'callbacks' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">useCallback Optimization</h3>
                      <p className="text-gray-600">
                        Compare callback functions with and without useCallback. Selected items: {selectedItems.size}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Function Reference Info */}
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">Without useCallback</h4>
                          <div className="text-sm text-red-600 space-y-1">
                            <div>Function reference: <code className="bg-red-100 px-1 rounded">unstable</code></div>
                            <div>Recreation: Every render</div>
                            <div>Child re-renders: Frequent</div>
                            <div>Memory impact: Higher</div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">With useCallback</h4>
                          <div className="text-sm text-green-600 space-y-1">
                            <div>Function reference: <code className="bg-green-100 px-1 rounded">stable</code></div>
                            <div>Recreation: Only when deps change</div>
                            <div>Child re-renders: Minimal</div>
                            <div>Memory impact: Lower</div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">Performance Impact</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Function recreations:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-red-600 font-medium">{counter}</span>
                                <span className="text-gray-400">vs</span>
                                <span className="text-green-600 font-medium">1</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Memory allocations:</span>
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-red-500" />
                                <span className="text-gray-400">vs</span>
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Child re-renders:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-red-600 font-medium">{renderCounts.normalList}</span>
                                <span className="text-gray-400">vs</span>
                                <span className="text-green-600 font-medium">{renderCounts.memoizedList}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">Best Practices</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Use with expensive functions</li>
                            <li>• Combine with React.memo</li>
                            <li>• Keep dependencies minimal</li>
                            <li>• Avoid overuse for simple functions</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• useCallback memoizes function references between renders</li>
                        <li>• Function is only recreated when dependencies change</li>
                        <li>• Prevents unnecessary re-renders of memoized child components</li>
                        <li>• Essential for maintaining referential equality</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoizationDemo; 