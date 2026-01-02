import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  Package,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  Zap,
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  Monitor
} from 'lucide-react';

interface BundleInfo {
  name: string;
  size: string;
  loadTime: number;
  status: 'loading' | 'loaded' | 'error';
  chunks: string[];
}

interface LoadingMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  bundleSize: number;
  chunkCount: number;
}

// Simulated heavy components that would be code-split
const HeavyDashboard = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Heavy Dashboard Component</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="text-lg font-semibold text-gray-800">Widget {i + 1}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    This is a heavy dashboard widget with complex calculations and visualizations.
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }, 1500); // Simulate heavy loading
  })
);

const HeavyChart = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
            <h3 className="text-xl font-bold text-green-800 mb-4">Heavy Chart Component</h3>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-800">Sales Analytics Chart</div>
                <div className="text-sm text-gray-600">Complex data visualization with D3.js (simulated)</div>
              </div>
              <div className="relative">
                {/* Simulated chart bars */}
                <div className="flex items-end justify-between h-32 space-x-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="bg-green-500 rounded-t" 
                         style={{ height: `${20 + Math.random() * 80}%`, width: '8%' }}>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <div key={month}>{month}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      });
    }, 2000); // Simulate heavier loading
  })
);

const HeavyDataTable = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
            <h3 className="text-xl font-bold text-purple-800 mb-4">Heavy Data Table Component</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-50">
                    <tr>
                      {['ID', 'Name', 'Email', 'Role', 'Department', 'Status'].map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: 50 }, (_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{1000 + i}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">User {i + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">user{i + 1}@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {['Admin', 'User', 'Manager'][i % 3]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {['Engineering', 'Sales', 'Marketing', 'HR'][i % 4]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            i % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {i % 2 === 0 ? 'Active' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });
    }, 1200); // Simulate loading
  })
);

// Dynamic import demo
const dynamicImportDemo = async () => {
  const start = performance.now();
  
  // Simulate dynamic import of a utility library
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const end = performance.now();
  
  return {
    loadTime: end - start,
    module: {
      calculate: (a: number, b: number) => a + b,
      format: (value: number) => value.toLocaleString(),
      utilities: ['formatter', 'calculator', 'validator']
    }
  };
};

