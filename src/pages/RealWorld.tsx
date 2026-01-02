import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Users, 
  Play, 
  Camera,
  Smartphone,
  Monitor,
  MessageCircle,
  Music,
  ShoppingBag,
  Home,
  Car
} from 'lucide-react';

interface RealWorldComponent {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  features: string[];
  inspiration: string;
  tags: string[];
  status: 'completed' | 'in-progress' | 'planned';
}

const realWorldComponents: RealWorldComponent[] = [
  {
    id: 'linkedin-post',
    title: 'LinkedIn Post Card',
    description: 'Complete LinkedIn post component with reactions, comments, sharing, and all interactive features',
    route: '/linkedin-post',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Post reactions (like, love, insightful, celebrate)',
      'Comment system with replies',
      'Save/bookmark functionality',
      'User verification badges',
      'Post expansion/collapse',
      'Real-time interaction updates',
      'Professional networking UI'
    ],
    inspiration: 'LinkedIn',
    tags: ['Social Media', 'Professional', 'Interactions', 'Comments'],
    status: 'completed'
  },
  {
    id: 'netflix-movie-row',
    title: 'Netflix Movie Rows',
    description: 'Horizontal scrolling movie interface with hover effects, detailed modals, and Netflix-style interactions',
    route: '/netflix-movies',
    icon: <Play className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Horizontal scrolling movie rows',
      'Hover effects with movie details',
      'Movie rating and genre display',
      'My List functionality',
      'Like/dislike system',
      'Detailed movie modals',
      'Smooth scroll navigation',
      'Movie statistics tracking'
    ],
    inspiration: 'Netflix',
    tags: ['Entertainment', 'Streaming', 'Hover Effects', 'Modals'],
    status: 'completed'
  },
  {
    id: 'instagram-story',
    title: 'Instagram Stories',
    description: 'Full Instagram Stories experience with progression, interactions, and story creation tools',
    route: '/instagram-stories',
    icon: <Camera className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Story progression with timer',
      'Story navigation (tap to advance)',
      'Story replies and reactions',
      'Live story indicators',
      'Story creation tools',
      'View/like statistics',
      'Story analytics dashboard',
      'Multiple story segments'
    ],
    inspiration: 'Instagram',
    tags: ['Social Media', 'Stories', 'Mobile UI', 'Interactions'],
    status: 'completed'
  },
  {
    id: 'twitter-tweet',
    title: 'Twitter Tweet',
    description: 'Real-time Twitter-like feed with tweets, retweets, likes, and trending topics',
    route: '/twitter-tweet',
    icon: <MessageCircle className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Tweet composition with media',
      'Retweet and quote tweet functionality',
      'Like and bookmark tweets',
      'Trending topics sidebar',
      'User mentions and hashtags',
      'Thread conversations with modal',
      'Poll system with voting',
      'Real-time interaction updates'
    ],
    inspiration: 'Twitter/X',
    tags: ['Social Media', 'Real-time', 'Microblogging', 'Polls'],
    status: 'completed'
  },
  {
    id: 'youtube-player',
    title: 'YouTube Video Player',
    description: 'Custom video player with YouTube-style controls, playlists, and recommendations',
    route: '/youtube-player',
    icon: <Monitor className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Custom video controls with seek',
      'Quality and speed selection',
      'Like/dislike and subscription',
      'Comments section with sorting',
      'Related videos sidebar',
      'Channel information display',
      'Fullscreen mode support',
      'Video progress tracking'
    ],
    inspiration: 'YouTube',
    tags: ['Video', 'Media Player', 'Streaming', 'Comments'],
    status: 'completed'
  },
  {
    id: 'slack-message',
    title: 'Slack Message',
    description: 'Complete Slack workspace with channels, direct messages, and threading system',
    route: '/slack-message',
    icon: <Smartphone className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Multi-channel workspace interface',
      'Real-time messaging simulation',
      'Thread system with replies',
      'Message reactions with emoji',
      'User status indicators',
      'File attachment support',
      'Message editing and deletion',
      'Channel and DM management'
    ],
    inspiration: 'Slack',
    tags: ['Messaging', 'Workplace', 'Real-time', 'Collaboration'],
    status: 'completed'
  },
  {
    id: 'uber-ride-booking',
    title: 'Uber Ride Booking',
    description: 'Complete ride booking flow with location selection, ride options, and tracking',
    route: '/uber-ride-booking',
    icon: <Car className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Location search and selection',
      'Multiple ride options with pricing',
      'Driver matching simulation',
      'Real-time ride tracking',
      'Ride status progression',
      'Payment and fare calculation',
      'Driver profile and rating',
      'Trip completion flow'
    ],
    inspiration: 'Uber',
    tags: ['Transportation', 'Booking', 'Real-time', 'Maps'],
    status: 'completed'
  },
  {
    id: 'spotify-player',
    title: 'Spotify Music Player',
    description: 'Complete music streaming interface with playlists, search, and audio controls',
    route: '/spotify-player',
    icon: <Music className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Complete Spotify-style interface',
      'Music player with audio controls',
      'Playlist management system',
      'Search functionality',
      'Like/unlike songs',
      'Shuffle and repeat modes',
      'Volume controls',
      'Progress tracking',
      'Home, Search, and Library tabs',
      'Responsive design'
    ],
    inspiration: 'Spotify Web Player',
    tags: ['Music', 'Audio', 'Playlists', 'Streaming'],
    status: 'completed'
  },
  {
    id: 'amazon-product-card',
    title: 'Amazon Product Card',
    description: 'Complete e-commerce product page with reviews, cart, and recommendations',
    route: '/amazon-product-card',
    icon: <ShoppingBag className="w-6 h-6" />,
    difficulty: 'Hard',
    features: [
      'Complete Amazon-style product page',
      'Image gallery with thumbnails',
      'Product variants (color, size)',
      'Customer reviews and ratings',
      'Shopping cart functionality',
      'Wishlist and sharing options',
      'Related products section',
      'Technical specifications',
      'Review filtering and sorting',
      'Responsive e-commerce design'
    ],
    inspiration: 'Amazon Product Page',
    tags: ['E-commerce', 'Shopping', 'Product', 'Reviews'],
    status: 'completed'
  },
  {
    id: 'airbnb-listing',
    title: 'Airbnb Listing',
    description: 'Property listing with booking, reviews, and interactive features',
    route: '/airbnb-listing',
    icon: <Home className="w-6 h-6" />,
    difficulty: 'Medium',
    features: [
      'Property image carousel',
      'Availability calendar',
      'Booking flow with dates',
      'Host profile and reviews',
      'Amenities and location info',
      'Price calculation',
      'Guest reviews system',
      'Map integration'
    ],
    inspiration: 'Airbnb',
    tags: ['Travel', 'Booking', 'Reviews', 'Calendar'],
    status: 'completed'
  }
];

