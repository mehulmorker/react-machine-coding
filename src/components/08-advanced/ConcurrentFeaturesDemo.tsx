import React, { useState, useTransition, useDeferredValue, useMemo } from 'react';
import { 
  Code,
  Zap,
  Clock,
  Search,
  Filter,
  Loader,
  ArrowRight,
  Info,
  Layers,
  RefreshCw
} from 'lucide-react';

// Heavy computation component
const HeavyList: React.FC<{ items: string[]; filter: string }> = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    // Simulate heavy computation
    let result = items;
    if (filter) {
      result = items.filter(item => 
        item.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // Add artificial delay to simulate heavy computation
    const start = Date.now();
    while (Date.now() - start < 100) {
      // Busy wait
    }
    
    return result;
  }, [items, filter]);

  return (
    <div className="space-y-2">
      {filteredItems.slice(0, 50).map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded border">
          <span className="font-medium">{item}</span>
          <span className="ml-2 text-sm text-gray-500">#{index + 1}</span>
        </div>
      ))}
      {filteredItems.length > 50 && (
        <div className="text-center text-gray-500 text-sm py-2">
          ... and {filteredItems.length - 50} more items
        </div>
      )}
    </div>
  );
};

// Generate sample data
const generateItems = (count: number) => {
  const items = [];
  const categories = ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Node.js', 'Python', 'Java'];
  const types = ['Tutorial', 'Guide', 'Example', 'Documentation', 'Video', 'Course'];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    items.push(`${category} ${type} - Item ${i + 1}`);
  }
  
  return items;
};

const ConcurrentFeaturesDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgentUpdate, setUrgentUpdate] = useState('');
  const [isPending, startTransition] = useTransition();
  
  // Deferred value for search
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // Generate sample data
  const items = useMemo(() => generateItems(1000), []);
  
  // Handle search with transition
  const handleSearch = (value: string) => {
    setUrgentUpdate(value); // This update is urgent
    startTransition(() => {
      setSearchTerm(value); // This update can be deferred
    });
  };

  // Counter for demonstrating concurrent updates
  const [count, setCount] = useState(0);
  const [heavyCount, setHeavyCount] = useState(0);
  const [isHeavyPending, startHeavyTransition] = useTransition();

  const incrementHeavy = () => {
    startTransition(() => {
      setHeavyCount(prev => prev + 1);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">React Concurrent Features Demo</h1>
          <p className="text-lg text-gray-600">
            Explore React 18's concurrent features: useTransition, useDeferredValue, and concurrent rendering
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* useTransition Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            useTransition Hook
            {isPending && <Loader className="w-4 h-4 ml-2 animate-spin text-blue-500" />}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search (with useTransition)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={urgentUpdate}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Urgent update (immediate): "{urgentUpdate}"</p>
              <p>Deferred update (with transition): "{searchTerm}"</p>
              {isPending && <p className="text-blue-600">⏳ Transition pending...</p>}
            </div>
          </div>
        </div>

        {/* useDeferredValue Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            useDeferredValue Hook
          </h2>
          
          <div className="max-h-96 overflow-y-auto">
            <HeavyList items={items} filter={deferredSearchTerm} />
          </div>
        </div>

        {/* Concurrent Updates Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-green-500" />
            Concurrent Updates
            {isHeavyPending && <Loader className="w-4 h-4 ml-2 animate-spin text-blue-500" />}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Urgent Updates</h3>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-600">Count: {count}</div>
                <button
                  onClick={() => setCount(prev => prev + 1)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Increment (Immediate)
                </button>
                <p className="text-sm text-gray-600">
                  This update happens immediately and won't be interrupted.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Non-Urgent Updates</h3>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-blue-600">
                  Heavy Count: {heavyCount}
                  {isHeavyPending && <span className="text-sm ml-2">(updating...)</span>}
                </div>
                <button
                  onClick={incrementHeavy}
                  disabled={isHeavyPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Increment (Deferred)
                </button>
                <p className="text-sm text-gray-600">
                  This update can be interrupted by urgent updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-purple-500" />
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">useTransition</td>
                  <td className="border border-gray-300 px-4 py-2">Mark updates as non-urgent</td>
                  <td className="border border-gray-300 px-4 py-2">Heavy computations, navigation</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">useDeferredValue</td>
                  <td className="border border-gray-300 px-4 py-2">Defer value updates</td>
                  <td className="border border-gray-300 px-4 py-2">Search, filtering, expensive renders</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Concurrent Rendering</td>
                  <td className="border border-gray-300 px-4 py-2">Interruptible rendering</td>
                  <td className="border border-gray-300 px-4 py-2">Better user experience</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Concurrent Features Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are Concurrent Features?</h3>
            <p className="text-gray-600 mb-4">
              React 18 introduced concurrent features that allow React to interrupt, pause, resume, or abandon 
              rendering work to keep the app responsive. This enables better user experience by prioritizing 
              urgent updates over less important ones.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">useTransition</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Marks state updates as non-urgent transitions</li>
              <li>Returns isPending flag to show loading state</li>
              <li>Allows urgent updates to interrupt transitions</li>
              <li>Perfect for navigation and heavy computations</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">useDeferredValue</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Defers updates to a value until more urgent updates finish</li>
              <li>Useful for expensive operations triggered by user input</li>
              <li>Automatically batches with other deferred updates</li>
              <li>Great for search and filtering scenarios</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use transitions for non-urgent updates</li>
              <li>Keep urgent updates (like input changes) outside transitions</li>
              <li>Combine with Suspense for better loading states</li>
              <li>Monitor performance with React DevTools Profiler</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Concurrent features require React 18+</li>
                    <li>• Not all updates should be transitions</li>
                    <li>• Use React.StrictMode to catch concurrent bugs</li>
                    <li>• Consider using Suspense with concurrent features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentFeaturesDemo; 