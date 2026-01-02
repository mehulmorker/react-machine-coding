import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Plus,
  Settings,
  Bell,
  User,
  Users,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'emoji';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  fileName?: string;
  fileSize?: number;
}

interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  name?: string;
  avatar?: string;
}

interface TypingUser {
  userId: string;
  userName: string;
}

const ChatApp: React.FC = () => {
  const [currentUser] = useState<User>({
    id: 'current-user',
    name: 'You',
    avatar: '👤',
    isOnline: true
  });

  const [users] = useState<User[]>([
    { id: '1', name: 'Alice Johnson', avatar: '👩‍💼', isOnline: true },
    { id: '2', name: 'Bob Smith', avatar: '👨‍💻', isOnline: false, lastSeen: new Date(Date.now() - 300000) },
    { id: '3', name: 'Carol Wilson', avatar: '👩‍🎨', isOnline: true },
    { id: '4', name: 'David Brown', avatar: '👨‍🔬', isOnline: true },
    { id: '5', name: 'Emma Davis', avatar: '👩‍🏫', isOnline: false, lastSeen: new Date(Date.now() - 1800000) },
  ]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat-1',
      participants: [users[0]],
      unreadCount: 2,
      isGroup: false,
      lastMessage: {
        id: 'msg-1',
        senderId: '1',
        content: 'Hey! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 60000),
        status: 'delivered'
      }
    },
    {
      id: 'chat-2',
      participants: [users[1]],
      unreadCount: 0,
      isGroup: false,
      lastMessage: {
        id: 'msg-2',
        senderId: 'current-user',
        content: 'Thanks for the help!',
        type: 'text',
        timestamp: new Date(Date.now() - 120000),
        status: 'read'
      }
    },
    {
      id: 'chat-3',
      participants: [users[2], users[3], users[4]],
      unreadCount: 5,
      isGroup: true,
      name: 'Project Team',
      avatar: '👥',
      lastMessage: {
        id: 'msg-3',
        senderId: '3',
        content: 'Meeting at 3 PM today',
        type: 'text',
        timestamp: new Date(Date.now() - 300000),
        status: 'sent'
      }
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      senderId: '1',
      content: 'Hey! How are you doing?',
      type: 'text',
      timestamp: new Date(Date.now() - 180000),
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'current-user',
      content: 'I\'m doing great! Just working on some React components.',
      type: 'text',
      timestamp: new Date(Date.now() - 120000),
      status: 'read'
    },
    {
      id: 'msg-3',
      senderId: '1',
      content: 'That sounds interesting! What kind of components?',
      type: 'text',
      timestamp: new Date(Date.now() - 60000),
      status: 'delivered'
    },
    {
      id: 'msg-4',
      senderId: 'current-user',
      content: 'Building a chat application like this one! 😊',
      type: 'text',
      timestamp: new Date(Date.now() - 30000),
      status: 'sent'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '✨'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      const timeout = setTimeout(() => {
        setTypingUsers([{ userId: '1', userName: 'Alice Johnson' }]);
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setTypingUsers([]);
    }
  }, [newMessage]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: `📎 ${file.name}`,
      type: 'file',
      timestamp: new Date(),
      status: 'sending',
      fileName: file.name,
      fileSize: file.size
    };

    setMessages(prev => [...prev, message]);

    // Simulate upload
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return <Check className="w-3 h-3" />;
      case 'delivered': return <CheckCheck className="w-3 h-3" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const filteredChats = chats.filter(chat => {
    const chatName = chat.isGroup ? chat.name : chat.participants[0]?.name;
    return chatName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  const currentChatUser = selectedChat?.isGroup ? null : selectedChat?.participants[0];

  return (
    <div className="max-w-7xl mx-auto h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const chatUser = chat.isGroup ? null : chat.participants[0];
            const chatName = chat.isGroup ? chat.name : chatUser?.name;
            const chatAvatar = chat.isGroup ? chat.avatar : chatUser?.avatar;
            const isOnline = chat.isGroup ? false : chatUser?.isOnline;

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {chatAvatar}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{chatName}</h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedChat.isGroup ? selectedChat.avatar : currentChatUser?.avatar}
                    </div>
                    {!selectedChat.isGroup && currentChatUser?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {selectedChat.isGroup ? selectedChat.name : currentChatUser?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChat.isGroup ? 
                        `${selectedChat.participants.length} members` :
                        currentChatUser?.isOnline ? 'Online' : 
                        currentChatUser?.lastSeen ? `Last seen ${formatLastSeen(currentChatUser.lastSeen)}` : 'Offline'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowUserInfo(!showUserInfo)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === currentUser.id;
                const sender = users.find(user => user.id === message.senderId);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      {!isOwnMessage && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {sender?.avatar}
                        </div>
                      )}
                      
                      <div>
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          {message.type === 'file' ? (
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{message.fileName}</div>
                                {message.fileSize && (
                                  <div className="text-xs opacity-75">
                                    {(message.fileSize / 1024).toFixed(1)} KB
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isOwnMessage && (
                            <span className="flex items-center">
                              {getMessageStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                      {users.find(u => u.id === typingUsers[0].userId)?.avatar}
                    </div>
                    <div className="bg-gray-200 px-3 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-4 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                  />
                </div>
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="*/*"
      />
    </div>
  );
};

export default ChatApp; 