const RealWorld: React.FC = () => {
  const completedComponents = realWorldComponents.filter(comp => comp.status === 'completed');
  const plannedComponents = realWorldComponents.filter(comp => comp.status === 'planned');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Real-World Inspired UI Components
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pixel-perfect recreations of popular social media and streaming platform interfaces. 
              Each component includes full interactivity, animations, and real-world features.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{realWorldComponents.length}</div>
            <div className="text-sm text-gray-600">Total Components</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedComponents.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {realWorldComponents.filter(c => c.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">{plannedComponents.length}</div>
            <div className="text-sm text-gray-600">Planned</div>
          </div>
        </div>

        {/* Completed Components */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Completed Components ({completedComponents.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedComponents.map((component) => (
              <div key={component.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {component.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{component.title}</h3>
                        <p className="text-sm text-gray-500">Inspired by {component.inspiration}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                        {component.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {component.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {component.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                      {component.features.length > 4 && (
                        <li className="text-blue-600 font-medium">
                          +{component.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {component.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={component.route}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>View Component</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planned Components */}
        {plannedComponents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
              Planned Components ({plannedComponents.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plannedComponents.map((component) => (
                <div key={component.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-75">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
                          {component.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">{component.title}</h3>
                          <p className="text-sm text-gray-500">Inspired by {component.inspiration}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                          {component.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                          {component.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {component.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Planned Features:</h4>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {component.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {component.features.length > 4 && (
                          <li className="text-gray-500 font-medium">
                            +{component.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {component.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      <span>Coming Soon</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation Notes */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Implementation Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Technical Features</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Pixel-perfect UI recreations</li>
                <li>• Full interactivity and state management</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Smooth animations and transitions</li>
                <li>• TypeScript for type safety</li>
                <li>• Modern React hooks and patterns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Real-World Features</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Authentic user interactions</li>
                <li>• Social media engagement patterns</li>
                <li>• Content management systems</li>
                <li>• Real-time updates and notifications</li>
                <li>• Media streaming capabilities</li>
                <li>• Professional networking features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealWorld; 