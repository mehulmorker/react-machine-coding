import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Maximize, 
  Minimize, 
  Settings, 
  Download,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Bookmark,
  List,
  Shuffle,
  Repeat,
  RotateCcw,
  RotateCw,
  PictureInPicture,
  Subtitles,
  Zap,
  Clock,
  Eye,
  Headphones
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  author: string;
  authorAvatar: string;
  uploadDate: Date;
  category: string;
  quality: string[];
  subtitles: Subtitle[];
}

interface Subtitle {
  id: string;
  language: string;
  label: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  videos: Video[];
  thumbnail: string;
  author: string;
  isPublic: boolean;
  createdAt: Date;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
type Quality = '240p' | '360p' | '480p' | '720p' | '1080p' | '4K';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  
  // Player settings
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [quality, setQuality] = useState<Quality>('720p');
  const [autoplay, setAutoplay] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('');
  
  // UI state
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [buffering, setBuffering] = useState(false);
  
  // Data
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'React Hooks Explained - Complete Guide',
      description: 'Learn React Hooks from scratch with practical examples and best practices.',
      thumbnail: '🎬',
      url: '/videos/react-hooks.mp4',
      duration: 1234,
      views: 125000,
      likes: 3500,
      dislikes: 45,
      author: 'Code Academy',
      authorAvatar: '👨‍💻',
      uploadDate: new Date('2024-01-15'),
      category: 'Programming',
      quality: ['720p', '1080p'],
      subtitles: [
        { id: '1', language: 'en', label: 'English', url: '/subs/en.vtt' },
        { id: '2', language: 'es', label: 'Spanish', url: '/subs/es.vtt' }
      ]
    },
    {
      id: '2',
      title: 'TypeScript Best Practices 2024',
      description: 'Advanced TypeScript patterns and techniques for professional developers.',
      thumbnail: '📘',
      url: '/videos/typescript.mp4',
      duration: 1856,
      views: 89000,
      likes: 2100,
      dislikes: 23,
      author: 'TypeScript Pro',
      authorAvatar: '👩‍💻',
      uploadDate: new Date('2024-01-10'),
      category: 'Programming',
      quality: ['480p', '720p', '1080p'],
      subtitles: [
        { id: '3', language: 'en', label: 'English', url: '/subs/ts-en.vtt' }
      ]
    },
    {
      id: '3',
      title: 'CSS Grid vs Flexbox - When to Use What',
      description: 'Complete comparison of CSS Grid and Flexbox with practical examples.',
      thumbnail: '🎨',
      url: '/videos/css-grid.mp4',
      duration: 987,
      views: 67000,
      likes: 1800,
      dislikes: 12,
      author: 'CSS Masters',
      authorAvatar: '🎨',
      uploadDate: new Date('2024-01-08'),
      category: 'Web Design',
      quality: ['360p', '720p'],
      subtitles: []
    }
  ]);

  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'React Masterclass',
      videos: videos.slice(0, 2),
      thumbnail: '⚛️',
      author: 'React Academy',
      isPublic: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Frontend Fundamentals',
      videos: videos,
      thumbnail: '🌐',
      author: 'Web Dev Pro',
      isPublic: true,
      createdAt: new Date('2024-01-05')
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Doe',
      authorAvatar: '👤',
      text: 'Great explanation! This helped me understand hooks much better.',
      timestamp: new Date('2024-01-16'),
      likes: 24,
      replies: [
        {
          id: '1-1',
          author: 'Code Academy',
          authorAvatar: '👨‍💻',
          text: 'Thanks! Glad it was helpful.',
          timestamp: new Date('2024-01-16'),
          likes: 5,
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: 'Sarah Wilson',
      authorAvatar: '👩',
      text: 'Could you make a video about custom hooks next?',
      timestamp: new Date('2024-01-17'),
      likes: 18,
      replies: []
    }
  ]);

  const [currentPlaylist, setCurrentPlaylist] = useState<Video[]>(videos);
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const loadVideo = useCallback((video: Video) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    // In a real app, you would load the actual video URL
    console.log('Loading video:', video.url);
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current || !currentVideo) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const changePlaybackSpeed = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    
    try {
      if (!isPiP) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }
    } catch (error) {
      console.log('PiP not supported');
    }
  };

  const playNext = () => {
    if (currentIndex < currentPlaylist.length - 1) {
      const nextVideo = currentPlaylist[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      loadVideo(nextVideo);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevVideo = currentPlaylist[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      loadVideo(prevVideo);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);
    const handleEnded = () => {
      if (autoplay) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, playNext]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Initialize with first video
  useEffect(() => {
    if (videos.length > 0 && !currentVideo) {
      loadVideo(videos[0]);
    }
  }, [videos, currentVideo, loadVideo]);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-3">
          <div
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video"
              poster={currentVideo?.thumbnail}
              onClick={togglePlayPause}
            >
              <source src={currentVideo?.url} type="video/mp4" />
              {currentVideo?.subtitles?.map((sub) => (
                <track
                  key={sub.id}
                  kind="subtitles"
                  src={sub.url}
                  srcLang={sub.language}
                  label={sub.label}
                />
              ))}
            </video>

            {/* Buffering Indicator */}
            {buffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && !buffering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black rounded-full p-4 transition-all transform hover:scale-110"
                >
                  <Play className="w-8 h-8" />
                </button>
              </div>
            )}

            {/* Controls Overlay */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    className="w-full h-2 bg-white bg-opacity-30 rounded-full cursor-pointer hover:h-3 transition-all"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-white text-sm mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>

                    <button
                      onClick={playPrevious}
                      disabled={currentIndex === 0}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                      onClick={playNext}
                      disabled={currentIndex === currentPlaylist.length - 1}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="text-sm">
                      {playbackSpeed !== 1 && `${playbackSpeed}x`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Skip back 10s"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Skip forward 10s"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>

                    {currentVideo?.subtitles && currentVideo.subtitles.length > 0 && (
                      <button
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ${
                          showSubtitles ? 'bg-white bg-opacity-20' : ''
                        }`}
                        title="Subtitles"
                      >
                        <Subtitles className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      onClick={togglePictureInPicture}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Picture in Picture"
                    >
                      <PictureInPicture className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ${
                        showSettings ? 'bg-white bg-opacity-20' : ''
                      }`}
                      title="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                      title="Fullscreen"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="absolute bottom-20 right-4 bg-black bg-opacity-90 rounded-lg p-4 text-white min-w-48">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Playback Speed</label>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value) as PlaybackSpeed)}
                          className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1 text-sm"
                        >
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                            <option key={speed} value={speed} className="text-black">
                              {speed}x
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Quality</label>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value as Quality)}
                          className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1 text-sm"
                        >
                          {currentVideo?.quality?.map((q) => (
                            <option key={q} value={q} className="text-black">
                              {q}
                            </option>
                          ))}
                        </select>
                      </div>

                      {currentVideo?.subtitles && currentVideo.subtitles.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Subtitles</label>
                          <select
                            value={selectedSubtitle}
                            onChange={(e) => setSelectedSubtitle(e.target.value)}
                            className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1 text-sm"
                          >
                            <option value="" className="text-black">Off</option>
                            {currentVideo?.subtitles?.map((sub) => (
                              <option key={sub.id} value={sub.id} className="text-black">
                                {sub.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Autoplay</span>
                        <button
                          onClick={() => setAutoplay(!autoplay)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            autoplay ? 'bg-red-600' : 'bg-white bg-opacity-20'
                          }`}
                        >
                          {autoplay ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Info */}
          {currentVideo && (
            <div className="bg-white rounded-lg p-6 mt-4 shadow-lg">
              <h1 className="text-2xl font-bold mb-2">{currentVideo.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(currentVideo.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentVideo.uploadDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatNumber(currentVideo.likes)}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{formatNumber(currentVideo.dislikes)}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                  {currentVideo.authorAvatar}
                </div>
                <div>
                  <h3 className="font-semibold">{currentVideo.author}</h3>
                  <p className="text-gray-600 text-sm">Content Creator</p>
                </div>
                <button className="ml-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">{currentVideo.description}</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white rounded-lg p-6 mt-4 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showComments ? 'Hide' : 'Show'} Comments
              </button>
            </div>

            {showComments && (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                        {comment.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-gray-500 text-sm">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-blue-600">Reply</button>
                        </div>
                        
                        {comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                  {reply.authorAvatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.author}</span>
                                    <span className="text-gray-500 text-xs">
                                      {reply.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Playlist Toggle */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <List className="w-5 h-5" />
                <span className="font-medium">Playlist</span>
              </div>
              <span className="text-gray-500">{currentPlaylist.length} videos</span>
            </button>
          </div>

          {/* Up Next / Playlist */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold mb-4">
              {showPlaylist ? 'Current Playlist' : 'Up Next'}
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(showPlaylist ? currentPlaylist : currentPlaylist.slice(currentIndex + 1, currentIndex + 4)).map((video, index) => (
                <div
                  key={video.id}
                  className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                    video.id === currentVideo?.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => {
                    const videoIndex = currentPlaylist.findIndex(v => v.id === video.id);
                    setCurrentIndex(videoIndex);
                    loadVideo(video);
                  }}
                >
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-lg flex-shrink-0">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                    <div className="text-xs text-gray-500">
                      <div>{video.author}</div>
                      <div className="flex items-center gap-2">
                        <span>{formatNumber(video.views)} views</span>
                        <span>•</span>
                        <span>{formatTime(video.duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Playlists */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold mb-4">Playlists</h3>
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setCurrentPlaylist(playlist.videos)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-lg">
                    {playlist.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                    <p className="text-xs text-gray-500">{playlist.videos.length} videos</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 