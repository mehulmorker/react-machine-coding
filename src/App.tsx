import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import UIWidgets from './pages/UIWidgets';
import StateManagement from './pages/StateManagement';
import APIIntegration from './pages/APIIntegration';
import Performance from './pages/Performance';
import SystemDesign from './pages/SystemDesign';
import Algorithms from './pages/Algorithms';
import RealWorld from './pages/RealWorld';
import Advanced from './pages/Advanced';

// UI Widgets & Core Components
import Counter from './components/01-ui-widgets/Counter';
import TodoList from './components/01-ui-widgets/TodoList';
import Accordion from './components/01-ui-widgets/Accordion';
import TabsSystem from './components/01-ui-widgets/TabsSystem';
import ImageCarousel from './components/01-ui-widgets/ImageCarousel';
import Pagination from './components/01-ui-widgets/Pagination';
import StarRating from './components/01-ui-widgets/StarRating';
import Tooltip from './components/01-ui-widgets/Tooltip';
import ToastNotification from './components/01-ui-widgets/ToastNotification';
import Modal from './components/01-ui-widgets/Modal';
import Dropdown from './components/01-ui-widgets/Dropdown';
import DatePicker from './components/01-ui-widgets/DatePicker';
import FileUpload from './components/01-ui-widgets/FileUpload';
import SearchAutocomplete from './components/01-ui-widgets/SearchAutocomplete';
import ProgressIndicator from './components/01-ui-widgets/ProgressIndicator';
import ColorPicker from './components/01-ui-widgets/ColorPicker';
import ToggleSwitch from './components/01-ui-widgets/ToggleSwitch';

// State Management & Data Flow
import ShoppingCartComponent from './components/02-state-management/ShoppingCart';
import VotingSystem from './components/02-state-management/VotingSystem';
import DragDropList from './components/02-state-management/DragDropList';
import KanbanBoard from './components/02-state-management/KanbanBoard';
import FormBuilder from './components/02-state-management/FormBuilder';
import DataTable from './components/02-state-management/DataTable';
import TreeView from './components/02-state-management/TreeView';
import MultiStepForm from './components/02-state-management/MultiStepForm';
import FileExplorer from './components/02-state-management/FileExplorer';
import ChartDashboard from './components/02-state-management/ChartDashboard';

// API Integration & Async UI
import GitHubSearch from './components/03-api-integration/GitHubSearch';
import WeatherApp from './components/03-api-integration/WeatherApp';
import InfiniteScroll from './components/03-api-integration/InfiniteScroll';
import ImageGallery from './components/03-api-integration/ImageGallery';
import NewsFeed from './components/03-api-integration/NewsFeed';
import CurrencyConverter from './components/03-api-integration/CurrencyConverter';
import MovieDatabase from './components/03-api-integration/MovieDatabase';
import RecipeFinder from './components/03-api-integration/RecipeFinder';
import StockTracker from './components/03-api-integration/StockTracker';
import SocialMediaFeed from './components/03-api-integration/SocialMediaFeed';

// Performance Optimization
import VirtualizedList from './components/04-performance/VirtualizedList';
import LazyLoading from './components/04-performance/LazyLoading';
import ImageOptimization from './components/04-performance/ImageOptimization';
import MemoizationDemo from './components/04-performance/MemoizationDemo';
import CodeSplitting from './components/04-performance/CodeSplitting';
import PerformanceMonitor from './components/04-performance/PerformanceMonitor';
import MemoryLeakDemo from './components/04-performance/MemoryLeakDemo';
import WebWorkers from './components/04-performance/WebWorkers';
import BundleAnalyzer from './components/04-performance/BundleAnalyzer';

// System Design & End-to-End Projects
import TicTacToe from './components/05-system-design/TicTacToe';
import ChatApp from './components/05-system-design/ChatApp';
import Calculator from './components/05-system-design/Calculator';
import TimerStopwatch from './components/05-system-design/TimerStopwatch';
import MusicPlayer from './components/05-system-design/MusicPlayer';
import DrawingApp from './components/05-system-design/DrawingApp';
import TextEditor from './components/05-system-design/TextEditor';
import CodeEditor from './components/05-system-design/CodeEditor';
import VideoPlayer from './components/05-system-design/VideoPlayer';
import Whiteboard from './components/05-system-design/Whiteboard';

