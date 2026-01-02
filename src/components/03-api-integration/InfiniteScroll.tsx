import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Search,
  Filter,
  ArrowUp
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  avatar: string;
}

interface InfiniteScrollState {
  items: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  filter: string;
  searchTerm: string;
  totalLoaded: number;
}

// Mock data generator
const generateMockUsers = (page: number, count: number = 20): User[] => {
  const users: User[] = [];
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Davis', 'Eve Miller', 'Frank Garcia', 'Grace Lee', 'Henry Wilson'];
  const companies = ['TechCorp', 'DataSoft', 'CloudTech', 'WebSolutions', 'MobileLabs', 'AICompany', 'BlockchainCorp', 'CyberSoft', 'DevStudio', 'CodeLabs'];
  const domains = ['email.com', 'mail.com', 'web.com', 'tech.com', 'data.com'];

  for (let i = 0; i < count; i++) {
    const id = (page - 1) * count + i + 1;
    const name = names[Math.floor(Math.random() * names.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    users.push({
      id,
      name: `${name} ${id}`,
      username: `user${id}`,
      email: `user${id}@${domain}`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `https://${company.toLowerCase()}.com`,
      company: {
        name: company,
        catchPhrase: 'Innovative solutions for tomorrow',
        bs: 'cutting-edge technology'
      },
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        suite: `Suite ${Math.floor(Math.random() * 999) + 1}`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        zipcode: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${id}`
    });
  }

  return users;
};

const InfiniteScroll: React.FC = () => {
  const [state, setState] = useState<InfiniteScrollState>({
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    filter: 'all',
    searchTerm: '',
    totalLoaded: 0
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const scrollTopRef = useRef<HTMLButtonElement | null>(null);

  // Load more items
  const loadMoreItems = useCallback(async (page: number, reset: boolean = false) => {
    if (state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newItems = generateMockUsers(page, 20);
      
      // Simulate API limit (max 200 items)
      const hasMore = page < 10;

      setState(prev => ({
        ...prev,
        items: reset ? newItems : [...prev.items, ...newItems],
        loading: false,
        hasMore,
        page: hasMore ? page + 1 : prev.page,
        totalLoaded: reset ? newItems.length : prev.totalLoaded + newItems.length,
        error: null
      }));

    } catch (error) {
      console.error('Error loading items:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load items. Please try again.'
      }));
    }
  }, [state.loading]);

  // Initialize intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && state.hasMore && !state.loading) {
          loadMoreItems(state.page);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [state.hasMore, state.loading, state.page, loadMoreItems]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTopRef.current) {
        if (window.scrollY > 500) {
          scrollTopRef.current.classList.remove('opacity-0', 'pointer-events-none');
        } else {
          scrollTopRef.current.classList.add('opacity-0', 'pointer-events-none');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items
  const filteredItems = state.items.filter(item => {
    const matchesSearch = state.searchTerm === '' || 
      item.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.company.name.toLowerCase().includes(state.searchTerm.toLowerCase());

    const matchesFilter = state.filter === 'all' || 
      (state.filter === 'tech' && item.company.name.toLowerCase().includes('tech')) ||
      (state.filter === 'data' && item.company.name.toLowerCase().includes('data')) ||
      (state.filter === 'web' && item.company.name.toLowerCase().includes('web'));

    return matchesSearch && matchesFilter;
  });

  // Reset and reload
  const resetAndReload = useCallback(() => {
    setState(prev => ({
      ...prev,
      items: [],
      page: 1,
      hasMore: true,
      totalLoaded: 0,
      error: null
    }));
    loadMoreItems(1, true);
  }, [loadMoreItems]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    loadMoreItems(1, true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Infinite Scroll Demo</h1>
            </div>
            <button
              onClick={resetAndReload}
              disabled={state.loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${state.loading ? 'animate-spin' : ''}`} />
              <span>Reload</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users, emails, or companies..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={state.filter}
                onChange={(e) => setState(prev => ({ ...prev, filter: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Companies</option>
                <option value="tech">Tech Companies</option>
                <option value="data">Data Companies</option>
                <option value="web">Web Companies</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
              Showing {filteredItems.length} of {state.totalLoaded} loaded items
              {state.hasMore && ' (more available)'}
            </div>
            <div className="flex items-center space-x-4">
              <span>Page: {state.page - 1}</span>
              <span>•</span>
              <span>Total Loaded: {state.totalLoaded}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full bg-gray-100"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">@{user.username}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Building className="w-4 h-4" />
                        <span className="truncate">{user.company.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{user.address.city}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Globe className="w-4 h-4" />
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 truncate"
                        >
                          {user.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 italic">
                    "{user.company.catchPhrase}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : !state.loading && state.items.length > 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No items match your current search and filter criteria.</p>
          </div>
        ) : null}

        {/* Loading Indicator */}
        {state.loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading more users...</span>
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={loadingRef} className="h-10" />

        {/* End of Data */}
        {!state.hasMore && !state.loading && state.items.length > 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">You've reached the end!</p>
            <p className="text-sm text-gray-400">
              Loaded {state.totalLoaded} users total
            </p>
          </div>
        )}

        {/* No Initial Data */}
        {!state.loading && state.items.length === 0 && !state.error && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Infinite Scroll Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Scroll down to automatically load more users as you reach the bottom
            </p>
            <div className="text-sm text-gray-500">
              <p>Features:</p>
              <ul className="mt-2 space-y-1">
                <li>• Intersection Observer for performance</li>
                <li>• Automatic loading on scroll</li>
                <li>• Search and filter functionality</li>
                <li>• Loading states and error handling</li>
                <li>• Smooth scrolling and optimization</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <button
        ref={scrollTopRef}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 opacity-0 pointer-events-none z-50"
        title="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default InfiniteScroll; 