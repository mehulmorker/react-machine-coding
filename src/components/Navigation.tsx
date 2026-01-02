import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Home, Github } from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
}

interface NavCategory {
  category: string;
  items: NavItem[];
  categoryPath?: string; // Add optional category path
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const navigationData: NavCategory[] = [
    {
      category: 'UI Widgets & Core Components',
      categoryPath: '/ui-widgets',
      items: [
        { title: 'Counter App', path: '/counter' },
        { title: 'Todo List', path: '/todo-list' },
        { title: 'Accordion', path: '/accordion' },
        { title: 'Tabs System', path: '/tabs' },
        { title: 'Image Carousel', path: '/carousel' },
        { title: 'Pagination', path: '/pagination' },
        { title: 'Star Rating', path: '/star-rating' },
        { title: 'Tooltip', path: '/tooltip' },
        { title: 'Toast Notification', path: '/toast' },
        { title: 'Modal/Popup', path: '/modal' },
        { title: 'Dropdown', path: '/dropdown' },
        { title: 'Date Picker', path: '/date-picker' },
        { title: 'File Upload', path: '/file-upload' },
        { title: 'Search Autocomplete', path: '/search-autocomplete' },
        { title: 'Progress Indicator', path: '/progress-indicator' },
        { title: 'Color Picker', path: '/color-picker' },
        { title: 'Toggle Switch', path: '/toggle-switch' },
      ]
    },
    {
      category: 'State Management & Data Flow',
      categoryPath: '/state-management',
      items: [
        { title: 'Shopping Cart', path: '/shopping-cart' },
        { title: 'Voting System', path: '/voting-system' },
        { title: 'Drag & Drop List', path: '/drag-drop-list' },
        { title: 'Dynamic Form Builder', path: '/form-builder' },
        { title: 'Kanban Board', path: '/kanban' },
        { title: 'Data Table', path: '/data-table' },
        { title: 'Tree View', path: '/tree-view' },
        { title: 'Multi-Step Form', path: '/multi-step-form' },
        { title: 'File Explorer', path: '/file-explorer' },
        { title: 'Chart Dashboard', path: '/chart-dashboard' },
      ]
    },
    {
      category: 'API Integration & Async UI',
      categoryPath: '/api-integration',
      items: [
        { title: 'GitHub User Search', path: '/github-search' },
        { title: 'Weather App', path: '/weather-app' },
        { title: 'Infinite Scroll', path: '/infinite-scroll' },
        { title: 'Image Gallery', path: '/image-gallery' },
        { title: 'News Feed', path: '/news-feed' },
        { title: 'Currency Converter', path: '/currency-converter' },
        { title: 'Movie Database', path: '/movie-database' },
        { title: 'Recipe Finder', path: '/recipe-finder' },
        { title: 'Stock Tracker', path: '/stock-tracker' },
        { title: 'Social Media Feed', path: '/social-feed' },
      ]
    },
    {
      category: 'Performance Optimization',
      categoryPath: '/performance',
      items: [
        { title: 'Virtualized List', path: '/virtualized-list' },
        { title: 'Lazy Loading', path: '/lazy-loading' },
        { title: 'Image Optimization', path: '/image-optimization' },
        { title: 'Memoization Demo', path: '/memoization-demo' },
        { title: 'Code Splitting', path: '/code-splitting' },
        { title: 'Bundle Analyzer', path: '/bundle-analyzer' },
        { title: 'Performance Monitor', path: '/performance-monitor' },
        { title: 'Memory Leak Demo', path: '/memory-leak-demo' },
        { title: 'Web Workers', path: '/web-workers' },
      ]
    },
    {
      category: 'System Design Projects',
      categoryPath: '/system-design',
      items: [
        { title: 'Tic-Tac-Toe Game', path: '/system-design/tic-tac-toe' },
        { title: 'Chat Application UI', path: '/system-design/chat-app' },
        { title: 'Music Player', path: '/system-design/music-player' },
        { title: 'Drawing App', path: '/system-design/drawing-app' },
        { title: 'Calculator', path: '/system-design/calculator' },
        { title: 'Timer/Stopwatch', path: '/system-design/timer-stopwatch' },
        { title: 'Text Editor', path: '/system-design/text-editor' },
        { title: 'Code Editor', path: '/system-design/code-editor' },
        { title: 'Whiteboard', path: '/system-design/whiteboard' },
        { title: 'Video Player', path: '/system-design/video-player' },
      ]
    },
    {
      category: 'Algorithm + UI Challenges',
      categoryPath: '/algorithms',
      items: [
        { title: 'Snake Game', path: '/snake-game' },
        { title: 'Tetris Game', path: '/tetris' },
        { title: 'Pathfinding Visualizer', path: '/pathfinding' },
        { title: 'Sorting Visualizer', path: '/sorting-visualizer' },
        { title: 'Conway\'s Game of Life', path: '/game-of-life' },
        { title: 'Maze Generator', path: '/maze-generator' },
        { title: 'N-Queens Visualizer', path: '/n-queens' },
        { title: 'Binary Tree Visualizer', path: '/binary-tree' },
        { title: 'Graph Visualizer', path: '/graph-visualizer' },
        { title: 'Fractal Generator', path: '/fractals' },
      ]
    },
    {
      category: 'Real-World Inspired UI',
      categoryPath: '/real-world',
      items: [
        { title: 'LinkedIn Post Card', path: '/linkedin-post' },
        { title: 'Netflix Movie Row', path: '/netflix-movies' },
        { title: 'Instagram Story', path: '/instagram-story' },
        { title: 'Twitter Tweet', path: '/twitter-tweet' },
        { title: 'YouTube Video Card', path: '/youtube-player' },
        { title: 'Spotify Playlist', path: '/spotify-player' },
        { title: 'Amazon Product Card', path: '/amazon-product-card' },
        { title: 'Airbnb Listing', path: '/airbnb-listing' },
        { title: 'Uber Ride Card', path: '/uber-ride-booking' },
        { title: 'Slack Message', path: '/slack-message' },
      ]
    },
    {
      category: 'Advanced Concepts & Hooks',
      categoryPath: '/advanced',
      items: [
        { title: 'Custom Hooks Demo', path: '/advanced/custom-hooks' },
        { title: 'Higher-Order Components', path: '/advanced/hoc' },
        { title: 'Render Props Pattern', path: '/advanced/render-props' },
        { title: 'Context API Demo', path: '/advanced/context-api' },
        { title: 'Error Boundaries', path: '/advanced/error-boundary' },
        { title: 'Portals Demo', path: '/advanced/portals' },
        { title: 'Suspense & Lazy', path: '/advanced/suspense' },
        { title: 'Concurrent Features', path: '/advanced/concurrent-features' },
        { title: 'Micro Frontend', path: '/advanced/micro-frontend' },
        { title: 'Server Components', path: '/advanced/server-components' },
      ]
    }
  ];

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <Home className="h-6 w-6" />
              <span>React Machine Coding</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationData.map((category) => (
              <div key={category.category} className={category.categoryPath ? "relative" : "relative group"}>
                {category.categoryPath ? (
                  // If category has a path, make it clickable without dropdown
                  <Link
                    to={category.categoryPath}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    {category.category.split(' ')[0]}
                  </Link>
                ) : (
                  // Otherwise, make it a dropdown button
                  <>
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                      onClick={() => toggleCategory(category.category)}
                    >
                      {category.category.split(' ')[0]}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    
                    <div className={`absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 ${
                      openCategories.includes(category.category) ? 'block' : 'hidden'
                    } group-hover:block`}>
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {category.category}
                        </div>
                        {category.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => setOpenCategories([])}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* GitHub Link */}
            <a
              href="https://github.com/mehulmorker/react-machine-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              aria-label="View source code on GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </div>

          {/* Mobile menu button and GitHub link */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://github.com/mehulmorker/react-machine-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="View source code on GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {/* GitHub Link in Mobile Menu */}
            <a
              href="https://github.com/mehulmorker/react-machine-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Github className="h-5 w-5" />
              <span>View Source Code on GitHub</span>
            </a>
            <div className="border-t border-gray-200 my-2"></div>
            {navigationData.map((category) => (
              <div key={category.category}>
                {category.categoryPath ? (
                  // If category has a path, make it clickable in mobile too (no dropdown)
                  <Link
                    to={category.categoryPath}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.category}
                  </Link>
                ) : (
                  // Otherwise, show dropdown functionality
                  <>
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-between"
                    >
                      {category.category}
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${
                        openCategories.includes(category.category) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {openCategories.includes(category.category) && (
                      <div className="pl-4 space-y-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 