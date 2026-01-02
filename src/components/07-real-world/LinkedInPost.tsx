import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  MoreHorizontal,
  ThumbsUp,
  Lightbulb,
  Award,
  Users,
  Bookmark,
  Flag,
  Eye,
  EyeOff
} from 'lucide-react';

interface LinkedInUser {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  verified: boolean;
  connections: string;
}

interface LinkedInComment {
  id: string;
  user: LinkedInUser;
  content: string;
  timestamp: string;
  likes: number;
  replies: LinkedInComment[];
}

interface LinkedInPost {
  id: string;
  user: LinkedInUser;
  content: string;
  timestamp: string;
  images?: string[];
  video?: string;
  document?: {
    title: string;
    type: string;
    url: string;
  };
  reactions: {
    like: number;
    love: number;
    insightful: number;
    celebrate: number;
  };
  comments: LinkedInComment[];
  shares: number;
  views: number;
}

const samplePosts: LinkedInPost[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      connections: '500+'
    },
    content: `🚀 Excited to share that our team just launched a new feature that improves user experience by 40%! 

The journey wasn't easy - we faced multiple challenges with performance optimization and had to completely rethink our approach to data handling. But the results speak for themselves.

Key learnings:
✅ Always prioritize user feedback
✅ Performance matters more than fancy features
✅ Team collaboration is everything

What's your biggest learning from recent projects? Would love to hear your thoughts! 💭

#SoftwareEngineering #ProductDevelopment #TeamWork #Google`,
    timestamp: '2h',
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    ],
    reactions: {
      like: 127,
      love: 23,
      insightful: 45,
      celebrate: 12
    },
    comments: [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Mike Chen',
          title: 'Product Manager',
          company: 'Microsoft',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          verified: false,
          connections: '500+'
        },
        content: 'Congratulations Sarah! This is exactly the kind of user-centric approach we need more of in tech. Would love to learn more about your performance optimization strategies.',
        timestamp: '1h',
        likes: 12,
        replies: []
      }
    ],
    shares: 34,
    views: 1247
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'David Rodriguez',
      title: 'Startup Founder & CEO',
      company: 'TechVenture Inc.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      connections: '500+'
    },
    content: `Just closed our Series A funding round! 🎉

$5M to revolutionize how small businesses manage their operations. This wouldn't have been possible without our incredible team and the trust of our investors.

Special thanks to everyone who believed in our vision from day one. The real work starts now! 💪

#Startup #Funding #Entrepreneurship #SmallBusiness`,
    timestamp: '4h',
    reactions: {
      like: 89,
      love: 156,
      insightful: 23,
      celebrate: 78
    },
    comments: [
      {
        id: '2',
        user: {
          id: '4',
          name: 'Lisa Wang',
          title: 'Venture Capitalist',
          company: 'Innovation Partners',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          verified: true,
          connections: '500+'
        },
        content: 'Fantastic news David! Your vision for empowering small businesses is exactly what the market needs. Excited to see what you build next! 🚀',
        timestamp: '3h',
        likes: 8,
        replies: []
      }
    ],
    shares: 67,
    views: 2341
  }
];

const LinkedInPost: React.FC = () => {
  const [posts, setPosts] = useState<LinkedInPost[]>(samplePosts);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<Set<string>>(new Set());

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);

    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            reactions: {
              ...post.reactions,
              like: newLiked.has(postId) 
                ? post.reactions.like + 1 
                : post.reactions.like - 1
            }
          }
        : post
    ));
  };

  const toggleSave = (postId: string) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  const toggleComments = (postId: string) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
    }
    setShowComments(newShowComments);
  };

  const handleCommentSubmit = (postId: string) => {
    const comment = commentText[postId];
    if (!comment?.trim()) return;

    const newComment: LinkedInComment = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'You',
        title: 'Software Developer',
        company: 'Your Company',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        verified: false,
        connections: '500+'
      },
      content: comment,
      timestamp: 'now',
      likes: 0,
      replies: []
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentText({ ...commentText, [postId]: '' });
  };

  const formatContent = (content: string, isExpanded: boolean) => {
    const lines = content.split('\n');
    if (!isExpanded && lines.length > 3) {
      return lines.slice(0, 3).join('\n') + '...';
    }
    return content;
  };

  const getTotalReactions = (reactions: LinkedInPost['reactions']) => {
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  const getReactionIcons = (reactions: LinkedInPost['reactions']) => {
    const reactionTypes = [
      { type: 'like', icon: '👍', color: 'text-blue-600' },
      { type: 'love', icon: '❤️', color: 'text-red-500' },
      { type: 'insightful', icon: '💡', color: 'text-yellow-500' },
      { type: 'celebrate', icon: '🎉', color: 'text-green-500' }
    ];

    return reactionTypes
      .filter(reaction => reactions[reaction.type as keyof typeof reactions] > 0)
      .slice(0, 3)
      .map(reaction => (
        <span key={reaction.type} className={`text-sm ${reaction.color}`}>
          {reaction.icon}
        </span>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Post Feed</h1>
          <p className="text-gray-600">Real-world LinkedIn post component with full interactivity</p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Post Header */}
              <div className="p-4 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {post.user.name}
                        </h3>
                        {post.user.verified && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <span className="text-gray-500">• {post.user.connections}</span>
                      </div>
                      <p className="text-sm text-gray-600">{post.user.title} at {post.user.company}</p>
                      <p className="text-xs text-gray-500 flex items-center space-x-1">
                        <span>{post.timestamp}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>Public</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSave(post.id)}
                      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                        savedPosts.has(post.id) ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={savedPosts.has(post.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 py-3">
                <div className="whitespace-pre-line text-gray-900">
                  {formatContent(post.content, expandedPosts.has(post.id))}
                </div>
                {post.content.split('\n').length > 3 && (
                  <button
                    onClick={() => toggleExpanded(post.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                  >
                    {expandedPosts.has(post.id) ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="px-4 pb-3">
                  <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Reactions and Stats */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getReactionIcons(post.reactions)}
                    </div>
                    <span className="hover:text-blue-600 cursor-pointer">
                      {getTotalReactions(post.reactions)} reactions
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      {post.comments.length} comments
                    </button>
                    <span>{post.shares} shares</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                      likedPosts.has(post.id) ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="font-medium">Like</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Share</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                    <Send className="w-5 h-5" />
                    <span className="font-medium">Send</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments.has(post.id) && (
                <div className="px-4 py-3">
                  {/* Add Comment */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">
                                {comment.user.name}
                              </span>
                              {comment.user.verified && (
                                <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{comment.user.title} at {comment.user.company}</p>
                            <p className="text-gray-900">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <button className="hover:text-blue-600">Like</button>
                            <button className="hover:text-blue-600">Reply</button>
                            <span>{comment.timestamp}</span>
                            {comment.likes > 0 && (
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{comment.likes}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPost; 