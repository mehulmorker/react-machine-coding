import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Cloud, 
  Infinity, 
  Image, 
  Rss, 
  DollarSign, 
  Film, 
  ChefHat, 
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Globe
} from 'lucide-react';

interface ComponentInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
  features: string[];
}

const APIIntegration: React.FC = () => {
  const components: ComponentInfo[] = [
    {
      title: 'GitHub User Search',
      description: 'Search GitHub users with real-time API integration, user profiles, and repository listings',
      icon: <Search className="w-6 h-6" />,
      path: '/github-search',
      difficulty: 'Easy',
      concepts: ['REST API', 'Async/Await', 'Error Handling', 'Debouncing'],
      features: ['User search', 'Profile display', 'Repository list', 'Pagination', 'Error states']
    },
    {
      title: 'Weather App',
      description: 'Real-time weather information with location detection, forecasts, and weather maps',
      icon: <Cloud className="w-6 h-6" />,
      path: '/weather-app',
      difficulty: 'Medium',
      concepts: ['Geolocation API', 'Weather API', 'Real-time Data', 'Location Services'],
      features: ['Current weather', '7-day forecast', 'Location detection', 'Weather icons', 'Multiple units']
    },
    {
      title: 'Infinite Scroll',
      description: 'Infinite scrolling implementation with performance optimization and loading states',
      icon: <Infinity className="w-6 h-6" />,
      path: '/infinite-scroll',
      difficulty: 'Medium',
      concepts: ['Intersection Observer', 'Performance', 'Virtualization', 'Lazy Loading'],
      features: ['Infinite loading', 'Smooth scrolling', 'Loading indicators', 'Error recovery', 'Performance optimization']
    },
    {
      title: 'Image Gallery',
      description: 'Dynamic image gallery with search, filters, lightbox, and infinite loading',
      icon: <Image className="w-6 h-6" />,
      path: '/image-gallery',
      difficulty: 'Medium',
      concepts: ['Image API', 'Lazy Loading', 'Modal System', 'Image Optimization'],
      features: ['Image search', 'Lightbox view', 'Infinite scroll', 'Categories', 'Download functionality']
    },
    {
      title: 'News Feed',
      description: 'Real-time news aggregation with multiple sources, categories, and search functionality',
      icon: <Rss className="w-6 h-6" />,
      path: '/news-feed',
      difficulty: 'Hard',
      concepts: ['News API', 'Real-time Updates', 'Filtering', 'Caching'],
      features: ['Multiple sources', 'Category filters', 'Search articles', 'Bookmarks', 'Real-time updates']
    },
    {
      title: 'Currency Converter',
      description: 'Real-time currency conversion with historical data and exchange rate charts',
      icon: <DollarSign className="w-6 h-6" />,
      path: '/currency-converter',
      difficulty: 'Medium',
      concepts: ['Exchange Rate API', 'Real-time Data', 'Charts', 'Number Formatting'],
      features: ['Live rates', 'Currency calculator', 'Historical charts', 'Rate alerts', 'Favorite currencies']
    },
    {
      title: 'Movie Database',
      description: 'Comprehensive movie search with detailed information, ratings, and watchlists',
      icon: <Film className="w-6 h-6" />,
      path: '/movie-database',
      difficulty: 'Hard',
      concepts: ['Movie API', 'Complex Filtering', 'Detailed Views', 'User Preferences'],
      features: ['Movie search', 'Detailed info', 'Ratings', 'Watchlist', 'Recommendations', 'Trailers']
    },
    {
      title: 'Recipe Finder',
      description: 'Recipe search with ingredients, dietary filters, nutrition info, and meal planning',
      icon: <ChefHat className="w-6 h-6" />,
      path: '/recipe-finder',
      difficulty: 'Medium',
      concepts: ['Recipe API', 'Complex Filters', 'Nutrition Data', 'Meal Planning'],
      features: ['Recipe search', 'Ingredient filters', 'Nutrition info', 'Meal planner', 'Shopping list']
    },
    {
      title: 'Stock Tracker',
      description: 'Real-time stock market data with charts, watchlists, and portfolio tracking',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/stock-tracker',
      difficulty: 'Hard',
      concepts: ['Stock API', 'Real-time Data', 'Financial Charts', 'Portfolio Management'],
      features: ['Stock quotes', 'Price charts', 'Watchlist', 'Portfolio tracking', 'Market news', 'Alerts']
    },
    {
      title: 'Social Media Feed',
      description: 'Social media-style feed with posts, comments, likes, and real-time interactions',
      icon: <MessageSquare className="w-6 h-6" />,
      path: '/social-feed',
      difficulty: 'Hard',
      concepts: ['Social API', 'Real-time Updates', 'Infinite Scroll', 'User Interactions'],
      features: ['Post feed', 'Like/Comment', 'Real-time updates', 'User profiles', 'Media uploads', 'Notifications']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = components.length; // Will be updated as we implement
  const totalCount = components.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Integration & Async UI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Master real-world API integrations with async data handling, loading states, error management, 
            and performance optimization techniques essential for modern web applications.
          </p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((completedCount / totalCount) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Concepts Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="w-5 h-5" />, title: 'REST APIs', desc: 'HTTP requests & responses' },
              { icon: <Clock className="w-5 h-5" />, title: 'Async Patterns', desc: 'Promises, async/await' },
              { icon: <Star className="w-5 h-5" />, title: 'Error Handling', desc: 'Graceful error management' },
              { icon: <Infinity className="w-5 h-5" />, title: 'Performance', desc: 'Optimization techniques' }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-blue-600">{concept.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{concept.title}</h3>
                <p className="text-sm text-gray-600">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((component, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-blue-600">{component.icon}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                    {component.difficulty}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {component.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {component.description}
                </p>

                {/* Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Concepts:</h4>
                  <div className="flex flex-wrap gap-1">
                    {component.concepts.map((concept, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {component.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                    {component.features.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{component.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <Link
                  to={component.path}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                >
                  Explore Component
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalCount}</div>
            <div className="text-gray-600">Total Components</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {components.reduce((acc, comp) => acc + comp.features.length, 0)}
            </div>
            <div className="text-gray-600">Total Features</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIIntegration; 