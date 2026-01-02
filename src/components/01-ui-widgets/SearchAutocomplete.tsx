import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight,
  Star,
  MapPin,
  User,
  Calendar,
  Hash,
  Clock,
  Loader2,
  ChevronDown
} from 'lucide-react';

interface SuggestionItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  icon?: React.ComponentType<{ className?: string }>;
  metadata?: any;
}

interface SearchAutocompleteProps {
  suggestions?: SuggestionItem[];
  onSearch?: (query: string) => void;
  onSelect?: (item: SuggestionItem) => void;
  placeholder?: string;
  maxResults?: number;
  minLength?: number;
  showCategories?: boolean;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  debounceMs?: number;
  className?: string;
}

/**
 * Search Autocomplete Component
 * 
 * Features:
 * - Real-time search suggestions
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Category grouping
 * - Custom suggestion templates
 * - Debounced search
 * - Loading states
 * - Highlighting of matched text
 * - Recent searches
 * - No results state
 * - API integration simulation
 */
const SearchAutocompleteDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategories, setShowCategories] = useState(true);
  const [maxResults, setMaxResults] = useState(10);
  const [minLength, setMinLength] = useState(1);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [debounceMs, setDebounceMs] = useState(300);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Sample data
  const allSuggestions: SuggestionItem[] = [
    {
      id: '1',
      title: 'React Components',
      subtitle: 'UI development framework',
      category: 'Technology',
      icon: Star,
      metadata: { type: 'framework', popularity: 95 }
    },
    {
      id: '2',
      title: 'JavaScript ES6',
      subtitle: 'Modern JavaScript features',
      category: 'Technology',
      icon: Star,
      metadata: { type: 'language', popularity: 90 }
    },
    {
      id: '3',
      title: 'New York City',
      subtitle: 'The Big Apple, United States',
      category: 'Location',
      icon: MapPin,
      metadata: { country: 'US', population: '8.4M' }
    },
    {
      id: '4',
      title: 'San Francisco',
      subtitle: 'California, United States',
      category: 'Location',
      icon: MapPin,
      metadata: { country: 'US', population: '874K' }
    },
    {
      id: '5',
      title: 'John Doe',
      subtitle: 'Software Engineer at Tech Corp',
      category: 'People',
      icon: User,
      metadata: { role: 'engineer', company: 'Tech Corp' }
    },
    {
      id: '6',
      title: 'Jane Smith',
      subtitle: 'Product Manager at StartUp Inc',
      category: 'People',
      icon: User,
      metadata: { role: 'pm', company: 'StartUp Inc' }
    },
    {
      id: '7',
      title: 'Project Alpha',
      subtitle: 'Due: Next Monday',
      category: 'Projects',
      icon: Calendar,
      metadata: { status: 'active', deadline: '2024-01-15' }
    },
    {
      id: '8',
      title: 'Meeting Notes',
      subtitle: 'Team standup from yesterday',
      category: 'Documents',
      icon: Hash,
      metadata: { type: 'notes', date: '2024-01-10' }
    },
    {
      id: '9',
      title: 'TypeScript Tutorial',
      subtitle: 'Learn TypeScript in 30 minutes',
      category: 'Technology',
      icon: Star,
      metadata: { type: 'tutorial', duration: '30min' }
    },
    {
      id: '10',
      title: 'London',
      subtitle: 'United Kingdom',
      category: 'Location',
      icon: MapPin,
      metadata: { country: 'UK', population: '9M' }
    }
  ];

  const filteredSuggestions = useMemo(() => {
    if (selectedCategory === 'all') return allSuggestions;
    return allSuggestions.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allSuggestions.map(item => item.category))).filter(Boolean);
    return ['all', ...cats];
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        return updated;
      });
    }
  };

  const handleSelect = (item: SuggestionItem) => {
    console.log('Selected:', item);
  };

  const simulateAsyncSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Search Autocomplete Component</h1>
          <p className="text-gray-600">
            Intelligent search with suggestions, categories, and keyboard navigation
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Max Results:</span>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Debounce:</span>
            <select
              value={debounceMs}
              onChange={(e) => setDebounceMs(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>0ms</option>
              <option value={300}>300ms</option>
              <option value={500}>500ms</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCategories}
              onChange={(e) => setShowCategories(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Categories</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Disabled</span>
          </label>

          <button
            onClick={simulateAsyncSearch}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simulate Loading
          </button>
        </div>

        {/* Search Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Search Examples</h2>
          
          {/* Basic Search */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Search Autocomplete</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    All Categories Search
                  </label>
                  <SearchAutocompleteComponent
                    suggestions={filteredSuggestions}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    placeholder="Search anything..."
                    maxResults={maxResults}
                    minLength={minLength}
                    showCategories={showCategories}
                    loading={loading}
                    disabled={disabled}
                    size={size}
                    debounceMs={debounceMs}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technology Only
                  </label>
                  <SearchAutocompleteComponent
                    suggestions={allSuggestions.filter(s => s.category === 'Technology')}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    placeholder="Search technology..."
                    maxResults={5}
                    minLength={1}
                    showCategories={false}
                    disabled={disabled}
                    size={size}
                    debounceMs={debounceMs}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    People Search
                  </label>
                  <SearchAutocompleteComponent
                    suggestions={allSuggestions.filter(s => s.category === 'People')}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    placeholder="Search people..."
                    maxResults={5}
                    minLength={1}
                    showCategories={false}
                    disabled={disabled}
                    size={size}
                    debounceMs={debounceMs}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Recent Searches */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Searches</h4>
                  {recentSearches.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent searches</p>
                  ) : (
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{search}</span>
                        </div>
                      ))}
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear history
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Search Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Items:</span>
                      <div className="font-medium">{filteredSuggestions.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Categories:</span>
                      <div className="font-medium">{categories.length - 1}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Recent Searches:</span>
                      <div className="font-medium">{recentSearches.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Results:</span>
                      <div className="font-medium">{maxResults}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <div className="font-medium">{selectedCategory === 'all' ? 'All' : selectedCategory}</div>
            </div>
            <div>
              <span className="text-gray-600">Max Results:</span>
              <div className="font-medium">{maxResults}</div>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <div className="font-medium capitalize">{size}</div>
            </div>
            <div>
              <span className="text-gray-600">Debounce:</span>
              <div className="font-medium">{debounceMs}ms</div>
            </div>
            <div>
              <span className="text-gray-600">Categories:</span>
              <div className="font-medium">{showCategories ? 'Shown' : 'Hidden'}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-medium">{disabled ? 'Disabled' : 'Active'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchAutocompleteComponent: React.FC<SearchAutocompleteProps> = ({
  suggestions = [],
  onSearch,
  onSelect,
  placeholder = 'Search...',
  maxResults = 10,
  minLength = 1,
  showCategories = true,
  loading = false,
  disabled = false,
  size = 'md',
  debounceMs = 300,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Filter suggestions based on debounced query
  const filteredSuggestions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minLength) return [];
    
    const filtered = suggestions.filter(item =>
      item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase()))
    );

    return filtered.slice(0, maxResults);
  }, [debouncedQuery, suggestions, minLength, maxResults]);

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    if (!showCategories) return { '': filteredSuggestions };
    
    const groups: Record<string, SuggestionItem[]> = {};
    filteredSuggestions.forEach(item => {
      const category = item.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    
    return groups;
  }, [filteredSuggestions, showCategories]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2 text-base';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= minLength);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    const flatSuggestions = Object.values(groupedSuggestions).flat();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < flatSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : flatSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && flatSuggestions[focusedIndex]) {
          handleSelect(flatSuggestions[focusedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.title);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect?.(item);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900">{part}</mark>
      ) : part
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= minLength && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-10 border border-gray-300 rounded-lg
            ${getSizeClasses()}
            ${disabled 
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
          `}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            disabled={disabled}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No results found for "{debouncedQuery}"</p>
            </div>
          ) : (
            <div>
              {Object.entries(groupedSuggestions).map(([category, items]) => {
                let itemIndex = 0;
                Object.values(groupedSuggestions).forEach((group, groupIndex) => {
                  if (groupIndex < Object.keys(groupedSuggestions).indexOf(category)) {
                    itemIndex += group.length;
                  }
                });

                return (
                  <div key={category}>
                    {showCategories && category && (
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                        {category}
                      </div>
                    )}
                    {items.map((item, index) => {
                      const globalIndex = itemIndex + index;
                      const isFocused = globalIndex === focusedIndex;
                      const IconComponent = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`
                            px-3 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                            ${isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'}
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            {IconComponent && (
                              <IconComponent className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {highlightMatch(item.title, debouncedQuery)}
                              </div>
                              {item.subtitle && (
                                <div className="text-sm text-gray-500">
                                  {highlightMatch(item.subtitle, debouncedQuery)}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocompleteDemo; 