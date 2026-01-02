import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Settings,
  Calendar,
  Filter,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Info,
  Users,
  DollarSign,
  ShoppingBag,
  Star
} from 'lucide-react';

// Types and Interfaces
interface DataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
  category: string;
  date: string;
}

interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  dataKey: string;
  visible: boolean;
  color: string;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageRating: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
  ratingChange: number;
}

interface EditingData {
  id: string | null;
  field: 'label' | 'value' | 'category' | null;
  value: string;
}

const ChartDashboard: React.FC = () => {
  // State Management
  const [data, setData] = useState<DataPoint[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [editing, setEditing] = useState<EditingData>({ id: null, field: null, value: '' });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Time Range Options
  const timeRanges: TimeRange[] = [
    { label: 'Last 7 days', value: '7d', days: 7 },
    { label: 'Last 30 days', value: '30d', days: 30 },
    { label: 'Last 90 days', value: '90d', days: 90 },
    { label: 'Last year', value: '1y', days: 365 },
  ];

  // Chart Colors
  const chartColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // Categories
  const categories = ['Sales', 'Marketing', 'Support', 'Development', 'Design'];

  // Generate Sample Data
  const generateSampleData = useCallback((days: number): DataPoint[] => {
    const sampleData: DataPoint[] = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      categories.forEach((category, categoryIndex) => {
        const id = `${category.toLowerCase()}-${i}`;
        const baseValue = Math.random() * 1000 + 200;
        const seasonalMultiplier = 1 + 0.3 * Math.sin((i / days) * Math.PI * 2);
        const value = Math.round(baseValue * seasonalMultiplier);
        
        sampleData.push({
          id,
          label: `${category} ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          value,
          color: chartColors[categoryIndex % chartColors.length],
          category,
          date: date.toISOString().split('T')[0]
        });
      });
    }
    
    return sampleData;
  }, []);

  // Initialize Dashboard Data
  useEffect(() => {
    const timeRange = timeRanges.find(t => t.value === selectedTimeRange);
    const initialData = generateSampleData(timeRange?.days || 7);
    setData(initialData);
    setLastUpdate(new Date());
  }, [selectedTimeRange, generateSampleData]);

  // Generate Charts Configuration
  useEffect(() => {
    const defaultCharts: ChartConfig[] = [
      { id: 'revenue-bar', title: 'Revenue by Category', type: 'bar', dataKey: 'all', visible: true, color: '#3B82F6', position: { x: 0, y: 0 }, size: 'medium' },
      { id: 'orders-line', title: 'Orders Over Time', type: 'line', dataKey: 'all', visible: true, color: '#10B981', position: { x: 1, y: 0 }, size: 'medium' },
      { id: 'category-pie', title: 'Category Distribution', type: 'pie', dataKey: 'all', visible: true, color: '#F59E0B', position: { x: 0, y: 1 }, size: 'medium' },
      { id: 'trend-area', title: 'Revenue Trend', type: 'area', dataKey: 'all', visible: true, color: '#8B5CF6', position: { x: 1, y: 1 }, size: 'medium' }
    ];
    setCharts(defaultCharts);
  }, [selectedTimeRange, generateSampleData]);

  // Data Management Functions
  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const timeRange = timeRanges.find(t => t.value === selectedTimeRange);
      const newData = generateSampleData(timeRange?.days || 7);
      setData(newData);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  }, [selectedTimeRange, generateSampleData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, refreshInterval, refreshData]);

  // Calculate Metrics
  const metrics = useMemo((): DashboardMetrics => {
    const currentPeriodData = data.filter(d => selectedCategory === 'all' || d.category === selectedCategory);
    const totalRevenue = currentPeriodData.reduce((sum, d) => sum + d.value, 0);
    const totalOrders = currentPeriodData.length;
    const totalUsers = Math.round(totalRevenue / 150); // Simulated
    const averageRating = 4.2 + Math.random() * 0.6; // Simulated
    
    // Calculate changes (simulated)
    const revenueChange = (Math.random() - 0.5) * 20;
    const ordersChange = (Math.random() - 0.5) * 15;
    const usersChange = (Math.random() - 0.5) * 25;
    const ratingChange = (Math.random() - 0.5) * 0.4;
    
    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      averageRating,
      revenueChange,
      ordersChange,
      usersChange,
      ratingChange
    };
  }, [data, selectedCategory]);

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(d => selectedCategory === 'all' || d.category === selectedCategory);
  }, [data, selectedCategory]);

  // Chart Data Processing
  const processChartData = useCallback((chartConfig: ChartConfig) => {
    const categoryData = chartConfig.dataKey === 'all' 
      ? data 
      : data.filter(d => d.category === chartConfig.dataKey);
    
    if (chartConfig.type === 'pie') {
      const grouped = categories.reduce((acc, cat) => {
        const categorySum = data.filter(d => d.category === cat)
          .reduce((sum, d) => sum + d.value, 0);
        acc[cat] = categorySum;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(grouped).map(([category, value], index) => ({
        label: category,
        value,
        color: chartColors[index % chartColors.length]
      }));
    }
    
    return categoryData.slice(0, 10); // Limit for better visualization
  }, [data]);

  // Data Management Functions
  const addDataPoint = useCallback(() => {
    const newPoint: DataPoint = {
      id: `custom-${Date.now()}`,
      label: `Custom ${new Date().toLocaleDateString()}`,
      value: Math.round(Math.random() * 1000 + 100),
      color: chartColors[Math.floor(Math.random() * chartColors.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date().toISOString().split('T')[0]
    };
    
    setData(prev => [newPoint, ...prev]);
  }, []);

  const deleteDataPoint = useCallback((id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  }, []);

  const startEditing = useCallback((id: string, field: 'label' | 'value' | 'category', currentValue: string) => {
    setEditing({ id, field, value: currentValue });
  }, []);

  const saveEdit = useCallback(() => {
    if (editing.id && editing.field) {
      setData(prev => prev.map(d => {
        if (d.id === editing.id) {
          return {
            ...d,
            [editing.field!]: editing.field === 'value' ? Number(editing.value) : editing.value
          };
        }
        return d;
      }));
      setEditing({ id: null, field: null, value: '' });
    }
  }, [editing]);

  const cancelEdit = useCallback(() => {
    setEditing({ id: null, field: null, value: '' });
  }, []);

  // Chart Management Functions
  const toggleChartVisibility = useCallback((chartId: string) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? { ...chart, visible: !chart.visible }
        : chart
    ));
  }, []);

  const updateChartConfig = useCallback((chartId: string, updates: Partial<ChartConfig>) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? { ...chart, ...updates }
        : chart
    ));
  }, []);

  // Export Functions
  const exportData = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } else {
      const headers = ['Label', 'Value', 'Category', 'Date'];
      const csvContent = [
        headers.join(','),
        ...filteredData.map(d => [d.label, d.value, d.category, d.date].join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  }, [filteredData]);

  // Simple Chart Components
  const BarChart: React.FC<{ data: DataPoint[]; color: string; title: string }> = ({ data, color, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="h-48">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        <div className="flex items-end space-x-1 h-32">
          {data.slice(0, 8).map((point, index) => (
            <div key={point.id} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(point.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
                title={`${point.label}: ${point.value.toLocaleString()}`}
              />
              <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                {point.label.slice(0, 6)}...
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart: React.FC<{ data: DataPoint[]; color: string; title: string }> = ({ data, color, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.slice(0, 10);
    
    return (
      <div className="h-48">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        <div className="relative h-32 border border-gray-200 rounded">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points.map((point, index) => {
                const x = (index / (points.length - 1)) * 100;
                const y = 100 - (point.value / maxValue) * 80;
                return `${x}%,${y}%`;
              }).join(' ')}
            />
            {points.map((point, index) => {
              const x = (index / (points.length - 1)) * 100;
              const y = 100 - (point.value / maxValue) * 80;
              return (
                <circle
                  key={point.id}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill={color}
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const PieChart: React.FC<{ data: any[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="h-48">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        <div className="flex items-center space-x-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                  />
                );
              })}
            </svg>
          </div>
          <div className="space-y-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">
                  {item.label}: {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AreaChart: React.FC<{ data: DataPoint[]; color: string; title: string }> = ({ data, color, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.slice(0, 10);
    
    return (
      <div className="h-48">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        <div className="relative h-32 border border-gray-200 rounded">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polygon
              fill={`url(#gradient-${title})`}
              stroke={color}
              strokeWidth="2"
              points={[
                '0%,100%',
                ...points.map((point, index) => {
                  const x = (index / (points.length - 1)) * 100;
                  const y = 100 - (point.value / maxValue) * 80;
                  return `${x}%,${y}%`;
                }),
                '100%,100%'
              ].join(' ')}
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chart Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Advanced data visualization with real-time updates and interactive charts
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto Refresh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto Refresh
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isAutoRefresh
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isAutoRefresh ? 'On' : 'Off'}
                  </button>
                  {isAutoRefresh && (
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={30}>30s</option>
                      <option value={60}>1m</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => exportData('json')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => exportData('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metrics.revenueChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metrics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.revenueChange.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metrics.ordersChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metrics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.ordersChange.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metrics.usersChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metrics.usersChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.usersChange.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.averageRating.toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metrics.ratingChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metrics.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.ratingChange.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {charts.filter(chart => chart.visible).map((chart) => {
            const chartData = processChartData(chart);
            
            return (
              <div key={chart.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleChartVisibility(chart.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {chart.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: chart.color }} />
                  </div>
                </div>
                
                {chart.type === 'bar' && (
                  <BarChart data={chartData as DataPoint[]} color={chart.color} title="" />
                )}
                {chart.type === 'line' && (
                  <LineChart data={chartData as DataPoint[]} color={chart.color} title="" />
                )}
                {chart.type === 'pie' && (
                  <PieChart data={chartData} title="" />
                )}
                {chart.type === 'area' && (
                  <AreaChart data={chartData as DataPoint[]} color={chart.color} title="" />
                )}
              </div>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Data Points</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={addDataPoint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editing.id === item.id && editing.field === 'label' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editing.value}
                            onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            autoFocus
                          />
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                            <Save className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{item.label}</span>
                          <button
                            onClick={() => startEditing(item.id, 'label', item.label)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editing.id === item.id && editing.field === 'value' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editing.value}
                            onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
                            autoFocus
                          />
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                            <Save className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {item.value.toLocaleString()}
                          </span>
                          <button
                            onClick={() => startEditing(item.id, 'value', item.value.toString())}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editing.id === item.id && editing.field === 'category' ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={editing.value}
                            onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            autoFocus
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                            <Save className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${chartColors[categories.indexOf(item.category) % chartColors.length]}20`,
                              color: chartColors[categories.indexOf(item.category) % chartColors.length]
                            }}
                          >
                            {item.category}
                          </span>
                          <button
                            onClick={() => startEditing(item.id, 'category', item.category)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteDataPoint(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing 10 of {filteredData.length} data points
              </p>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Chart Visibility</h4>
                  <div className="space-y-2">
                    {charts.map((chart) => (
                      <div key={chart.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: chart.color }}
                          />
                          <span className="text-sm font-medium">{chart.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={chart.type}
                            onChange={(e) => updateChartConfig(chart.id, { type: e.target.value as any })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="area">Area Chart</option>
                          </select>
                          <button
                            onClick={() => toggleChartVisibility(chart.id)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              chart.visible
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {chart.visible ? 'Visible' : 'Hidden'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Refreshing data...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDashboard; 