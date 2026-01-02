import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Vote, 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Plus, 
  Trash2, 
  BarChart3,
  PieChart,
  Timer,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

// Types
interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  type: 'single' | 'multiple';
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  endsAt?: Date;
  maxVotesPerUser?: number;
  isAnonymous: boolean;
  allowViewResults: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: Vote[];
  color: string;
}

interface Vote {
  id: string;
  userId: string;
  userName: string;
  timestamp: Date;
  optionId: string;
}

interface VotingState {
  polls: Poll[];
  currentUserId: string;
  userName: string;
}

// Sample data
const SAMPLE_POLLS: Poll[] = [
  {
    id: '1',
    title: 'What should we have for team lunch?',
    description: 'Help us decide what to order for our Friday team lunch!',
    type: 'single',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isAnonymous: false,
    allowViewResults: true,
    options: [
      {
        id: '1-1',
        text: 'Pizza',
        color: 'bg-red-500',
        votes: [
          { id: 'v1', userId: 'user1', userName: 'Alice', timestamp: new Date(), optionId: '1-1' },
          { id: 'v2', userId: 'user2', userName: 'Bob', timestamp: new Date(), optionId: '1-1' },
          { id: 'v3', userId: 'user3', userName: 'Charlie', timestamp: new Date(), optionId: '1-1' }
        ]
      },
      {
        id: '1-2',
        text: 'Chinese Food',
        color: 'bg-yellow-500',
        votes: [
          { id: 'v4', userId: 'user4', userName: 'Diana', timestamp: new Date(), optionId: '1-2' },
          { id: 'v5', userId: 'user5', userName: 'Eve', timestamp: new Date(), optionId: '1-2' }
        ]
      },
      {
        id: '1-3',
        text: 'Mexican Food',
        color: 'bg-green-500',
        votes: [
          { id: 'v6', userId: 'user6', userName: 'Frank', timestamp: new Date(), optionId: '1-3' }
        ]
      },
      {
        id: '1-4',
        text: 'Sandwiches',
        color: 'bg-blue-500',
        votes: [
          { id: 'v7', userId: 'user7', userName: 'Grace', timestamp: new Date(), optionId: '1-4' },
          { id: 'v8', userId: 'user8', userName: 'Henry', timestamp: new Date(), optionId: '1-4' },
          { id: 'v9', userId: 'user9', userName: 'Ivy', timestamp: new Date(), optionId: '1-4' },
          { id: 'v10', userId: 'user10', userName: 'Jack', timestamp: new Date(), optionId: '1-4' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Which programming languages should we focus on? (Multiple Choice)',
    description: 'Select up to 3 languages you think our team should prioritize learning.',
    type: 'multiple',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    maxVotesPerUser: 3,
    isAnonymous: true,
    allowViewResults: false,
    options: [
      {
        id: '2-1',
        text: 'TypeScript',
        color: 'bg-blue-600',
        votes: [
          { id: 'v11', userId: 'user1', userName: 'Anonymous', timestamp: new Date(), optionId: '2-1' },
          { id: 'v12', userId: 'user2', userName: 'Anonymous', timestamp: new Date(), optionId: '2-1' },
          { id: 'v13', userId: 'user3', userName: 'Anonymous', timestamp: new Date(), optionId: '2-1' },
          { id: 'v14', userId: 'user4', userName: 'Anonymous', timestamp: new Date(), optionId: '2-1' }
        ]
      },
      {
        id: '2-2',
        text: 'Python',
        color: 'bg-yellow-600',
        votes: [
          { id: 'v15', userId: 'user1', userName: 'Anonymous', timestamp: new Date(), optionId: '2-2' },
          { id: 'v16', userId: 'user2', userName: 'Anonymous', timestamp: new Date(), optionId: '2-2' },
          { id: 'v17', userId: 'user5', userName: 'Anonymous', timestamp: new Date(), optionId: '2-2' }
        ]
      },
      {
        id: '2-3',
        text: 'Go',
        color: 'bg-cyan-600',
        votes: [
          { id: 'v18', userId: 'user3', userName: 'Anonymous', timestamp: new Date(), optionId: '2-3' },
          { id: 'v19', userId: 'user4', userName: 'Anonymous', timestamp: new Date(), optionId: '2-3' }
        ]
      },
      {
        id: '2-4',
        text: 'Rust',
        color: 'bg-orange-600',
        votes: [
          { id: 'v20', userId: 'user1', userName: 'Anonymous', timestamp: new Date(), optionId: '2-4' }
        ]
      }
    ]
  }
];

// Vote Result Chart Component
const VoteResultChart: React.FC<{ poll: Poll; showPercentages?: boolean }> = ({ poll, showPercentages = true }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  
  const chartData = poll.options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0
  }));

  return (
    <div className="space-y-3">
      {chartData.map((option) => (
        <div key={option.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">{option.text}</span>
            <div className="text-sm text-gray-600">
              {option.votes.length} votes
              {showPercentages && ` (${option.percentage.toFixed(1)}%)`}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${option.color}`}
              style={{ width: `${option.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Poll Card Component
const PollCard: React.FC<{
  poll: Poll;
  currentUserId: string;
  onVote: (pollId: string, optionId: string) => void;
  onClosePoll: (pollId: string) => void;
  showResults: boolean;
  onToggleResults: (pollId: string) => void;
}> = ({ poll, currentUserId, onVote, onClosePoll, showResults, onToggleResults }) => {
  
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Check if user has already voted
  const userVotes = poll.options.flatMap(option => 
    option.votes.filter(vote => vote.userId === currentUserId)
  );
  
  const hasVoted = userVotes.length > 0;
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  const timeRemaining = poll.endsAt ? poll.endsAt.getTime() - Date.now() : null;
  const isExpired = timeRemaining !== null && timeRemaining <= 0;
  
  const handleOptionToggle = (optionId: string) => {
    if (hasVoted || poll.status !== 'active' || isExpired) return;
    
    if (poll.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      const maxVotes = poll.maxVotesPerUser || poll.options.length;
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(prev => prev.filter(id => id !== optionId));
      } else if (selectedOptions.length < maxVotes) {
        setSelectedOptions(prev => [...prev, optionId]);
      }
    }
  };
  
  const handleVoteSubmit = () => {
    selectedOptions.forEach(optionId => {
      onVote(poll.id, optionId);
    });
    setSelectedOptions([]);
  };
  
  const canVote = selectedOptions.length > 0 && !hasVoted && poll.status === 'active' && !isExpired;

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
          <p className="text-gray-600 mb-3">{poll.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {totalVotes} votes
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {poll.createdAt.toLocaleDateString()}
            </div>
            {poll.endsAt && (
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {isExpired ? 'Expired' : `${Math.ceil((timeRemaining || 0) / (1000 * 60 * 60))}h left`}
              </div>
            )}
            <div className="flex items-center gap-1">
              {poll.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {poll.isAnonymous ? 'Anonymous' : 'Public'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            poll.status === 'active' ? 'bg-green-100 text-green-800' :
            poll.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {poll.status === 'active' && !isExpired ? (
              <><CheckCircle className="h-3 w-3 inline mr-1" />Active</>
            ) : poll.status === 'closed' || isExpired ? (
              <><XCircle className="h-3 w-3 inline mr-1" />Closed</>
            ) : (
              <><Clock className="h-3 w-3 inline mr-1" />Draft</>
            )}
          </div>
          
          {poll.allowViewResults && (
            <button
              onClick={() => onToggleResults(poll.id)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              {showResults ? <PieChart className="h-3 w-3" /> : <BarChart3 className="h-3 w-3" />}
              {showResults ? 'Vote' : 'Results'}
            </button>
          )}
          
          {poll.status === 'active' && !isExpired && (
            <button
              onClick={() => onClosePoll(poll.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
            >
              Close Poll
            </button>
          )}
        </div>
      </div>
      
      {/* Poll Content */}
      {showResults || hasVoted || poll.status === 'closed' || isExpired ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Results</h4>
            {hasVoted && (
              <div className="text-sm text-green-600 font-medium">✓ You voted</div>
            )}
          </div>
          <VoteResultChart poll={poll} />
          
          {!poll.isAnonymous && userVotes.length > 0 && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <strong>Your votes:</strong> {userVotes.map(vote => {
                const option = poll.options.find(opt => opt.id === vote.optionId);
                return option?.text;
              }).join(', ')}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Cast your vote{poll.type === 'multiple' && poll.maxVotesPerUser && ` (max ${poll.maxVotesPerUser})`}
            </h4>
            {selectedOptions.length > 0 && poll.type === 'multiple' && (
              <div className="text-sm text-gray-600">
                {selectedOptions.length}/{poll.maxVotesPerUser || poll.options.length} selected
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedOptions.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type={poll.type === 'single' ? 'radio' : 'checkbox'}
                  name={`poll-${poll.id}`}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  className="mr-3"
                />
                <span className="font-medium text-gray-800">{option.text}</span>
              </label>
            ))}
          </div>
          
          {selectedOptions.length > 0 && (
            <button
              onClick={handleVoteSubmit}
              disabled={!canVote}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Vote className="h-4 w-4" />
              Submit Vote{poll.type === 'multiple' && selectedOptions.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Create Poll Component
const CreatePoll: React.FC<{ onCreatePoll: (poll: Omit<Poll, 'id' | 'createdAt'>) => void; onCancel: () => void }> = ({ onCreatePoll, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'single' | 'multiple'>('single');
  const [options, setOptions] = useState(['', '']);
  const [maxVotesPerUser, setMaxVotesPerUser] = useState<number | undefined>(undefined);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [allowViewResults, setAllowViewResults] = useState(true);
  const [endsAt, setEndsAt] = useState<string>('');
  
  const optionColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
  
  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };
  
  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) return;
    
    const pollOptions: PollOption[] = validOptions.map((text, index) => ({
      id: `${Date.now()}-${index}`,
      text: text.trim(),
      votes: [],
      color: optionColors[index % optionColors.length]
    }));
    
    const newPoll: Omit<Poll, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim(),
      options: pollOptions,
      type,
      status: 'active',
      maxVotesPerUser: type === 'multiple' ? maxVotesPerUser : undefined,
      isAnonymous,
      allowViewResults,
      endsAt: endsAt ? new Date(endsAt) : undefined
    };
    
    onCreatePoll(newPoll);
  };
  
  const isValid = title.trim() !== '' && options.filter(opt => opt.trim() !== '').length >= 2;

  return (
    <div className="bg-white rounded-lg shadow-md border p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Poll</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Poll Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context to your poll..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poll Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="single"
                checked={type === 'single'}
                onChange={(e) => setType(e.target.value as 'single')}
                className="mr-2"
              />
              Single Choice
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="multiple"
                checked={type === 'multiple'}
                onChange={(e) => setType(e.target.value as 'multiple')}
                className="mr-2"
              />
              Multiple Choice
            </label>
          </div>
        </div>
        
        {type === 'multiple' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Votes Per User (Optional)
            </label>
            <input
              type="number"
              value={maxVotesPerUser || ''}
              onChange={(e) => setMaxVotesPerUser(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Leave blank for no limit"
              min="1"
              max={options.length}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${optionColors[index % optionColors.length]}`} />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 8 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            Anonymous voting
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={allowViewResults}
              onChange={(e) => setAllowViewResults(e.target.checked)}
              className="mr-2"
            />
            Allow users to view results
          </label>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Poll
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Voting System Component
const VotingSystem: React.FC = () => {
  const [votingState, setVotingState] = useState<VotingState>({
    polls: SAMPLE_POLLS,
    currentUserId: 'current-user',
    userName: 'Current User'
  });
  
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showResultsFor, setShowResultsFor] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('voting-system');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert date strings back to Date objects
        const polls = parsed.polls.map((poll: any) => ({
          ...poll,
          createdAt: new Date(poll.createdAt),
          endsAt: poll.endsAt ? new Date(poll.endsAt) : undefined,
          options: poll.options.map((option: any) => ({
            ...option,
            votes: option.votes.map((vote: any) => ({
              ...vote,
              timestamp: new Date(vote.timestamp)
            }))
          }))
        }));
        setVotingState({ ...parsed, polls });
      } catch (error) {
        console.error('Error loading voting state:', error);
      }
    }
  }, []);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('voting-system', JSON.stringify(votingState));
  }, [votingState]);
  
  const handleVote = useCallback((pollId: string, optionId: string) => {
    setVotingState(prev => ({
      ...prev,
      polls: prev.polls.map(poll => {
        if (poll.id !== pollId) return poll;
        
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id !== optionId) return option;
            
            const newVote: Vote = {
              id: `vote-${Date.now()}-${Math.random()}`,
              userId: prev.currentUserId,
              userName: poll.isAnonymous ? 'Anonymous' : prev.userName,
              timestamp: new Date(),
              optionId
            };
            
            return {
              ...option,
              votes: [...option.votes, newVote]
            };
          })
        };
      })
    }));
  }, []);
  
  const handleCreatePoll = useCallback((pollData: Omit<Poll, 'id' | 'createdAt'>) => {
    const newPoll: Poll = {
      ...pollData,
      id: `poll-${Date.now()}`,
      createdAt: new Date()
    };
    
    setVotingState(prev => ({
      ...prev,
      polls: [newPoll, ...prev.polls]
    }));
    
    setShowCreatePoll(false);
  }, []);
  
  const handleClosePoll = useCallback((pollId: string) => {
    setVotingState(prev => ({
      ...prev,
      polls: prev.polls.map(poll =>
        poll.id === pollId ? { ...poll, status: 'closed' as const } : poll
      )
    }));
  }, []);
  
  const handleToggleResults = useCallback((pollId: string) => {
    setShowResultsFor(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pollId)) {
        newSet.delete(pollId);
      } else {
        newSet.add(pollId);
      }
      return newSet;
    });
  }, []);
  
  const filteredPolls = useMemo(() => {
    return votingState.polls.filter(poll => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') return poll.status === 'active';
      if (filterStatus === 'closed') return poll.status === 'closed';
      return true;
    });
  }, [votingState.polls, filterStatus]);
  
  const stats = useMemo(() => {
    const totalPolls = votingState.polls.length;
    const activePolls = votingState.polls.filter(p => p.status === 'active').length;
    const totalVotes = votingState.polls.reduce((sum, poll) => 
      sum + poll.options.reduce((optSum, opt) => optSum + opt.votes.length, 0), 0
    );
    const userVotes = votingState.polls.reduce((sum, poll) =>
      sum + poll.options.reduce((optSum, opt) => 
        optSum + opt.votes.filter(v => v.userId === votingState.currentUserId).length, 0
      ), 0
    );
    
    return { totalPolls, activePolls, totalVotes, userVotes };
  }, [votingState]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Voting System</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create polls, cast votes, and view real-time results with advanced voting features
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPolls}</div>
          <div className="text-sm text-gray-600">Total Polls</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activePolls}</div>
          <div className="text-sm text-gray-600">Active Polls</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalVotes}</div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.userVotes}</div>
          <div className="text-sm text-gray-600">Your Votes</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {(['all', 'active', 'closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowCreatePoll(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Poll
        </button>
      </div>
      
      {/* Create Poll Form */}
      {showCreatePoll && (
        <div className="mb-6">
          <CreatePoll
            onCreatePoll={handleCreatePoll}
            onCancel={() => setShowCreatePoll(false)}
          />
        </div>
      )}
      
      {/* Polls List */}
      <div className="space-y-6">
        {filteredPolls.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Vote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No polls found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' ? 'Create your first poll to get started!' : `No ${filterStatus} polls available.`}
            </p>
          </div>
        ) : (
          filteredPolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              currentUserId={votingState.currentUserId}
              onVote={handleVote}
              onClosePoll={handleClosePoll}
              showResults={showResultsFor.has(poll.id)}
              onToggleResults={handleToggleResults}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VotingSystem; 