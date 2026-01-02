import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ThumbsUp, ThumbsDown, Share2, Download, Flag, MoreHorizontal, Bell, BellOff } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  dislikes: number;
  uploadDate: string;
  channel: {
    name: string;
    avatar: string;
    subscribers: number;
    verified: boolean;
  };
  tags: string[];
  category: string;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

const YouTubePlayer: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [sortComments, setSortComments] = useState<'top' | 'newest'>('top');

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with sample video data
    const sampleVideo: Video = {
      id: '1',
      title: 'Building a Complete React Application from Scratch - Full Tutorial',
      description: `In this comprehensive tutorial, we'll build a complete React application from scratch. You'll learn:

• Setting up a React project with TypeScript
• Component architecture and best practices
• State management with hooks
• API integration and data fetching
• Styling with Tailwind CSS
• Testing strategies
• Deployment to production

This tutorial is perfect for developers who want to master React development and build production-ready applications.

🔗 Resources:
- GitHub Repository: https://github.com/example/react-tutorial
- Documentation: https://reactjs.org
- Tailwind CSS: https://tailwindcss.com

⏰ Timestamps:
00:00 Introduction
02:30 Project Setup
10:15 Component Structure
25:40 State Management
45:20 API Integration
1:15:30 Styling
1:35:45 Testing
1:50:20 Deployment

#React #JavaScript #WebDevelopment #Tutorial #Programming`,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      duration: '2:15:30',
      views: 1250000,
      likes: 45000,
      dislikes: 1200,
      uploadDate: '2 days ago',
      channel: {
        name: 'Code Academy Pro',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        subscribers: 2500000,
        verified: true
      },
      tags: ['React', 'JavaScript', 'Tutorial', 'Web Development', 'Programming'],
      category: 'Education'
    };

    const sampleRelatedVideos: Video[] = [
      {
        id: '2',
        title: 'Advanced React Hooks - useCallback, useMemo, and Custom Hooks',
        description: 'Learn advanced React hooks patterns',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
        duration: '45:20',
        views: 850000,
        likes: 32000,
        dislikes: 800,
        uploadDate: '1 week ago',
        channel: {
          name: 'Code Academy Pro',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          subscribers: 2500000,
          verified: true
        },
        tags: ['React', 'Hooks'],
        category: 'Education'
      },
      {
        id: '3',
        title: 'Next.js 14 Complete Course - App Router, Server Components',
        description: 'Master Next.js 14 with the new App Router',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
        duration: '3:25:15',
        views: 2100000,
        likes: 78000,
        dislikes: 2100,
        uploadDate: '3 days ago',
        channel: {
          name: 'Next.js Masters',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          subscribers: 1800000,
          verified: true
        },
        tags: ['Next.js', 'React', 'Full Stack'],
        category: 'Education'
      }
    ];

    const sampleComments: Comment[] = [
      {
        id: '1',
        user: {
          name: 'Sarah Developer',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        content: 'This is exactly what I needed! The explanation of hooks is crystal clear. Thank you for this amazing tutorial! 🔥',
        timestamp: '2 hours ago',
        likes: 234,
        replies: 12,
        isLiked: false
      },
      {
        id: '2',
        user: {
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        content: 'Been following your channel for months. Your teaching style is incredible. Can you do a video on testing React components next?',
        timestamp: '4 hours ago',
        likes: 156,
        replies: 8,
        isLiked: true
      },
      {
        id: '3',
        user: {
          name: 'Jessica Code',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        content: 'Just landed my first React job thanks to your tutorials! The project structure section was particularly helpful. Keep up the great work! 💪',
        timestamp: '6 hours ago',
        likes: 445,
        replies: 23,
        isLiked: false
      }
    ];

    setCurrentVideo(sampleVideo);
    setRelatedVideos(sampleRelatedVideos);
    setComments(sampleComments);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        content: newComment,
        timestamp: 'now',
        likes: 0,
        replies: 0,
        isLiked: false
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  if (!currentVideo) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto bg-black text-white min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Section */}
        <div className="flex-1 lg:pr-6">
          {/* Video Player */}
          <div 
            ref={playerRef}
            className="relative bg-black aspect-video mb-4"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="w-full h-full object-cover"
            />
            
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white ml-1" />
                )}
              </button>
            </div>
            
            {/* Video Controls */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="text-white hover:text-gray-300">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={toggleMute} className="text-white hover:text-gray-300">
                        {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                    >
                      <option value={0.25}>0.25x</option>
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                    
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                    >
                      <option value="144p">144p</option>
                      <option value="240p">240p</option>
                      <option value="360p">360p</option>
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="1440p">1440p</option>
                      <option value="2160p">4K</option>
                    </select>
                    
                    <button className="text-white hover:text-gray-300">
                      <Settings className="w-6 h-6" />
                    </button>
                    
                    <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2">{currentVideo.title}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-gray-400">
                <span>{formatNumber(currentVideo.views)} views</span>
                <span>•</span>
                <span>{currentVideo.uploadDate}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    isLiked ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{formatNumber(currentVideo.likes)}</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    isDisliked ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>{formatNumber(currentVideo.dislikes)}</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                
                <button className="p-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Channel Info */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={currentVideo.channel.avatar}
                  alt={currentVideo.channel.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold">{currentVideo.channel.name}</h3>
                    {currentVideo.channel.verified && (
                      <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{formatNumber(currentVideo.channel.subscribers)} subscribers</p>
                </div>
              </div>
              
              <button
                onClick={handleSubscribe}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-colors ${
                  isSubscribed
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
              </button>
            </div>
            
            {/* Description */}
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-gray-300 hover:text-white mb-2"
              >
                {showDescription ? 'Show less' : 'Show more'}
              </button>
              {showDescription && (
                <div className="text-gray-300 whitespace-pre-line text-sm">
                  {currentVideo.description}
                </div>
              )}
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{formatNumber(comments.length)} Comments</h3>
              <select
                value={sortComments}
                onChange={(e) => setSortComments(e.target.value as 'top' | 'newest')}
                className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1"
              >
                <option value="top">Top comments</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
            
            {/* Add Comment */}
            <div className="flex space-x-3 mb-6">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Your avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
                  rows={2}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setNewComment('')}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{comment.user.name}</h4>
                      <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 ${
                          comment.isLiked ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white text-sm">
                        Reply
                      </button>
                      {comment.replies > 0 && (
                        <button className="text-blue-500 text-sm">
                          View {comment.replies} replies
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Related Videos */}
        <div className="w-full lg:w-96">
          <h3 className="text-lg font-bold mb-4">Up next</h3>
          <div className="space-y-4">
            {relatedVideos.map(video => (
              <div
                key={video.id}
                className="flex space-x-3 cursor-pointer hover:bg-gray-900 p-2 rounded-lg transition-colors"
                onClick={() => setCurrentVideo(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded"
                  />
                  <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                  <p className="text-gray-400 text-xs mb-1">{video.channel.name}</p>
                  <div className="text-gray-400 text-xs">
                    <span>{formatNumber(video.views)} views</span>
                    <span className="mx-1">•</span>
                    <span>{video.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer; 