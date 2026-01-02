import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Package,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Search,
  Filter,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';

interface BundleData {
  name: string;
  size: number;
  gzipSize: number;
  parsedSize: number;
  path: string;
  children?: BundleData[];
  type: 'chunk' | 'asset' | 'module';
  duplicate?: boolean;
}

interface OptimizationSuggestion {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
  savings: number;
}

const BundleAnalyzer: React.FC = () => {
  const [activeView, setActiveView] = useState<'treemap' | 'sunburst' | 'table'>('treemap');
  const [selectedBundle, setSelectedBundle] = useState<BundleData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptimizations, setShowOptimizations] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock bundle data
  const bundleData: BundleData[] = useMemo(() => [
    {
      name: 'main.js',
      size: 2500000,
      gzipSize: 750000,
      parsedSize: 2200000,
      path: '/dist/main.js',
      type: 'chunk',
      children: [
        {
          name: 'react',
          size: 800000,
          gzipSize: 280000,
          parsedSize: 720000,
          path: 'node_modules/react',
          type: 'module'
        },
        {
          name: 'react-dom',
          size: 650000,
          gzipSize: 220000,
          parsedSize: 580000,
          path: 'node_modules/react-dom',
          type: 'module'
        },
        {
          name: 'lodash',
          size: 500000,
          gzipSize: 150000,
          parsedSize: 450000,
          path: 'node_modules/lodash',
          type: 'module',
          duplicate: true
        },
        {
          name: 'application',
          size: 550000,
          gzipSize: 100000,
          parsedSize: 450000,
          path: '/src',
          type: 'module'
        }
      ]
    },
    {
      name: 'vendor.js',
      size: 1800000,
      gzipSize: 540000,
      parsedSize: 1600000,
      path: '/dist/vendor.js',
      type: 'chunk',
      children: [
        {
          name: 'moment',
          size: 400000,
          gzipSize: 120000,
          parsedSize: 360000,
          path: 'node_modules/moment',
          type: 'module'
        },
        {
          name: 'chart.js',
          size: 350000,
          gzipSize: 105000,
          parsedSize: 315000,
          path: 'node_modules/chart.js',
          type: 'module'
        },
        {
          name: 'axios',
          size: 280000,
          gzipSize: 84000,
          parsedSize: 252000,
          path: 'node_modules/axios',
          type: 'module'
        }
      ]
    }
  ], []);

  // Mock optimization suggestions
  const optimizationSuggestions: OptimizationSuggestion[] = useMemo(() => [
    {
      id: '1',
      type: 'warning',
      title: 'Large Bundle Size',
      description: 'Main bundle is larger than recommended (>1MB)',
      impact: 'high',
      solution: 'Implement code splitting and lazy loading',
      savings: 800000
    },
    {
      id: '2',
      type: 'error',
      title: 'Duplicate Dependencies',
      description: 'Lodash is included multiple times',
      impact: 'medium',
      solution: 'Configure webpack to deduplicate modules',
      savings: 250000
    },
    {
      id: '3',
      type: 'info',
      title: 'Unused Moment.js Locales',
      description: 'Moment.js includes all locales but only English is used',
      impact: 'medium',
      solution: 'Use webpack IgnorePlugin to exclude unused locales',
      savings: 200000
    }
  ], []);

  // Calculate total bundle size
  const totalStats = useMemo(() => {
    const calculateTotal = (data: BundleData[]): { size: number; gzipSize: number; parsedSize: number } => {
      return data.reduce((acc, item) => ({
        size: acc.size + item.size,
        gzipSize: acc.gzipSize + item.gzipSize,
        parsedSize: acc.parsedSize + item.parsedSize
      }), { size: 0, gzipSize: 0, parsedSize: 0 });
    };

    return calculateTotal(bundleData);
  }, [bundleData]);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get color for bundle item
  const getBundleColor = (item: BundleData): string => {
    if (item.duplicate) return 'bg-red-500';
    if (item.size > 500000) return 'bg-orange-500';
    if (item.size > 200000) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get suggestion icon
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  // Simulate bundle analysis
  const analyzeBundle = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  // Treemap Visualization Component
  const TreemapView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundleData.map((bundle, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
              <span className="text-sm text-gray-500">{formatSize(bundle.size)}</span>
            </div>
            
            <div className="space-y-2">
              {bundle.children?.map((child, childIndex) => {
                const percentage = (child.size / bundle.size) * 100;
                return (
                  <div key={childIndex} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${child.duplicate ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                          {child.name}
                          {child.duplicate && <span className="ml-1 text-xs">(duplicate)</span>}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatSize(child.size)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBundleColor(child)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gzipped
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parsed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bundleData.flatMap(bundle => 
              [bundle, ...(bundle.children || [])]
            ).map((item, index) => (
              <tr key={index} className={`hover:bg-gray-50 ${item.duplicate ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={`text-sm ${item.duplicate ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {item.name}
                      {item.duplicate && <span className="ml-1 text-xs text-red-500">(duplicate)</span>}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatSize(item.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatSize(item.gzipSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatSize(item.parsedSize)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.type === 'chunk' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'module' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bundle Analyzer</h1>
                <p className="text-gray-600">Analyze and optimize your application bundle size</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={analyzeBundle}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Re-analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm text-blue-600 font-medium">Total Size</div>
                  <div className="text-lg font-bold text-blue-800">{formatSize(totalStats.size)}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm text-green-600 font-medium">Gzipped</div>
                  <div className="text-lg font-bold text-green-800">{formatSize(totalStats.gzipSize)}</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-sm text-purple-600 font-medium">Parsed</div>
                  <div className="text-lg font-bold text-purple-800">{formatSize(totalStats.parsedSize)}</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <div className="text-sm text-orange-600 font-medium">Issues</div>
                  <div className="text-lg font-bold text-orange-800">{optimizationSuggestions.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* View Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {[
                    { key: 'treemap', label: 'Treemap', icon: Layers },
                    { key: 'table', label: 'Table', icon: FileText }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveView(key as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        activeView === key 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search modules..."
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bundle Visualization */}
            <div className="bg-gray-50 rounded-lg p-6">
              {activeView === 'treemap' && <TreemapView />}
              {activeView === 'table' && <TableView />}
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Optimization Suggestions</h2>
                <button
                  onClick={() => setShowOptimizations(!showOptimizations)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showOptimizations ? 'Hide' : 'Show'}
                </button>
              </div>

              {showOptimizations && (
                <div className="space-y-4">
                  {optimizationSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              suggestion.impact === 'high' ? 'bg-red-100 text-red-800' :
                              suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {suggestion.impact}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <p className="text-sm text-blue-600 mb-2">{suggestion.solution}</p>
                          <div className="flex items-center text-xs text-green-600">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            <span>Potential savings: {formatSize(suggestion.savings)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bundle Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bundle Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Chunks:</span>
                  <span className="text-sm font-medium text-gray-900">{bundleData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Modules:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bundleData.reduce((sum, bundle) => sum + (bundle.children?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Compression Ratio:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((totalStats.gzipSize / totalStats.size) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potential Savings:</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatSize(optimizationSuggestions.reduce((sum, s) => sum + s.savings, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleAnalyzer; 