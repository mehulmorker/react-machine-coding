import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Code,
  Package,
  Layers,
  Globe,
  Shield,
  Zap,
  RefreshCw,
  Settings,
  Users,
  ShoppingCart,
  BarChart3,
  Info,
  Loader
} from 'lucide-react';

// Simulated micro-frontend components
const HeaderMicroApp: React.FC = () => {
  const [user, setUser] = useState({ name: 'John Doe', notifications: 3 });

  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Micro-Frontend App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <div className="relative">
            <Shield className="w-5 h-5" />
            {user.notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {user.notifications}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavigationMicroApp: React.FC<{ onNavigate: (page: string) => void; currentPage: string }> = ({ 
  onNavigate, 
  currentPage 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <ul className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const DashboardMicroApp: React.FC = () => {
  const [stats, setStats] = useState({
    users: 1234,
    products: 567,
    orders: 89,
    revenue: 12450
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        orders: prev.orders + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersMicroApp: React.FC = () => {
  const [users] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Carol Brown', email: 'carol@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'Moderator', status: 'Active' }
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h2>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'Moderator' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Lazy-loaded micro-frontend components
const LazyProductsMicroApp = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
            <div className="bg-white rounded-lg shadow border p-6">
              <p className="text-gray-600">Products micro-frontend loaded dynamically!</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                    <h3 className="font-medium">Product {i}</h3>
                    <p className="text-sm text-gray-500">$99.99</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }, 1000);
  })
);

const MicroFrontendDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [communicationLog, setCommunicationLog] = useState<string[]>([]);

  // Simulate micro-frontend communication
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setCommunicationLog(prev => [
      ...prev,
      `Navigation: Switched to ${page} micro-app`
    ]);
  };

  const addLogEntry = (entry: string) => {
    setCommunicationLog(prev => [...prev.slice(-4), entry]);
  };

  useEffect(() => {
    addLogEntry(`Dashboard micro-app initialized`);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardMicroApp />;
      case 'users':
        return <UsersMicroApp />;
      case 'products':
        return (
          <Suspense fallback={
            <div className="p-6 flex items-center justify-center">
              <Loader className="w-6 h-6 animate-spin mr-2" />
              Loading Products micro-app...
            </div>
          }>
            <LazyProductsMicroApp />
          </Suspense>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentPage}</h2>
            <p className="text-gray-600">This micro-frontend is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Micro-Frontend Demo</h1>
          <p className="text-lg text-gray-600">
            Explore micro-frontend architecture patterns and inter-app communication
          </p>
        </div>
      </div>

      {/* Micro-Frontend Application */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 p-6 border-b flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            Simulated Micro-Frontend Application
          </h2>
          
          <div className="flex flex-col">
            {/* Header Micro-App */}
            <HeaderMicroApp />
            
            <div className="flex">
              {/* Navigation Micro-App */}
              <NavigationMicroApp onNavigate={handleNavigate} currentPage={currentPage} />
              
              {/* Content Micro-App */}
              <div className="flex-1 bg-gray-50">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Communication Log */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Inter-App Communication Log
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-32 overflow-y-auto">
            {communicationLog.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        {/* Architecture Patterns */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-purple-500" />
            Micro-Frontend Patterns
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Module Federation</h3>
              <p className="text-sm text-gray-600">
                Webpack 5 feature for sharing code between applications at runtime.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Single-SPA</h3>
              <p className="text-sm text-gray-600">
                JavaScript framework for building micro-frontends with multiple frameworks.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Iframe Integration</h3>
              <p className="text-sm text-gray-600">
                Simple but limited approach using iframes for complete isolation.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Web Components</h3>
              <p className="text-sm text-gray-600">
                Native browser API for creating reusable custom elements.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Server-Side Includes</h3>
              <p className="text-sm text-gray-600">
                Composing pages on the server side from different micro-frontends.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Build-Time Integration</h3>
              <p className="text-sm text-gray-600">
                Combining micro-frontends during the build process.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Micro-Frontend Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are Micro-Frontends?</h3>
            <p className="text-gray-600 mb-4">
              Micro-frontends extend the microservices concept to frontend development. They allow large 
              frontend applications to be broken down into smaller, more manageable pieces that can be 
              developed and deployed independently by different teams.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Independent deployment and development</li>
              <li>Technology diversity across teams</li>
              <li>Improved scalability and maintainability</li>
              <li>Team autonomy and ownership</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Challenges</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Increased complexity in integration</li>
              <li>Performance overhead</li>
              <li>Consistent user experience</li>
              <li>Shared dependencies management</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Design clear boundaries between micro-frontends</li>
              <li>Establish communication patterns early</li>
              <li>Share design systems and common components</li>
              <li>Monitor performance across all micro-frontends</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Considerations</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Micro-frontends add complexity - ensure the benefits outweigh costs</li>
                    <li>• Consider team structure and organizational needs</li>
                    <li>• Plan for shared state and communication carefully</li>
                    <li>• Implement proper testing strategies across boundaries</li>
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

export default MicroFrontendDemo; 