// Algorithm + UI Challenges
import SnakeGame from './components/06-algorithms/SnakeGame';
import TetrisGame from './components/06-algorithms/TetrisGame';
import PathfindingVisualizer from './components/06-algorithms/PathfindingVisualizer';
import SortingVisualizer from './components/06-algorithms/SortingVisualizer';
import GameOfLife from './components/06-algorithms/GameOfLife';
import MazeGenerator from './components/06-algorithms/MazeGenerator';
import NQueensVisualizer from './components/06-algorithms/NQueensVisualizer';
import BinaryTreeVisualizer from './components/06-algorithms/BinaryTreeVisualizer';
import GraphVisualizer from './components/06-algorithms/GraphVisualizer';
import FractalGenerator from './components/06-algorithms/FractalGenerator';

// Real-World Inspired UI
import LinkedInPost from './components/07-real-world/LinkedInPost';
import NetflixMovieRow from './components/07-real-world/NetflixMovieRow';
import InstagramStory from './components/07-real-world/InstagramStory';
import TwitterTweet from './components/07-real-world/TwitterTweet';
import YouTubePlayer from './components/07-real-world/YouTubePlayer';
import SlackMessage from './components/07-real-world/SlackMessage';
import UberRideBooking from './components/07-real-world/UberRideBooking';
import SpotifyPlayer from './components/07-real-world/SpotifyPlayer';
import AmazonProductCard from './components/07-real-world/AmazonProductCard';
import AirbnbListing from './components/07-real-world/AirbnbListing';

