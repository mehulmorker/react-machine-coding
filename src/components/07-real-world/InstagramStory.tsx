import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Send, 
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera,
  Type,
  Music,
  MapPin,
  Share,
  Eye
} from 'lucide-react';

interface StorySegment {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number;
  timestamp: string;
  views: number;
  likes: number;
  replies: StoryReply[];
}

interface StoryReply {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  isLiked: boolean;
}

interface Story {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  segments: StorySegment[];
  isViewed: boolean;
  isLive: boolean;
}

const sampleStories: Story[] = [
  {
    id: '1',
    user: {
      username: 'sarah_travels',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    segments: [
      {
        id: '1-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '2h',
        views: 127,
        likes: 23,
        replies: [
          {
            id: '1',
            user: {
              username: 'mike_photo',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            },
            message: 'Amazing view! 😍',
            timestamp: '1h',
            isLiked: false
          }
        ]
      },
      {
        id: '1-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '2h',
        views: 98,
        likes: 18,
        replies: []
      }
    ],
    isViewed: false,
    isLive: false
  },
  {
    id: '2',
    user: {
      username: 'foodie_mike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isVerified: false
    },
    segments: [
      {
        id: '2-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '4h',
        views: 234,
        likes: 45,
        replies: [
          {
            id: '2',
            user: {
              username: 'chef_anna',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
            },
            message: 'Recipe please! 🙏',
            timestamp: '3h',
            isLiked: true
          },
          {
            id: '3',
            user: {
              username: 'hungry_tom',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
            },
            message: 'Looks delicious!',
            timestamp: '2h',
            isLiked: false
          }
        ]
      }
    ],
    isViewed: true,
    isLive: false
  },
  {
    id: '3',
    user: {
      username: 'fitness_emma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    segments: [
      {
        id: '3-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '6h',
        views: 456,
        likes: 89,
        replies: []
      },
      {
        id: '3-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '6h',
        views: 398,
        likes: 72,
        replies: []
      },
      {
        id: '3-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '5h',
        views: 321,
        likes: 56,
        replies: []
      }
    ],
    isViewed: false,
    isLive: false
  },
  {
    id: '4',
    user: {
      username: 'tech_david',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerified: false
    },
    segments: [
      {
        id: '4-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=700&fit=crop',
        duration: 5000,
        timestamp: '8h',
        views: 167,
        likes: 34,
        replies: []
      }
    ],
    isViewed: true,
    isLive: true
  }
];

const InstagramStory: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likedSegments, setLikedSegments] = useState<Set<string>>(new Set());
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set(['2', '4']));
  
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const currentStory = currentStoryIndex !== null ? stories[currentStoryIndex] : null;
  const currentSegment = currentStory ? currentStory.segments[currentSegmentIndex] : null;

  const closeStory = useCallback(() => {
    setCurrentStoryIndex(null);
    setCurrentSegmentIndex(0);
    setProgress(0);
    setIsPlaying(false);
    setShowReplies(false);
  }, []);

  const nextStory = useCallback(() => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev! + 1);
      setCurrentSegmentIndex(0);
      setProgress(0);
    } else {
      closeStory();
    }
  }, [currentStoryIndex, stories.length, closeStory]);

  const nextSegment = useCallback(() => {
    if (!currentStory) return;
    
    if (currentSegmentIndex < currentStory.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      nextStory();
    }
  }, [currentStory, currentSegmentIndex, nextStory]);

  useEffect(() => {
    if (currentStory && currentSegment && isPlaying) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          const increment = 100 / (currentSegment.duration / 100);
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            nextSegment();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStory, currentSegment, isPlaying, nextSegment]);

  const openStory = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setCurrentSegmentIndex(0);
    setProgress(0);
    setIsPlaying(true);
    setShowReplies(false);
    
    // Mark story as viewed
    const storyId = stories[storyIndex].id;
    setViewedStories(prev => new Set([...Array.from(prev), storyId]));
  };

  const prevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      prevStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev! - 1);
      setCurrentSegmentIndex(0);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = () => {
    if (!currentSegment) return;
    
    const newLiked = new Set(likedSegments);
    if (newLiked.has(currentSegment.id)) {
      newLiked.delete(currentSegment.id);
    } else {
      newLiked.add(currentSegment.id);
    }
    setLikedSegments(newLiked);
  };

  const sendReply = () => {
    if (!replyText.trim() || !currentSegment) return;
    
    const newReply: StoryReply = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      },
      message: replyText,
      timestamp: 'now',
      isLiked: false
    };

    setStories(stories.map(story => 
      story.id === currentStory?.id 
        ? {
            ...story,
            segments: story.segments.map(segment =>
              segment.id === currentSegment.id
                ? { ...segment, replies: [...segment.replies, newReply] }
                : segment
            )
          }
        : story
    ));

    setReplyText('');
  };

  const StoryViewer: React.FC = () => {
    if (!currentStory || !currentSegment) return null;

    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        {/* Story Content */}
        <div 
          ref={storyRef}
          className="relative w-full max-w-md h-full bg-black overflow-hidden"
        >
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
            {currentStory.segments.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ 
                    width: index < currentSegmentIndex ? '100%' : 
                           index === currentSegmentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold text-sm">
                  {currentStory.user.username}
                </span>
                {currentStory.user.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {currentStory.isLive && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                    LIVE
                  </span>
                )}
              </div>
              <span className="text-gray-300 text-sm">{currentSegment.timestamp}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={closeStory}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Story Image/Video */}
          <img
            src={currentSegment.url}
            alt="Story content"
            className="w-full h-full object-cover"
          />

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <button
              onClick={prevSegment}
              className="flex-1 h-full focus:outline-none"
              style={{ background: 'transparent' }}
            />
            <button
              onClick={nextSegment}
              className="flex-1 h-full focus:outline-none"
              style={{ background: 'transparent' }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="text"
                placeholder="Send message"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-transparent border border-gray-500 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                onKeyPress={(e) => e.key === 'Enter' && sendReply()}
              />
              <button
                onClick={toggleLike}
                className={`p-2 rounded-full transition-colors ${
                  likedSegments.has(currentSegment.id) 
                    ? 'text-red-500' 
                    : 'text-white hover:text-red-500'
                }`}
              >
                <Heart className="w-6 h-6" fill={likedSegments.has(currentSegment.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>

            {/* Story Stats */}
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{currentSegment.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{currentSegment.likes}</span>
                </div>
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentSegment.replies.length}</span>
                </button>
              </div>
              <button className="hover:text-gray-300 transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentStoryIndex !== null && currentStoryIndex > 0 && (
            <button
              onClick={prevStory}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {currentStoryIndex !== null && currentStoryIndex < stories.length - 1 && (
            <button
              onClick={nextStory}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* Replies Panel */}
        {showReplies && currentSegment.replies.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-4 max-h-64 overflow-y-auto">
            <h3 className="text-white font-semibold mb-3">Replies</h3>
            <div className="space-y-3">
              {currentSegment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <img
                    src={reply.user.avatar}
                    alt={reply.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-semibold text-sm">
                        {reply.user.username}
                      </span>
                      <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{reply.message}</p>
                  </div>
                  <button
                    className={`p-1 rounded-full transition-colors ${
                      reply.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={reply.isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Instagram Stories</h1>
        <p className="text-gray-600">Interactive story viewer with progression and user interactions</p>
      </div>

      {/* Stories Grid */}
      <div className="p-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Add Story */}
          <div className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:bg-gray-300 transition-colors">
              <Plus className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Your Story</p>
          </div>

          {/* Story Circles */}
          {stories.map((story, index) => (
            <div key={story.id} className="flex-shrink-0 text-center">
              <div
                onClick={() => openStory(index)}
                className={`w-16 h-16 rounded-full p-0.5 cursor-pointer transition-transform hover:scale-105 ${
                  viewedStories.has(story.id)
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
                }`}
              >
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {story.isLive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-900 mt-2 truncate w-16">
                {story.user.username}
              </p>
            </div>
          ))}
        </div>

        {/* Story Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Story Analytics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stories.length}</div>
              <div className="text-sm text-gray-600">Total Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{viewedStories.size}</div>
              <div className="text-sm text-gray-600">Viewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stories.filter(s => s.isLive).length}
              </div>
              <div className="text-sm text-gray-600">Live Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stories.reduce((total, story) => 
                  total + story.segments.reduce((segTotal, seg) => segTotal + seg.views, 0), 0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
        </div>

        {/* Story Creation Tools */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Story</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Camera className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm text-gray-700">Camera</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Type className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm text-gray-700">Text</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Music className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm text-gray-700">Music</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <MapPin className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm text-gray-700">Location</span>
            </button>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Stories</h2>
          <div className="space-y-4">
            {stories.map((story, index) => (
              <div key={story.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{story.user.username}</span>
                      {story.user.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {story.isLive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{story.segments.length} segments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {story.segments.reduce((total, seg) => total + seg.views, 0)} views
                    </div>
                    <div className="text-xs text-gray-600">
                      {story.segments.reduce((total, seg) => total + seg.likes, 0)} likes
                    </div>
                  </div>
                  <button
                    onClick={() => openStory(index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {currentStoryIndex !== null && <StoryViewer />}
    </div>
  );
};

export default InstagramStory; 