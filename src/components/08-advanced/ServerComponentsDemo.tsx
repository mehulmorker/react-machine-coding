import React, { useState, useEffect } from 'react';
import { 
  Code,
  Server,
  Monitor,
  Zap,
  Database,
  Globe,
  Clock,
  ArrowRight,
  Info,
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Simulate server-side data fetching
const simulateServerFetch = async (delay: number = 1000): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        users: [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', lastLogin: '2024-01-15' },
          { id: 2, name: 'Bob Smith', email: 'bob@example.com', lastLogin: '2024-01-14' },
          { id: 3, name: 'Carol Brown', email: 'carol@example.com', lastLogin: '2024-01-13' }
        ],
        posts: [
          { id: 1, title: 'React Server Components Guide', author: 'Alice', date: '2024-01-15' },
          { id: 2, title: 'Modern React Patterns', author: 'Bob', date: '2024-01-14' },
          { id: 3, title: 'Building Scalable Apps', author: 'Carol', date: '2024-01-13' }
        ],
        serverTime: new Date().toISOString()
      });
    }, delay);
  });
};

// Simulated Server Component (normally would run on server)
const SimulatedServerComponent: React.FC<{ dataType: 'users' | 'posts' }> = ({ dataType }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const serverData = await simulateServerFetch();
      setData(serverData[dataType]);
      setLoading(false);
    };

    fetchData();
  }, [dataType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
        <Server className="w-6 h-6 text-blue-500 animate-pulse mr-2" />
        <span className="text-gray-600">Server rendering {dataType}...</span>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Server className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="font-semibold text-green-800">Server Component - {dataType}</h3>
        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">SSR</span>
      </div>
      
      <div className="space-y-2">
        {data?.map((item: any) => (
          <div key={item.id} className="bg-white p-3 rounded border">
            {dataType === 'users' ? (
              <>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">{item.email}</div>
                <div className="text-xs text-gray-500">Last login: {item.lastLogin}</div>
              </>
            ) : (
              <>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-600">By {item.author}</div>
                <div className="text-xs text-gray-500">{item.date}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Simulated Client Component
const SimulatedClientComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    setInteractions(prev => prev + 1);
  }, [count]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Monitor className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-blue-800">Client Component</h3>
        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">CSR</span>
      </div>
      
      <div className="space-y-4">
        <div className="text-2xl font-bold text-blue-700">Count: {count}</div>
        <div className="text-sm text-gray-600">Interactions: {interactions}</div>
        
        <div className="space-x-2">
          <button
            onClick={() => setCount(prev => prev + 1)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Increment
          </button>
          <button
            onClick={() => setCount(prev => prev - 1)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Decrement
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <p className="text-xs text-blue-600 mt-2">
          This component requires client-side JavaScript for interactivity
        </p>
      </div>
    </div>
  );
};

// Hybrid Component (combines server and client)
const HybridComponent: React.FC = () => {
  const [showClient, setShowClient] = useState(false);

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Layers className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="font-semibold text-purple-800">Hybrid Component</h3>
        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">SSR + CSR</span>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <p className="text-sm text-gray-700">
            This content is rendered on the server and sent as HTML.
            It's immediately visible to users and search engines.
          </p>
        </div>
        
        <button
          onClick={() => setShowClient(!showClient)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          {showClient ? 'Hide' : 'Show'} Client Content
        </button>
        
        {showClient && (
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-gray-700">
              This content is rendered on the client after user interaction.
              It demonstrates progressive enhancement.
            </p>
            <div className="mt-2 text-xs text-purple-600">
              Rendered at: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ServerComponentsDemo: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeDemo, setActiveDemo] = useState<'basic' | 'comparison' | 'patterns'>('basic');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderBasicDemo = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimulatedServerComponent key={`users-${refreshKey}`} dataType="users" />
        <SimulatedServerComponent key={`posts-${refreshKey}`} dataType="posts" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimulatedClientComponent />
        <HybridComponent />
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Server Components</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Client Components</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Rendering</td>
              <td className="border border-gray-300 px-4 py-2">Server-side</td>
              <td className="border border-gray-300 px-4 py-2">Client-side</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Bundle Size</td>
              <td className="border border-gray-300 px-4 py-2">Zero impact</td>
              <td className="border border-gray-300 px-4 py-2">Increases bundle</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Data Access</td>
              <td className="border border-gray-300 px-4 py-2">Direct server access</td>
              <td className="border border-gray-300 px-4 py-2">API calls required</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Interactivity</td>
              <td className="border border-gray-300 px-4 py-2">None</td>
              <td className="border border-gray-300 px-4 py-2">Full interactivity</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">SEO</td>
              <td className="border border-gray-300 px-4 py-2">Excellent</td>
              <td className="border border-gray-300 px-4 py-2">Requires SSR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Database className="w-4 h-4 mr-2 text-blue-500" />
          Data Fetching
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Server Components can directly access databases and APIs without exposing secrets.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          async function UserList() {'{'}
          <br />
          &nbsp;&nbsp;const users = await db.users.findMany();
          <br />
          &nbsp;&nbsp;return &lt;div&gt;...&lt;/div&gt;;
          <br />
          {'}'}
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Progressive Enhancement
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Start with server-rendered content, add client interactivity as needed.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          // Server Component
          <br />
          function BlogPost() {'{'}
          <br />
          &nbsp;&nbsp;return (
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;article&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;CommentsSection /&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/article&gt;
          <br />
          &nbsp;&nbsp;);
          <br />
          {'}'}
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2 text-green-500" />
          Stream Rendering
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Stream different parts of the page as they become ready.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          &lt;Suspense fallback=&lt;Spinner /&gt;&gt;
          <br />
          &nbsp;&nbsp;&lt;SlowComponent /&gt;
          <br />
          &lt;/Suspense&gt;
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-purple-500" />
          Caching Strategies
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Cache server components at different levels for optimal performance.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          // Cache for 1 hour
          <br />
          export const revalidate = 3600;
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-indigo-500" />
          Component Boundaries
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Clearly separate server and client components for optimal architecture.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          'use client'; // Client Component
          <br />
          <br />
          // No directive = Server Component
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <ArrowRight className="w-4 h-4 mr-2 text-red-500" />
          Migration Path
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Gradually migrate existing apps by identifying static vs interactive parts.
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded font-mono">
          // 1. Identify static components
          <br />
          // 2. Remove 'use client'
          <br />
          // 3. Move data fetching to server
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">React Server Components Demo</h1>
          <p className="text-lg text-gray-600">
            Explore React Server Components concepts and rendering patterns
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demo Controls</h2>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Server Data</span>
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveDemo('basic')}
              className={`px-4 py-2 rounded transition-colors ${
                activeDemo === 'basic' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Basic Demo
            </button>
            <button
              onClick={() => setActiveDemo('comparison')}
              className={`px-4 py-2 rounded transition-colors ${
                activeDemo === 'comparison' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Comparison
            </button>
            <button
              onClick={() => setActiveDemo('patterns')}
              className={`px-4 py-2 rounded transition-colors ${
                activeDemo === 'patterns' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Patterns
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Server className="w-5 h-5 mr-2 text-green-500" />
            {activeDemo === 'basic' && 'Server & Client Components'}
            {activeDemo === 'comparison' && 'Server vs Client Components'}
            {activeDemo === 'patterns' && 'Server Component Patterns'}
          </h2>
          
          {activeDemo === 'basic' && renderBasicDemo()}
          {activeDemo === 'comparison' && renderComparison()}
          {activeDemo === 'patterns' && renderPatterns()}
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Server Components Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are React Server Components?</h3>
            <p className="text-gray-600 mb-4">
              React Server Components (RSC) are a new paradigm that allows components to be rendered on the server, 
              reducing bundle size and improving performance. They run during build time or on the server, 
              giving direct access to backend resources.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Zero bundle size impact for server components</li>
              <li>Direct access to backend resources (databases, files, APIs)</li>
              <li>Improved initial page load performance</li>
              <li>Better SEO and Core Web Vitals</li>
              <li>Simplified data fetching patterns</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">When to Use Server Components</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Static content that doesn't require interactivity</li>
              <li>Data-heavy components that fetch from APIs or databases</li>
              <li>Components that use server-only code or secrets</li>
              <li>Large dependencies that don't need to run on the client</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Limitations</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Cannot use browser-only APIs or event handlers</li>
              <li>Cannot use state or lifecycle methods</li>
              <li>Cannot use custom hooks that depend on state or effects</li>
              <li>Currently requires compatible frameworks (Next.js 13+)</li>
            </ul>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Server Component Use Cases</h4>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Fetching user data from database</li>
                      <li>• Rendering blog posts from CMS</li>
                      <li>• Processing and displaying analytics</li>
                      <li>• Server-side calculations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Client Component Use Cases</h4>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Interactive forms and inputs</li>
                      <li>• Real-time updates and websockets</li>
                      <li>• Browser APIs (geolocation, camera)</li>
                      <li>• Client-side routing</li>
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

export default ServerComponentsDemo; 