const CodeSplitting: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<{ [key: string]: LoadingMetrics }>({});
  const [bundleInfo, setBundleInfo] = useState<BundleInfo[]>([
    { name: 'main.js', size: '245 KB', loadTime: 0, status: 'loaded', chunks: ['vendor', 'app'] },
    { name: 'dashboard.chunk.js', size: '89 KB', loadTime: 0, status: 'loading', chunks: ['dashboard'] },
    { name: 'chart.chunk.js', size: '156 KB', loadTime: 0, status: 'loading', chunks: ['chart', 'd3'] },
    { name: 'datatable.chunk.js', size: '67 KB', loadTime: 0, status: 'loading', chunks: ['table'] }
  ]);
  const [dynamicImportResult, setDynamicImportResult] = useState<any>(null);
  const [showBundleAnalysis, setShowBundleAnalysis] = useState(true);
  const [loadingComponent, setLoadingComponent] = useState<string | null>(null);

  const loadingStartRef = useRef<number>(0);

  // Handle component loading with metrics
  const handleComponentLoad = (componentName: string) => {
    if (activeComponent === componentName) {
      setActiveComponent(null);
      return;
    }

    setLoadingComponent(componentName);
    loadingStartRef.current = performance.now();
    setActiveComponent(componentName);

    // Update bundle status
    setBundleInfo(prev => prev.map(bundle => 
      bundle.name.includes(componentName.toLowerCase()) 
        ? { ...bundle, status: 'loading' as const }
        : bundle
    ));
  };

  // Track when components finish loading
  useEffect(() => {
    if (activeComponent && loadingComponent) {
      const timer = setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - loadingStartRef.current;
        
        setLoadingMetrics(prev => ({
          ...prev,
          [activeComponent]: {
            startTime: loadingStartRef.current,
            endTime,
            duration,
            bundleSize: Math.random() * 100 + 50, // Simulated
            chunkCount: Math.floor(Math.random() * 3) + 1
          }
        }));

        // Update bundle status to loaded
        setBundleInfo(prev => prev.map(bundle => 
          bundle.name.includes(activeComponent.toLowerCase()) 
            ? { ...bundle, status: 'loaded' as const, loadTime: duration }
            : bundle
        ));

        setLoadingComponent(null);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeComponent, loadingComponent]);

  // Handle dynamic import
  const handleDynamicImport = async () => {
    setDynamicImportResult(null);
    try {
      const result = await dynamicImportDemo();
      setDynamicImportResult(result);
    } catch (error) {
      console.error('Dynamic import failed:', error);
    }
  };

  // Calculate total bundle size
  const totalBundleSize = bundleInfo.reduce((total, bundle) => {
    const size = parseFloat(bundle.size.replace(/[^\d.]/g, ''));
    return total + size;
  }, 0);

  // Calculate performance stats
  const performanceStats = {
    totalComponents: Object.keys(loadingMetrics).length,
    averageLoadTime: Object.values(loadingMetrics).length > 0 
      ? Object.values(loadingMetrics).reduce((sum, metric) => sum + metric.duration, 0) / Object.values(loadingMetrics).length
      : 0,
    totalBundleSize: totalBundleSize.toFixed(1),
    chunksLoaded: bundleInfo.filter(bundle => bundle.status === 'loaded').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Code Splitting Demo</h1>
                <p className="text-gray-600">Dynamic imports, lazy loading, and bundle optimization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBundleAnalysis(!showBundleAnalysis)}
                className={`p-2 rounded-lg transition-colors ${
                  showBundleAnalysis ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle bundle analysis"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDynamicImport}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                title="Test dynamic import"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{performanceStats.totalComponents}</div>
              <div className="text-sm text-blue-800">Components Loaded</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{performanceStats.averageLoadTime.toFixed(0)}ms</div>
              <div className="text-sm text-green-800">Avg Load Time</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{performanceStats.totalBundleSize}KB</div>
              <div className="text-sm text-purple-800">Total Bundle Size</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{performanceStats.chunksLoaded}/{bundleInfo.length}</div>
              <div className="text-sm text-yellow-800">Chunks Loaded</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bundle Analysis Panel */}
          {showBundleAnalysis && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <File className="w-5 h-5 mr-2" />
                  Bundle Analysis
                </h3>
                
                <div className="space-y-3">
                  {bundleInfo.map((bundle, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm text-gray-900">{bundle.name}</div>
                        <div className="flex items-center">
                          {bundle.status === 'loading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                          {bundle.status === 'loaded' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {bundle.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium">{bundle.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Load Time:</span>
                          <span className="font-medium">
                            {bundle.loadTime > 0 ? `${bundle.loadTime.toFixed(0)}ms` : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`font-medium capitalize ${
                            bundle.status === 'loaded' ? 'text-green-600' :
                            bundle.status === 'loading' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {bundle.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Chunks:</div>
                        <div className="flex flex-wrap gap-1">
                          {bundle.chunks.map((chunk, chunkIndex) => (
                            <span key={chunkIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {chunk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Metrics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Loading Metrics
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(loadingMetrics).map(([component, metrics]) => (
                    <div key={component} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm text-gray-900 mb-2 capitalize">{component}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{metrics.duration.toFixed(2)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bundle Size:</span>
                          <span className="font-medium">{metrics.bundleSize.toFixed(1)}KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chunks:</span>
                          <span className="font-medium">{metrics.chunkCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={showBundleAnalysis ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Component Loading Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lazy Loading Components</h3>
              <p className="text-gray-600 mb-6">
                Click buttons to dynamically load components. Each component is code-split and loaded on demand.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'dashboard', name: 'Heavy Dashboard', icon: Monitor, color: 'blue' },
                  { id: 'chart', name: 'Heavy Chart', icon: BarChart3, color: 'green' },
                  { id: 'datatable', name: 'Heavy Data Table', icon: FileText, color: 'purple' }
                ].map((component) => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentLoad(component.id)}
                    disabled={loadingComponent === component.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      activeComponent === component.id
                        ? `border-${component.color}-500 bg-${component.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      loadingComponent === component.id ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {loadingComponent === component.id ? (
                        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                      ) : (
                        <component.icon className={`w-6 h-6 text-${component.color}-600`} />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{component.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {loadingComponent === component.id ? 'Loading...' : 'Click to load'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Loaded Component Display */}
              <div className="border-t pt-6">
                {activeComponent === 'dashboard' && (
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
                      <span className="text-gray-600">Loading Dashboard Component...</span>
                    </div>
                  }>
                    <HeavyDashboard />
                  </Suspense>
                )}

                {activeComponent === 'chart' && (
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="w-8 h-8 text-green-500 animate-spin mr-3" />
                      <span className="text-gray-600">Loading Chart Component...</span>
                    </div>
                  }>
                    <HeavyChart />
                  </Suspense>
                )}

                {activeComponent === 'datatable' && (
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin mr-3" />
                      <span className="text-gray-600">Loading Data Table Component...</span>
                    </div>
                  }>
                    <HeavyDataTable />
                  </Suspense>
                )}

                {!activeComponent && (
                  <div className="text-center p-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-lg font-medium mb-2">No Component Loaded</div>
                    <div className="text-sm">Click a button above to dynamically load a component</div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Import Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dynamic Import Demo</h3>
              <p className="text-gray-600 mb-6">
                Test dynamic importing of utility modules. This simulates loading external libraries on demand.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <button
                    onClick={handleDynamicImport}
                    className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Import Utility Module
                  </button>
                  
                  {dynamicImportResult && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Module Loaded Successfully</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>Load Time: {dynamicImportResult.loadTime.toFixed(2)}ms</div>
                        <div>Available Utilities: {dynamicImportResult.module.utilities.join(', ')}</div>
                        <div className="pt-2">
                          <span className="font-medium">Test Function:</span>
                          <code className="ml-2 bg-green-100 px-2 py-1 rounded text-xs">
                            calculate(5, 3) = {dynamicImportResult.module.calculate(5, 3)}
                          </code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Benefits of Code Splitting:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Reduced initial bundle size</li>
                      <li>• Faster initial page load</li>
                      <li>• Load features on demand</li>
                      <li>• Better cache utilization</li>
                      <li>• Improved user experience</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Best Practices:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Split at route boundaries</li>
                      <li>• Use React.lazy for components</li>
                      <li>• Implement loading states</li>
                      <li>• Preload critical resources</li>
                      <li>• Monitor bundle sizes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSplitting; 