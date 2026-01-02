import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Verified, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';

interface Tweet {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  image?: string;
  video?: string;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    endsAt: string;
  };
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
}

interface Reply {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

const TwitterTweet: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newTweet, setNewTweet] = useState('');
  const [newReply, setNewReply] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'trending' | 'notifications'>('home');

  useEffect(() => {
    // Initialize with sample tweets
    const sampleTweets: Tweet[] = [
      {
        id: '1',
        user: {
          name: 'Elon Musk',
          username: 'elonmusk',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          verified: true,
          followers: 150000000
        },
        content: 'Just launched another rocket to Mars! 🚀 The future of humanity is multi-planetary. #SpaceX #Mars',
        timestamp: '2h',
        likes: 45230,
        retweets: 12400,
        replies: 3200,
        image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
        isLiked: false,
        isRetweeted: false,
        isBookmarked: false
      },
      {
        id: '2',
        user: {
          name: 'Bill Gates',
          username: 'BillGates',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: true,
          followers: 60000000
        },
        content: 'Excited to share our latest progress on global health initiatives. Together, we can make a difference! 🌍',
        timestamp: '4h',
        likes: 28500,
        retweets: 8200,
        replies: 1800,
        poll: {
          question: 'What should be our top priority for global health?',
          options: [
            { text: 'Vaccine distribution', votes: 45 },
            { text: 'Clean water access', votes: 30 },
            { text: 'Education programs', votes: 25 }
          ],
          totalVotes: 15420,
          endsAt: '2 days left'
        },
        isLiked: true,
        isRetweeted: false,
        isBookmarked: true
      },
      {
        id: '3',
        user: {
          name: 'OpenAI',
          username: 'OpenAI',
          avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop',
          verified: true,
          followers: 5000000
        },
        content: 'Introducing GPT-5: The next generation of AI that understands context better than ever before. The future is here! 🤖✨\n\nKey features:\n• Enhanced reasoning\n• Better code generation\n• Improved safety measures',
        timestamp: '6h',
        likes: 89200,
        retweets: 34500,
        replies: 12800,
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isLiked: false,
        isRetweeted: true,
        isBookmarked: false
      }
    ];

    setTweets(sampleTweets);

    // Sample replies
    const sampleReplies: Reply[] = [
      {
        id: 'r1',
        user: {
          name: 'Tech Enthusiast',
          username: 'techfan2024',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          verified: false
        },
        content: 'This is absolutely incredible! Can\'t wait to see what\'s possible with GPT-5 🔥',
        timestamp: '2h',
        likes: 234,
        isLiked: false
      },
      {
        id: 'r2',
        user: {
          name: 'Sarah Chen',
          username: 'sarahdev',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          verified: true
        },
        content: 'The code generation improvements are game-changing for developers! 👩‍💻',
        timestamp: '1h',
        likes: 156,
        isLiked: true
      }
    ];

    setReplies(sampleReplies);
  }, []);

  const handleLike = (tweetId: string) => {
    setTweets(tweets.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            isLiked: !tweet.isLiked,
            likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1
          }
        : tweet
    ));
  };

  const handleRetweet = (tweetId: string) => {
    setTweets(tweets.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            isRetweeted: !tweet.isRetweeted,
            retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1
          }
        : tweet
    ));
  };

  const handleBookmark = (tweetId: string) => {
    setTweets(tweets.map(tweet => 
      tweet.id === tweetId 
        ? { ...tweet, isBookmarked: !tweet.isBookmarked }
        : tweet
    ));
  };

  const handleTweet = () => {
    if (newTweet.trim()) {
      const tweet: Tweet = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          username: 'yourhandle',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: false,
          followers: 1000
        },
        content: newTweet,
        timestamp: 'now',
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isRetweeted: false,
        isBookmarked: false
      };
      setTweets([tweet, ...tweets]);
      setNewTweet('');
      setShowCompose(false);
    }
  };

  const handleReply = () => {
    if (newReply.trim() && selectedTweet) {
      const reply: Reply = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          username: 'yourhandle',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: false
        },
        content: newReply,
        timestamp: 'now',
        likes: 0,
        isLiked: false
      };
      setReplies([...replies, reply]);
      setNewReply('');
      
      // Update reply count
      setTweets(tweets.map(tweet => 
        tweet.id === selectedTweet.id 
          ? { ...tweet, replies: tweet.replies + 1 }
          : tweet
      ));
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const TweetCard = ({ tweet }: { tweet: Tweet }) => (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <img
          src={tweet.user.avatar}
          alt={tweet.user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900">{tweet.user.name}</h3>
            {tweet.user.verified && (
              <Verified className="w-5 h-5 text-blue-500 fill-current" />
            )}
            <span className="text-gray-500">@{tweet.user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{tweet.timestamp}</span>
            <div className="ml-auto">
              <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-gray-900 whitespace-pre-line">{tweet.content}</p>
            
            {tweet.image && (
              <img
                src={tweet.image}
                alt="Tweet image"
                className="mt-3 rounded-2xl max-w-full h-auto border border-gray-200"
              />
            )}
            
            {tweet.video && (
              <video
                src={tweet.video}
                controls
                className="mt-3 rounded-2xl max-w-full h-auto border border-gray-200"
              />
            )}
            
            {tweet.poll && (
              <div className="mt-3 border border-gray-200 rounded-2xl p-4">
                <p className="font-medium mb-3">{tweet.poll.question}</p>
                {tweet.poll.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span>{option.text}</span>
                      <span className="font-medium">{option.votes}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${option.votes}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-sm text-gray-500 mt-3">
                  <span>{formatNumber(tweet.poll.totalVotes)} votes</span>
                  <span>{tweet.poll.endsAt}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              onClick={() => setSelectedTweet(tweet)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{formatNumber(tweet.replies)}</span>
            </button>
            
            <button
              onClick={() => handleRetweet(tweet.id)}
              className={`flex items-center space-x-2 transition-colors ${
                tweet.isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <Repeat2 className="w-5 h-5" />
              <span>{formatNumber(tweet.retweets)}</span>
            </button>
            
            <button
              onClick={() => handleLike(tweet.id)}
              className={`flex items-center space-x-2 transition-colors ${
                tweet.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${tweet.isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(tweet.likes)}</span>
            </button>
            
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <Share className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleBookmark(tweet.id)}
              className={`transition-colors ${
                tweet.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${tweet.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-500">Twitter</h1>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full text-left p-3 rounded-full transition-colors ${
                activeTab === 'home' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`w-full text-left p-3 rounded-full transition-colors ${
                activeTab === 'trending' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left p-3 rounded-full transition-colors ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              Notifications
            </button>
          </nav>
          
          <button
            onClick={() => setShowCompose(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-full font-bold mt-8 hover:bg-blue-600 transition-colors"
          >
            Tweet
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold">Home</h2>
          </div>
          
          {/* Tweet Compose */}
          {showCompose && (
            <div className="border-b border-gray-200 p-4">
              <div className="flex space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Your avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full p-3 text-xl resize-none border-none outline-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4 text-blue-500">
                      <button className="hover:bg-blue-50 p-2 rounded-full">
                        <Calendar className="w-5 h-5" />
                      </button>
                      <button className="hover:bg-blue-50 p-2 rounded-full">
                        <MapPin className="w-5 h-5" />
                      </button>
                      <button className="hover:bg-blue-50 p-2 rounded-full">
                        <LinkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCompose(false)}
                        className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleTweet}
                        disabled={!newTweet.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Tweet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tweet Feed */}
          <div>
            {tweets.map(tweet => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 p-4">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <h3 className="text-xl font-bold mb-3">What's happening</h3>
            <div className="space-y-3">
              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                <p className="text-sm text-gray-500">Trending in Technology</p>
                <p className="font-bold">#ReactJS</p>
                <p className="text-sm text-gray-500">125K Tweets</p>
              </div>
              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                <p className="text-sm text-gray-500">Trending</p>
                <p className="font-bold">#OpenAI</p>
                <p className="text-sm text-gray-500">89K Tweets</p>
              </div>
              <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
                <p className="text-sm text-gray-500">Technology · Trending</p>
                <p className="font-bold">Machine Learning</p>
                <p className="text-sm text-gray-500">45K Tweets</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-3">Who to follow</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">React</p>
                    <p className="text-sm text-gray-500">@reactjs</p>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-1 rounded-full text-sm hover:bg-gray-800">
                  Follow
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">TypeScript</p>
                    <p className="text-sm text-gray-500">@typescript</p>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-1 rounded-full text-sm hover:bg-gray-800">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reply Modal */}
      {selectedTweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Tweet</h3>
                <button
                  onClick={() => setSelectedTweet(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <TweetCard tweet={selectedTweet} />
              
              <div className="mt-4">
                <h4 className="font-bold mb-4">Replies</h4>
                {replies.map(reply => (
                  <div key={reply.id} className="flex space-x-3 mb-4">
                    <img
                      src={reply.user.avatar}
                      alt={reply.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-bold">{reply.user.name}</h5>
                        {reply.user.verified && (
                          <Verified className="w-4 h-4 text-blue-500 fill-current" />
                        )}
                        <span className="text-gray-500">@{reply.user.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{reply.timestamp}</span>
                      </div>
                      <p className="mt-1">{reply.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex space-x-3 mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Tweet your reply"
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleReply}
                        disabled={!newReply.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwitterTweet; 