// Advanced Concepts & Hooks
import CustomHooksDemo from './components/08-advanced/CustomHooksDemo';
import HOCDemo from './components/08-advanced/HOCDemo';
import RenderPropsDemo from './components/08-advanced/RenderPropsDemo';
import ContextAPIDemo from './components/08-advanced/ContextAPIDemo';
import ErrorBoundaryDemo from './components/08-advanced/ErrorBoundaryDemo';
import PortalsDemo from './components/08-advanced/PortalsDemo';
import SuspenseDemo from './components/08-advanced/SuspenseDemo';
import ConcurrentFeaturesDemo from './components/08-advanced/ConcurrentFeaturesDemo';
import MicroFrontendDemo from './components/08-advanced/MicroFrontendDemo';
import ServerComponentsDemo from './components/08-advanced/ServerComponentsDemo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Category Overview Pages */}
            <Route path="/ui-widgets" element={<UIWidgets />} />
            <Route path="/state-management" element={<StateManagement />} />
            <Route path="/api-integration" element={<APIIntegration />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/real-world" element={<RealWorld />} />
            <Route path="/advanced" element={<Advanced />} />
            
            {/* UI Widgets & Core Components */}
            <Route path="/counter" element={<Counter />} />
            <Route path="/todo-list" element={<TodoList />} />
            <Route path="/accordion" element={<Accordion />} />
            <Route path="/tabs" element={<TabsSystem />} />
            <Route path="/carousel" element={<ImageCarousel />} />
            <Route path="/pagination" element={<Pagination />} />
            <Route path="/star-rating" element={<StarRating />} />
            <Route path="/tooltip" element={<Tooltip />} />
            <Route path="/toast" element={<ToastNotification />} />
            <Route path="/modal" element={<Modal />} />
            <Route path="/dropdown" element={<Dropdown />} />
            <Route path="/date-picker" element={<DatePicker />} />
            <Route path="/file-upload" element={<FileUpload />} />
            <Route path="/search-autocomplete" element={<SearchAutocomplete />} />
            <Route path="/progress-indicator" element={<ProgressIndicator />} />
            <Route path="/color-picker" element={<ColorPicker />} />
            <Route path="/toggle-switch" element={<ToggleSwitch />} />
            
            {/* State Management & Data Flow */}
            <Route path="/shopping-cart" element={<ShoppingCartComponent />} />
            <Route path="/voting-system" element={<VotingSystem />} />
            <Route path="/drag-drop-list" element={<DragDropList />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/data-table" element={<DataTable />} />
            <Route path="/tree-view" element={<TreeView />} />
            <Route path="/multi-step-form" element={<MultiStepForm />} />
            <Route path="/file-explorer" element={<FileExplorer />} />
            <Route path="/chart-dashboard" element={<ChartDashboard />} />
            
            {/* API Integration & Async UI */}
            <Route path="/github-search" element={<GitHubSearch />} />
            <Route path="/weather-app" element={<WeatherApp />} />
            <Route path="/infinite-scroll" element={<InfiniteScroll />} />
            <Route path="/image-gallery" element={<ImageGallery />} />
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/movie-database" element={<MovieDatabase />} />
            <Route path="/recipe-finder" element={<RecipeFinder />} />
            <Route path="/stock-tracker" element={<StockTracker />} />
            <Route path="/social-feed" element={<SocialMediaFeed />} />
            
            {/* Performance Optimization */}
            <Route path="/virtualized-list" element={<VirtualizedList />} />
            <Route path="/lazy-loading" element={<LazyLoading />} />
            <Route path="/image-optimization" element={<ImageOptimization />} />
            <Route path="/memoization-demo" element={<MemoizationDemo />} />
            <Route path="/code-splitting" element={<CodeSplitting />} />
            <Route path="/performance-monitor" element={<PerformanceMonitor />} />
            <Route path="/memory-leak-demo" element={<MemoryLeakDemo />} />
            <Route path="/web-workers" element={<WebWorkers />} />
            <Route path="/bundle-analyzer" element={<BundleAnalyzer />} />

            {/* System Design Routes */}
            <Route path="/system-design/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/system-design/chat-app" element={<ChatApp />} />
            <Route path="/system-design/calculator" element={<Calculator />} />
            <Route path="/system-design/timer-stopwatch" element={<TimerStopwatch />} />
            <Route path="/system-design/music-player" element={<MusicPlayer />} />
            <Route path="/system-design/drawing-app" element={<DrawingApp />} />
            <Route path="/system-design/text-editor" element={<TextEditor />} />
            <Route path="/system-design/code-editor" element={<CodeEditor />} />
            <Route path="/system-design/video-player" element={<VideoPlayer />} />
            <Route path="/system-design/whiteboard" element={<Whiteboard />} />

            {/* Algorithm + UI Challenges Routes */}
            <Route path="/snake-game" element={<SnakeGame />} />
            <Route path="/tetris" element={<TetrisGame />} />
            <Route path="/pathfinding" element={<PathfindingVisualizer />} />
            <Route path="/sorting-visualizer" element={<SortingVisualizer />} />
            <Route path="/game-of-life" element={<GameOfLife />} />
            <Route path="/maze-generator" element={<MazeGenerator />} />
            <Route path="/n-queens" element={<NQueensVisualizer />} />
            <Route path="/binary-tree" element={<BinaryTreeVisualizer />} />
            <Route path="/graph-visualizer" element={<GraphVisualizer />} />
            <Route path="/fractals" element={<FractalGenerator />} />

            {/* Real-World Inspired UI Routes */}
            <Route path="/linkedin-post" element={<LinkedInPost />} />
            <Route path="/netflix-movies" element={<NetflixMovieRow />} />
            <Route path="/instagram-stories" element={<InstagramStory />} />
            <Route path="/twitter-tweet" element={<TwitterTweet />} />
            <Route path="/youtube-player" element={<YouTubePlayer />} />
            <Route path="/slack-message" element={<SlackMessage />} />
            <Route path="/uber-ride-booking" element={<UberRideBooking />} />
            <Route path="/spotify-player" element={<SpotifyPlayer />} />
            <Route path="/amazon-product-card" element={<AmazonProductCard />} />
            <Route path="/airbnb-listing" element={<AirbnbListing />} />

            {/* Advanced Concepts Routes */}
            <Route path="/advanced/custom-hooks" element={<CustomHooksDemo />} />
            <Route path="/advanced/hoc" element={<HOCDemo />} />
            <Route path="/advanced/render-props" element={<RenderPropsDemo />} />
            <Route path="/advanced/context-api" element={<ContextAPIDemo />} />
            <Route path="/advanced/error-boundary" element={<ErrorBoundaryDemo />} />
            <Route path="/advanced/portals" element={<PortalsDemo />} />
            <Route path="/advanced/suspense" element={<SuspenseDemo />} />
            <Route path="/advanced/concurrent-features" element={<ConcurrentFeaturesDemo />} />
            <Route path="/advanced/micro-frontend" element={<MicroFrontendDemo />} />
            <Route path="/advanced/server-components" element={<ServerComponentsDemo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
