import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  List,
  Grid3X3,
  Settings,
  BarChart3,
  Clock,
  Zap,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Users,
  Eye,
  Activity
} from 'lucide-react';

interface ListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  joinDate: string;
  location: string;
  avatar: string;
  rating: number;
  description: string;
  height?: number; // For dynamic heights
}

interface VirtualizedListState {
  items: ListItem[];
  filteredItems: ListItem[];
  searchTerm: string;
  sortBy: 'name' | 'company' | 'joinDate' | 'rating';
  sortOrder: 'asc' | 'desc';
  itemHeight: number;
  dynamicHeight: boolean;
  showMetrics: boolean;
  containerHeight: number;
  scrollTop: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  overscan: number;
}

interface PerformanceMetrics {
  totalItems: number;
  visibleItems: number;
  renderTime: number;
  memoryUsage: string;
  scrollPosition: number;
  fps: number;
}

// Mock data generator
const generateMockData = (count: number): ListItem[] => {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const companies = ['TechCorp', 'DataSoft', 'CloudInc', 'DevCompany', 'InnovateLab', 'FutureWorks', 'CodeBase', 'DigitalEdge'];
  const positions = ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Singapore'];

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `item-${index}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: companies[index % companies.length],
      position: positions[index % positions.length],
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0],
      location: locations[index % locations.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      rating: Number((Math.random() * 4 + 1).toFixed(1)),
      description: `${positions[index % positions.length]} at ${companies[index % companies.length]} with expertise in modern technologies.`,
      height: Math.floor(Math.random() * 100) + 80 // Dynamic height between 80-180px
    };
  });
};

const VirtualizedList: React.FC = () => {
  const [state, setState] = useState<VirtualizedListState>({
    items: [],
    filteredItems: [],
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',
    itemHeight: 120,
    dynamicHeight: false,
    showMetrics: true,
    containerHeight: 600,
    scrollTop: 0,
    visibleStartIndex: 0,
    visibleEndIndex: 0,
    overscan: 5
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalItems: 0,
    visibleItems: 0,
    renderTime: 0,
    memoryUsage: '0 MB',
    scrollPosition: 0,
    fps: 60
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const renderStartTime = useRef<number>(0);
  const fpsRef = useRef<number[]>([]);

  // Initialize data
  useEffect(() => {
    const items = generateMockData(50000); // 50k items for testing
    setState(prev => ({
      ...prev,
      items,
      filteredItems: items
    }));
  }, []);

  // Filter and sort items
  const processedItems = useMemo(() => {
    let filtered = state.items.filter(item =>
      item.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      return state.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.items, state.searchTerm, state.sortBy, state.sortOrder]);

  // Calculate visible items
  const { visibleItems, totalHeight } = useMemo(() => {
    renderStartTime.current = performance.now();
    
    const { containerHeight, scrollTop, overscan, itemHeight, dynamicHeight } = state;
    const items = processedItems;
    
    if (!dynamicHeight) {
      // Fixed height calculation
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
      
      const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
        ...item,
        index: startIndex + index,
        offsetTop: (startIndex + index) * itemHeight
      }));
      
      return {
        visibleItems,
        totalHeight: items.length * itemHeight
      };
    } else {
      // Dynamic height calculation
      let currentHeight = 0;
      let startIndex = -1;
      let endIndex = -1;
      
      // Find start index
      for (let i = 0; i < items.length; i++) {
        const height = items[i].height || itemHeight;
        if (currentHeight + height > scrollTop - overscan * itemHeight && startIndex === -1) {
          startIndex = i;
        }
        if (currentHeight > scrollTop + containerHeight + overscan * itemHeight && endIndex === -1) {
          endIndex = i;
          break;
        }
        currentHeight += height;
      }
      
      if (startIndex === -1) startIndex = 0;
      if (endIndex === -1) endIndex = items.length - 1;
      
      // Calculate visible items with their positions
      let offsetTop = 0;
      for (let i = 0; i < startIndex; i++) {
        offsetTop += items[i].height || itemHeight;
      }
      
      const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => {
        const result = {
          ...item,
          index: startIndex + index,
          offsetTop
        };
        offsetTop += item.height || itemHeight;
        return result;
      });
      
      return {
        visibleItems,
        totalHeight: currentHeight
      };
    }
  }, [processedItems, state.scrollTop, state.containerHeight, state.overscan, state.itemHeight, state.dynamicHeight]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setState(prev => ({ ...prev, scrollTop }));
    
    // Update FPS calculation
    const now = performance.now();
    fpsRef.current.push(now);
    fpsRef.current = fpsRef.current.filter(time => now - time < 1000);
  }, []);

  // Update metrics
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    setMetrics(prev => ({
      ...prev,
      totalItems: processedItems.length,
      visibleItems: visibleItems.length,
      renderTime: Number(renderTime.toFixed(2)),
      scrollPosition: state.scrollTop,
      fps: fpsRef.current.length,
      memoryUsage: `${Math.round(processedItems.length * 0.001)} MB` // Rough estimate
    }));
  }, [visibleItems, processedItems.length, state.scrollTop]);

  // Generate new data
  const generateNewData = useCallback((count: number) => {
    const newItems = generateMockData(count);
    setState(prev => ({
      ...prev,
      items: newItems,
      filteredItems: newItems,
      scrollTop: 0
    }));
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = 0;
    }
  }, []);

  // Export data
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(visibleItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'virtualized-list-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [visibleItems]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <List className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Virtualized List</h1>
                <p className="text-gray-600">High-performance rendering for large datasets</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setState(prev => ({ ...prev, showMetrics: !prev.showMetrics }))}
                className={`p-2 rounded-lg transition-colors ${
                  state.showMetrics ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle metrics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={exportData}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                title="Export visible data"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={state.sortBy}
                onChange={(e) => setState(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="company">Sort by Company</option>
                <option value="joinDate">Sort by Join Date</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <button
                onClick={() => setState(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={`Sort ${state.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <ChevronDown className={`w-4 h-4 transform transition-transform ${
                  state.sortOrder === 'desc' ? 'rotate-180' : ''
                }`} />
              </button>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.dynamicHeight}
                  onChange={(e) => setState(prev => ({ ...prev, dynamicHeight: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Dynamic Heights</span>
              </label>
            </div>

            {/* Data Generation */}
            <div className="flex space-x-2">
              <button
                onClick={() => generateNewData(1000)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                1K Items
              </button>
              <button
                onClick={() => generateNewData(10000)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                10K Items
              </button>
              <button
                onClick={() => generateNewData(100000)}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                100K Items
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          {state.showMetrics && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Metrics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <List className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Total Items</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.totalItems.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Visible Items</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.visibleItems}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Render Time</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.renderTime}ms</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Memory Usage</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.memoryUsage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">FPS</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.fps}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Scroll Position: {Math.round(metrics.scrollPosition)}px
                    </div>
                    <div className="text-xs text-gray-500">
                      Optimization: {state.dynamicHeight ? 'Dynamic' : 'Fixed'} Heights
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Container Height
                    </label>
                    <input
                      type="range"
                      min="300"
                      max="800"
                      value={state.containerHeight}
                      onChange={(e) => setState(prev => ({ ...prev, containerHeight: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{state.containerHeight}px</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Height (Fixed Mode)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={state.itemHeight}
                      onChange={(e) => setState(prev => ({ ...prev, itemHeight: Number(e.target.value) }))}
                      className="w-full"
                      disabled={state.dynamicHeight}
                    />
                    <div className="text-xs text-gray-500 mt-1">{state.itemHeight}px</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overscan Items
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={state.overscan}
                      onChange={(e) => setState(prev => ({ ...prev, overscan: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{state.overscan} items</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Virtualized List */}
          <div className={state.showMetrics ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {metrics.visibleItems} of {metrics.totalItems.toLocaleString()} items
                  </div>
                  <div className="text-sm text-gray-500">
                    {state.dynamicHeight ? 'Dynamic Heights' : 'Fixed Heights'} • {metrics.renderTime}ms render
                  </div>
                </div>
              </div>

              <div
                ref={containerRef}
                className="relative overflow-auto"
                style={{ height: state.containerHeight }}
                onScroll={handleScroll}
              >
                <div
                  ref={scrollElementRef}
                  style={{ height: totalHeight }}
                  className="relative"
                >
                  {visibleItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="absolute left-0 right-0 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      style={{
                        top: item.offsetTop,
                        height: state.dynamicHeight ? (item.height || state.itemHeight) : state.itemHeight
                      }}
                    >
                      <div className="flex items-center space-x-4 h-full">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="truncate">{item.position} at {item.company}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="truncate">{item.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>Joined {item.joinDate}</span>
                            </div>
                          </div>
                          
                          {state.dynamicHeight && (
                            <div className="mt-2 text-xs text-gray-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          #{item.index}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList; 