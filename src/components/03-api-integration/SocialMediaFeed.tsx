import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share, 
  Bookmark, 
  MoreHorizontal, 
  Send, 
  Search, 
  Filter, 
  RefreshCw,
  User,
  Image,
  Video,
  Smile,
  Camera,
  MapPin,
  Clock,
  Verified,
  Users,
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followers: number;
  following: number;
  bio?: string;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  video?: string;
  location?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  shares: number;
  bookmarks: number;
  liked: boolean;
  bookmarked: boolean;
  type: 'text' | 'image' | 'video';
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  post?: Post;
  message: string;
  createdAt: string;
  read: boolean;
}

const SocialMediaFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'notifications'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'image' | 'video'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Generate mock users
  const generateUsers = useCallback((): User[] => {
    const usernames = [
      'alex_dev', 'sarah_design', 'mike_photo', 'emma_writer', 'john_chef',
      'lisa_travel', 'david_music', 'anna_art', 'tom_fitness', 'julia_code',
      'ryan_nature', 'sophie_books', 'mark_tech', 'nina_fashion', 'paul_sports'
    ];

    return usernames.map((username, index) => ({
      id: `user-${index}`,
      username,
      displayName: username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      verified: Math.random() > 0.7,
      followers: Math.floor(Math.random() * 10000) + 100,
      following: Math.floor(Math.random() * 1000) + 50,
      bio: `${username.replace('_', ' ')} | Content creator | Sharing my journey`
    }));
  }, []);

  // Generate mock posts
  const generatePosts = useCallback((users: User[]): Post[] => {
    const contentTemplates = [
      "Just finished an amazing project! 🚀 #coding #webdev",
      "Beautiful sunset from my morning walk 🌅 #nature #photography",
      "New recipe I tried today - absolutely delicious! 👨‍🍳 #cooking #foodie",
      "Working on some exciting new designs 🎨 #design #creative",
      "Great workout session at the gym today 💪 #fitness #health",
      "Reading this incredible book, can't put it down! 📚 #books #reading",
      "Concert last night was absolutely amazing! 🎵 #music #live",
      "Exploring the city and found this hidden gem ✨ #travel #adventure",
      "New tech gadget arrived today, first impressions 📱 #tech #review",
      "Cozy coffee shop vibes for remote work ☕ #work #lifestyle"
    ];

    const locations = [
      "New York, NY", "San Francisco, CA", "London, UK", "Tokyo, Japan",
      "Paris, France", "Sydney, Australia", "Berlin, Germany", "Toronto, Canada"
    ];

    return Array.from({ length: 20 }, (_, index) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const type = ['text', 'image', 'video'][Math.floor(Math.random() * 3)] as 'text' | 'image' | 'video';
      const content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
      
      return {
        id: `post-${index}`,
        user,
        content,
        images: type === 'image' ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => 
          `https://picsum.photos/400/300?random=${index}-${i}`
        ) : undefined,
        video: type === 'video' ? `https://sample-videos.com/zip/10/mp4/SampleVideo_${720}x480_1mb.mp4` : undefined,
        location: Math.random() > 0.6 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 1000),
        comments: [],
        shares: Math.floor(Math.random() * 100),
        bookmarks: Math.floor(Math.random() * 50),
        liked: Math.random() > 0.7,
        bookmarked: Math.random() > 0.8,
        type
      };
    });
  }, []);

  // Generate mock comments
  const generateComments = useCallback((users: User[], postId: string): Comment[] => {
    const commentTexts = [
      "This is amazing! 🔥",
      "Love this content, keep it up!",
      "Great work! 👏",
      "So inspiring! ✨",
      "Thanks for sharing!",
      "Absolutely beautiful! 😍",
      "This made my day! 😊",
      "Can't wait to see more!",
      "Incredible! 🙌",
      "You're so talented! 💯"
    ];

    const numComments = Math.floor(Math.random() * 5);
    return Array.from({ length: numComments }, (_, index) => ({
      id: `comment-${postId}-${index}`,
      user: users[Math.floor(Math.random() * users.length)],
      content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 50)
    }));
  }, []);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = generateUsers();
        const postsData = generatePosts(users);
        
        // Add comments to posts
        const postsWithComments = postsData.map(post => ({
          ...post,
          comments: generateComments(users, post.id)
        }));

        setPosts(postsWithComments);
        setCurrentUser(users[0]); // Set first user as current user
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [generateUsers, generatePosts, generateComments]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || post.type === filterType;
      
      return matchesSearch && matchesFilter;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filtered;
  }, [posts, searchQuery, filterType]);

  // Post interactions
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            bookmarked: !post.bookmarked,
            bookmarks: post.bookmarked ? post.bookmarks - 1 : post.bookmarks + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    const newComment: Comment = {
      id: `comment-${postId}-${Date.now()}`,
      user: currentUser,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    // In a real app, this would open a share dialog
    alert('Post shared!');
  };

  const createNewPost = () => {
    if (!currentUser || !newPostContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      content: newPostContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      bookmarks: 0,
      liked: false,
      bookmarked: false,
      type: 'text'
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setShowNewPost(false);
  };

  const refreshFeed = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would fetch new posts from the API
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-7 h-7 text-blue-600 mr-2" />
                Social Feed
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white w-64"
                />
              </div>

              {/* Refresh */}
              <button
                onClick={refreshFeed}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Avatar */}
              {currentUser && (
                <div className="flex items-center">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {currentUser && (
                <div className="text-center mb-6">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                  />
                  <div className="flex items-center justify-center mb-2">
                    <h3 className="font-semibold text-gray-900">{currentUser.displayName}</h3>
                    {currentUser.verified && (
                      <Verified className="w-4 h-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">@{currentUser.username}</p>
                  <div className="flex justify-center space-x-4 mt-3 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900">{currentUser.followers.toLocaleString()}</span>
                      <span className="ml-1">Followers</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{currentUser.following.toLocaleString()}</span>
                      <span className="ml-1">Following</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { key: 'feed', label: 'Feed', icon: MessageSquare },
                  { key: 'trending', label: 'Trending', icon: TrendingUp },
                  { key: 'notifications', label: 'Notifications', icon: Bell }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as any)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                      activeTab === item.key 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Post */}
            {activeTab === 'feed' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start space-x-3">
                  {currentUser && (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    {!showNewPost ? (
                      <button
                        onClick={() => setShowNewPost(true)}
                        className="w-full text-left px-4 py-3 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100"
                      >
                        What's on your mind?
                      </button>
                    ) : (
                      <div>
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="What's happening?"
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full">
                              <Image className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full">
                              <Video className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full">
                              <MapPin className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full">
                              <Smile className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setShowNewPost(false);
                                setNewPostContent('');
                              }}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={createNewPost}
                              disabled={!newPostContent.trim()}
                              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            {activeTab === 'feed' && (
              <div className="flex items-center space-x-4 mb-6">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Posts</option>
                  <option value="text">Text Posts</option>
                  <option value="image">Image Posts</option>
                  <option value="video">Video Posts</option>
                </select>
              </div>
            )}

            {/* Posts Feed */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            )}

            {/* Trending */}
            {activeTab === 'trending' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Topics</h2>
                <div className="space-y-3">
                  {['#WebDevelopment', '#Photography', '#Cooking', '#Travel', '#Fitness'].map((topic, index) => (
                    <div key={topic} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{topic}</p>
                        <p className="text-sm text-gray-600">{Math.floor(Math.random() * 50000)} posts</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No new notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  formatTimeAgo: (date: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark,
  formatTimeAgo 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Post Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.user.avatar}
              alt={post.user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900">{post.user.displayName}</h3>
                {post.user.verified && (
                  <Verified className="w-4 h-4 text-blue-500 ml-1" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>@{post.user.username}</span>
                <span className="mx-1">·</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
                {post.location && (
                  <>
                    <span className="mx-1">·</span>
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6">
        <p className="text-gray-900 mb-4">{post.content}</p>
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 rounded-lg overflow-hidden ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            ))}
          </div>
        )}

        {/* Video */}
        {post.video && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <video
              src={post.video}
              controls
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 ${
                post.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">{post.comments.length}</span>
            </button>
            
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-500"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">{post.shares}</span>
            </button>
          </div>
          
          <button
            onClick={() => onBookmark(post.id)}
            className={`p-1 ${
              post.bookmarked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${post.bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                alt="Your avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="max-h-64 overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="p-4 border-b border-gray-50 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">{comment.user.displayName}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-900">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-xs text-gray-500 hover:text-blue-500">
                        Like ({comment.likes})
                      </button>
                      <button className="text-xs text-gray-500 hover:text-blue-500">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaFeed; 