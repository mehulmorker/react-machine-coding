import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, AtSign, Hash, Phone, Video, Settings, Search, Plus, MoreVertical, Star, Reply, Share, Bookmark, Edit3, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  title?: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'dm' | 'group';
  isPrivate: boolean;
  members: number;
  unreadCount?: number;
}

interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  edited?: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
  replies?: Message[];
  replyCount?: number;
  attachments?: { type: 'image' | 'file'; url: string; name: string }[];
  isThreadParent?: boolean;
}

interface Reaction {
  emoji: string;
  label: string;
}

const SlackMessage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Message | null>(null);
  const [threadReplies, setThreadReplies] = useState<Message[]>([]);
  const [newThreadReply, setNewThreadReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonReactions: Reaction[] = [
    { emoji: '👍', label: 'thumbs up' },
    { emoji: '❤️', label: 'heart' },
    { emoji: '😂', label: 'laughing' },
    { emoji: '😮', label: 'surprised' },
    { emoji: '😢', label: 'sad' },
    { emoji: '🔥', label: 'fire' },
    { emoji: '👏', label: 'clap' },
    { emoji: '✅', label: 'check' }
  ];

  useEffect(() => {
    // Initialize with sample data
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'online',
        title: 'Frontend Developer'
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'away',
        title: 'Backend Developer'
      },
      {
        id: '3',
        name: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'busy',
        title: 'Product Manager'
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'online',
        title: 'UX Designer'
      }
    ];

    const sampleChannels: Channel[] = [
      {
        id: '1',
        name: 'general',
        type: 'channel',
        isPrivate: false,
        members: 24,
        unreadCount: 3
      },
      {
        id: '2',
        name: 'development',
        type: 'channel',
        isPrivate: false,
        members: 12,
        unreadCount: 1
      },
      {
        id: '3',
        name: 'design-team',
        type: 'channel',
        isPrivate: true,
        members: 6
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        type: 'dm',
        isPrivate: true,
        members: 2,
        unreadCount: 2
      }
    ];

    const sampleMessages: Message[] = [
      {
        id: '1',
        user: sampleUsers[1],
        content: 'Hey team! Just pushed the latest changes to the development branch. The new authentication system is ready for testing! 🚀',
        timestamp: '9:30 AM',
        reactions: [
          { emoji: '👍', count: 3, users: ['1', '3', '4'] },
          { emoji: '🔥', count: 2, users: ['1', '3'] }
        ],
        replyCount: 2,
        isThreadParent: true
      },
      {
        id: '2',
        user: sampleUsers[0],
        content: 'Awesome work Mike! I\'ll start testing the frontend integration this afternoon. The new login flow looks great in the designs.',
        timestamp: '9:45 AM',
        reactions: [
          { emoji: '❤️', count: 1, users: ['2'] }
        ]
      },
      {
        id: '3',
        user: sampleUsers[2],
        content: 'Perfect timing! I just finished updating the user stories for the next sprint. Can we schedule a quick standup to discuss the testing strategy?',
        timestamp: '10:15 AM',
        reactions: []
      },
      {
        id: '4',
        user: sampleUsers[3],
        content: 'I\'ve updated the design system with the new components. Here\'s the Figma link for reference:',
        timestamp: '10:30 AM',
        attachments: [
          { type: 'file', url: '#', name: 'Design-System-v2.fig' }
        ],
        reactions: [
          { emoji: '👏', count: 4, users: ['1', '2', '3', '4'] }
        ]
      },
      {
        id: '5',
        user: sampleUsers[0],
        content: 'Thanks Alex! The new components look fantastic. The color palette update really makes everything pop! ✨',
        timestamp: '11:00 AM',
        reactions: [
          { emoji: '✅', count: 2, users: ['3', '4'] }
        ]
      }
    ];

    const sampleThreadReplies: Message[] = [
      {
        id: 't1',
        user: sampleUsers[0],
        content: 'Just tested it - works perfectly! The password reset flow is much smoother now.',
        timestamp: '9:35 AM',
        reactions: [
          { emoji: '👍', count: 1, users: ['2'] }
        ]
      },
      {
        id: 't2',
        user: sampleUsers[2],
        content: 'Great job on the error handling too. Much more user-friendly than before!',
        timestamp: '9:40 AM',
        reactions: []
      }
    ];

    setUsers(sampleUsers);
    setChannels(sampleChannels);
    setActiveChannel(sampleChannels[0]);
    setMessages(sampleMessages);
    setThreadReplies(sampleThreadReplies);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChannel) {
      const message: Message = {
        id: Date.now().toString(),
        user: {
          id: 'current',
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          status: 'online'
        },
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleSendThreadReply = () => {
    if (newThreadReply.trim() && selectedThread) {
      const reply: Message = {
        id: Date.now().toString(),
        user: {
          id: 'current',
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          status: 'online'
        },
        content: newThreadReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setThreadReplies([...threadReplies, reply]);
      setNewThreadReply('');
      
      // Update reply count on parent message
      setMessages(messages.map(msg => 
        msg.id === selectedThread.id 
          ? { ...msg, replyCount: (msg.replyCount || 0) + 1 }
          : msg
      ));
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Toggle reaction
          const hasUserReacted = existingReaction.users.includes('current');
          if (hasUserReacted) {
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== 'current') }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, 'current'] }
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...message,
            reactions: [...message.reactions, { emoji, count: 1, users: ['current'] }]
          };
        }
      }
      return message;
    }));
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      setMessages(messages.map(message => 
        message.id === editingMessage 
          ? { ...message, content: editContent, edited: true }
          : message
      ));
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-purple-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">DevTeam Workspace</h1>
            <button className="text-purple-300 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-300">Channels</h3>
              <button className="text-purple-300 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {channels.filter(c => c.type === 'channel').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`w-full text-left p-2 rounded mb-1 flex items-center justify-between hover:bg-purple-800 ${
                  activeChannel?.id === channel.id ? 'bg-purple-800' : ''
                }`}
              >
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                {channel.unreadCount && (
                  <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-300">Direct Messages</h3>
              <button className="text-purple-300 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {channels.filter(c => c.type === 'dm').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`w-full text-left p-2 rounded mb-1 flex items-center justify-between hover:bg-purple-800 ${
                  activeChannel?.id === channel.id ? 'bg-purple-800' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">{channel.name}</span>
                </div>
                {channel.unreadCount && (
                  <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-purple-800">
          <div className="flex items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Your avatar"
                className="w-8 h-8 rounded"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-900"></div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-purple-300">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        {activeChannel && (
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Hash className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold">{activeChannel.name}</h2>
              <span className="ml-2 text-sm text-gray-400">
                {activeChannel.members} members
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-800 rounded">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded">
                <Video className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 hover:bg-gray-800 rounded"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className="group hover:bg-gray-800 p-2 rounded">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-10 h-10 rounded"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(message.user.status)} rounded-full border-2 border-gray-900`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{message.user.name}</h4>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    {message.edited && (
                      <span className="text-xs text-gray-500">(edited)</span>
                    )}
                  </div>
                  
                  {editingMessage === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded resize-none"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMessage(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-100 mb-2">{message.content}</p>
                      
                      {message.attachments && (
                        <div className="space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm border ${
                                reaction.users.includes('current')
                                  ? 'bg-blue-600 border-blue-500'
                                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {message.replyCount && message.replyCount > 0 && (
                        <button
                          onClick={() => setSelectedThread(message)}
                          className="flex items-center space-x-2 mt-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <Reply className="w-4 h-4" />
                          <span>{message.replyCount} replies</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {/* Message Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedThread(message)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditMessage(message.id)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="p-1 hover:bg-gray-700 rounded text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-10">
            <div className="grid grid-cols-4 gap-2">
              {commonReactions.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Handle emoji selection for the last message or selected message
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-gray-700 rounded text-xl"
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
            <button className="text-gray-400 hover:text-white">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message #${activeChannel?.name || 'channel'}`}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <AtSign className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Thread Sidebar */}
      {selectedThread && (
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Thread</h3>
              <button
                onClick={() => setSelectedThread(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Original Message */}
            <div className="p-3 bg-gray-700 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={selectedThread.user.avatar}
                  alt={selectedThread.user.name}
                  className="w-8 h-8 rounded"
                />
                <h4 className="font-semibold">{selectedThread.user.name}</h4>
                <span className="text-xs text-gray-400">{selectedThread.timestamp}</span>
              </div>
              <p className="text-gray-100">{selectedThread.content}</p>
            </div>
            
            {/* Thread Replies */}
            {threadReplies.map(reply => (
              <div key={reply.id} className="flex items-start space-x-3">
                <img
                  src={reply.user.avatar}
                  alt={reply.user.name}
                  className="w-8 h-8 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm">{reply.user.name}</h4>
                    <span className="text-xs text-gray-400">{reply.timestamp}</span>
                  </div>
                  <p className="text-gray-100 text-sm">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Thread Reply Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-3">
              <input
                type="text"
                value={newThreadReply}
                onChange={(e) => setNewThreadReply(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendThreadReply()}
                placeholder="Reply to thread..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
              <button
                onClick={handleSendThreadReply}
                disabled={!newThreadReply.trim()}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlackMessage; 