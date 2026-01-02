import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Filter,
  Rss,
  TrendingUp,
  Globe,
  User,
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  category: string;
  publishedAt: Date;
  imageUrl: string;
  url: string;
  readTime: number;
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

interface NewsSource {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
}

const NEWS_CATEGORIES = [
  'All',
  'Technology',
  'Business',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Politics',
  'World'
];

const NEWS_SOURCES: NewsSource[] = [
  { id: 'tech-crunch', name: 'TechCrunch', category: 'Technology', isActive: true },
  { id: 'bbc-news', name: 'BBC News', category: 'World', isActive: true },
  { id: 'reuters', name: 'Reuters', category: 'Business', isActive: true },
  { id: 'wired', name: 'Wired', category: 'Technology', isActive: true },
  { id: 'cnn', name: 'CNN', category: 'Politics', isActive: true },
  { id: 'espn', name: 'ESPN', category: 'Sports', isActive: true }
];

// Mock news data generator
const generateMockNews = (count: number = 20): NewsArticle[] => {
  const titles = [
    'Revolutionary AI Technology Transforms Healthcare Industry',
    'Global Climate Summit Reaches Historic Agreement',
    'Breakthrough in Quantum Computing Achieved',
    'Tech Giants Report Record Quarterly Earnings',
    'Space Mission Discovers Water on Mars',
    'New Renewable Energy Source Shows Promise',
    'Cybersecurity Threats Evolve with AI Integration',
    'Scientists Make Progress in Cancer Research',
    'Electric Vehicle Sales Surge Worldwide',
    'Social Media Platforms Face New Regulations',
    'Blockchain Technology Revolutionizes Finance',
    'Remote Work Trends Reshape Urban Planning',
    'Virtual Reality Applications Expand in Education',
    'Gene Therapy Shows Promise for Rare Diseases',
    'Autonomous Vehicles Begin Commercial Testing'
  ];

  const descriptions = [
    'Researchers unveil groundbreaking technology that could reshape entire industries and improve millions of lives worldwide.',
    'International leaders collaborate on unprecedented initiatives to address global challenges and create sustainable solutions.',
    'Scientific breakthrough promises to accelerate innovation and unlock new possibilities for technological advancement.',
    'Market analysis reveals significant trends that could impact economic growth and consumer behavior patterns.',
    'Discovery opens new frontiers for exploration and research, potentially answering fundamental questions about our universe.'
  ];

  const authors = ['Sarah Johnson', 'Michael Chen', 'Emma Rodriguez', 'David Kim', 'Lisa Thompson', 'James Wilson'];
  const sources = NEWS_SOURCES.map(s => s.name);

  return Array.from({ length: count }, (_, i) => ({
    id: `article-${i + 1}`,
    title: titles[i % titles.length],
    description: descriptions[i % descriptions.length],
    content: `This is the full content of the article. ${descriptions[i % descriptions.length]} The implications of this development are far-reaching and could fundamentally change how we approach this field. Experts believe this represents a significant milestone in our understanding and capabilities.`,
    author: authors[i % authors.length],
    source: sources[i % sources.length],
    category: NEWS_CATEGORIES[Math.floor(Math.random() * (NEWS_CATEGORIES.length - 1)) + 1],
    publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    imageUrl: `https://picsum.photos/400/250?random=${i + 1}`,
    url: `https://example.com/article/${i + 1}`,
    readTime: Math.floor(Math.random() * 8) + 2,
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 50),
    isBookmarked: Math.random() > 0.8
  }));
};

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSources, setSelectedSources] = useState<string[]>(NEWS_SOURCES.map(s => s.id));
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate API call to fetch news
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockArticles = generateMockNews(30);
      setArticles(mockArticles);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh news feed
  const refreshNews = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  }, [fetchNews]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSource = selectedSources.includes(
        NEWS_SOURCES.find(s => s.name === article.source)?.id || ''
      );
      
      return matchesSearch && matchesCategory && matchesSource;
    });

    // Sort articles
    if (sortBy === 'latest') {
      filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } else {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  }, [articles, searchTerm, selectedCategory, selectedSources, sortBy]);

  // Toggle bookmark
  const toggleBookmark = useCallback((articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  }, []);

  // Toggle source filter
  const toggleSource = useCallback((sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  }, []);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading News</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Rss className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>
          </div>
          <p className="text-gray-600">
            Stay updated with the latest news from multiple sources and categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {NEWS_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Refresh */}
            <button
              onClick={refreshNews}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">News Sources</h3>
              <div className="flex flex-wrap gap-2">
                {NEWS_SOURCES.map(source => (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedSources.includes(source.id)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Article Image */}
                  <div className="relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      loading={index > 2 ? 'lazy' : 'eager'}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Article Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="w-4 h-4 mr-1" />
                        <span className="mr-3">{article.source}</span>
                        <User className="w-4 h-4 mr-1" />
                        <span className="mr-3">{article.author}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(article.id)}
                        className={`p-1 rounded transition-colors ${
                          article.isBookmarked
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        {article.isBookmarked ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Article Content */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Article Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {article.readTime} min read
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {article.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {article.comments}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Read More
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {['Artificial Intelligence', 'Climate Change', 'Space Exploration', 'Quantum Computing', 'Electric Vehicles'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="text-sm text-gray-700">{topic}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarked Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookmarkCheck className="w-5 h-5 mr-2 text-blue-600" />
                Bookmarked Articles
              </h3>
              <div className="space-y-3">
                {articles.filter(article => article.isBookmarked).slice(0, 3).map(article => (
                  <div key={article.id} className="border-l-2 border-blue-600 pl-3">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500">{formatTimeAgo(article.publishedAt)}</p>
                  </div>
                ))}
                {articles.filter(article => article.isBookmarked).length === 0 && (
                  <p className="text-sm text-gray-500">No bookmarked articles yet.</p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Articles</span>
                  <span className="text-sm font-medium">{articles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bookmarked</span>
                  <span className="text-sm font-medium">{articles.filter(a => a.isBookmarked).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Sources</span>
                  <span className="text-sm font-medium">{selectedSources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="text-sm font-medium">{NEWS_CATEGORIES.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed; 