import React, { useState, useCallback, useEffect } from 'react';
import { 
  Search, 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Building, 
  Calendar, 
  Star, 
  GitFork, 
  Eye, 
  Clock,
  Users,
  Book,
  AlertCircle,
  Loader2,
  ExternalLink,
  Github
} from 'lucide-react';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
}

interface SearchState {
  users: GitHubUser[];
  selectedUser: GitHubUser | null;
  repositories: Repository[];
  loading: boolean;
  userLoading: boolean;
  repoLoading: boolean;
  error: string | null;
  searchTerm: string;
  hasSearched: boolean;
  currentPage: number;
  totalCount: number;
  repoPage: number;
  hasMoreRepos: boolean;
}

const GitHubSearch: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    users: [],
    selectedUser: null,
    repositories: [],
    loading: false,
    userLoading: false,
    repoLoading: false,
    error: null,
    searchTerm: '',
    hasSearched: false,
    currentPage: 1,
    totalCount: 0,
    repoPage: 1,
    hasMoreRepos: true
  });

  // Debounced search
  useEffect(() => {
    if (state.searchTerm.length > 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(state.searchTerm, 1);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state.searchTerm]);

  // Search users
  const searchUsers = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=20`
      );

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        users: page === 1 ? data.items : [...prev.users, ...data.items],
        totalCount: data.total_count,
        currentPage: page,
        loading: false,
        hasSearched: true,
        error: null
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to search users',
        users: page === 1 ? [] : prev.users
      }));
    }
  }, []);

  // Get user details
  const getUserDetails = useCallback(async (username: string) => {
    setState(prev => ({ ...prev, userLoading: true, error: null }));

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }

      const userData = await response.json();

      setState(prev => ({
        ...prev,
        selectedUser: userData,
        userLoading: false,
        repositories: [],
        repoPage: 1,
        hasMoreRepos: true
      }));

      // Also fetch repositories
      getUserRepositories(username, 1);

    } catch (error) {
      console.error('Error fetching user details:', error);
      setState(prev => ({
        ...prev,
        userLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user details'
      }));
    }
  }, []);

  // Get user repositories
  const getUserRepositories = useCallback(async (username: string, page: number = 1) => {
    setState(prev => ({ ...prev, repoLoading: true }));

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&page=${page}&per_page=10`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status}`);
      }

      const repos = await response.json();

      setState(prev => ({
        ...prev,
        repositories: page === 1 ? repos : [...prev.repositories, ...repos],
        repoPage: page,
        hasMoreRepos: repos.length === 10,
        repoLoading: false
      }));

    } catch (error) {
      console.error('Error fetching repositories:', error);
      setState(prev => ({
        ...prev,
        repoLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories'
      }));
    }
  }, []);

  // Load more users
  const loadMoreUsers = useCallback(() => {
    if (state.searchTerm && !state.loading) {
      searchUsers(state.searchTerm, state.currentPage + 1);
    }
  }, [state.searchTerm, state.currentPage, state.loading, searchUsers]);

  // Load more repositories
  const loadMoreRepos = useCallback(() => {
    if (state.selectedUser && !state.repoLoading && state.hasMoreRepos) {
      getUserRepositories(state.selectedUser.login, state.repoPage + 1);
    }
  }, [state.selectedUser, state.repoLoading, state.hasMoreRepos, state.repoPage, getUserRepositories]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get language color
  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33'
    };
    return colors[language || ''] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Github className="w-8 h-8 text-gray-900 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">GitHub User Search</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for GitHub users, explore their profiles, and browse their repositories with real-time data
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search GitHub users..."
              value={state.searchTerm}
              onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {state.loading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
            )}
          </div>
          {state.totalCount > 0 && (
            <p className="text-center mt-4 text-gray-600">
              Found {formatNumber(state.totalCount)} users
            </p>
          )}
        </div>

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
              </div>
              
              {!state.hasSearched ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Start typing to search for GitHub users</p>
                </div>
              ) : state.users.length === 0 && !state.loading ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {state.users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => getUserDetails(user.login)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        state.selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.login}
                          </p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Load More Users */}
                  {state.users.length < state.totalCount && (
                    <div className="p-4">
                      <button
                        onClick={loadMoreUsers}
                        disabled={state.loading}
                        className="w-full py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        {state.loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          'Load More'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Details & Repositories */}
          <div className="lg:col-span-2 space-y-8">
            {state.userLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Loading user details...</span>
                </div>
              </div>
            ) : state.selectedUser ? (
              <>
                {/* User Profile */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={state.selectedUser.avatar_url}
                      alt={state.selectedUser.login}
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {state.selectedUser.name || state.selectedUser.login}
                        </h2>
                        <a
                          href={state.selectedUser.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        >
                          <span>View on GitHub</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      
                      <p className="text-gray-600 text-lg mb-3">@{state.selectedUser.login}</p>
                      
                      {state.selectedUser.bio && (
                        <p className="text-gray-700 mb-4">{state.selectedUser.bio}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(state.selectedUser.public_repos)}
                          </div>
                          <div className="text-sm text-gray-600">Repositories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formatNumber(state.selectedUser.followers)}
                          </div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatNumber(state.selectedUser.following)}
                          </div>
                          <div className="text-sm text-gray-600">Following</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {formatNumber(state.selectedUser.public_gists)}
                          </div>
                          <div className="text-sm text-gray-600">Gists</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {state.selectedUser.company && (
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{state.selectedUser.company}</span>
                          </div>
                        )}
                        {state.selectedUser.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{state.selectedUser.location}</span>
                          </div>
                        )}
                        {state.selectedUser.blog && (
                          <div className="flex items-center space-x-1">
                            <LinkIcon className="w-4 h-4" />
                            <a
                              href={state.selectedUser.blog.startsWith('http') ? state.selectedUser.blog : `https://${state.selectedUser.blog}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {state.selectedUser.blog}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(state.selectedUser.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repositories */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Repositories</h3>
                  </div>
                  
                  {state.repositories.length === 0 && !state.repoLoading ? (
                    <div className="p-8 text-center text-gray-500">
                      <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No repositories found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {state.repositories.map((repo) => (
                        <div key={repo.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <a
                                  href={repo.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                                >
                                  {repo.name}
                                </a>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                              
                              {repo.description && (
                                <p className="text-gray-600 mb-3">{repo.description}</p>
                              )}

                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {repo.language && (
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                                    />
                                    <span>{repo.language}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4" />
                                  <span>{formatNumber(repo.stargazers_count)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GitFork className="w-4 h-4" />
                                  <span>{formatNumber(repo.forks_count)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Updated {formatDate(repo.updated_at)}</span>
                                </div>
                              </div>

                              {repo.topics && repo.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {repo.topics.slice(0, 5).map((topic) => (
                                    <span
                                      key={topic}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                  {repo.topics.length > 5 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      +{repo.topics.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Load More Repositories */}
                      {state.hasMoreRepos && (
                        <div className="p-4">
                          <button
                            onClick={loadMoreRepos}
                            disabled={state.repoLoading}
                            className="w-full py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                          >
                            {state.repoLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              'Load More Repositories'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : !state.hasSearched ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Github className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  GitHub User Search
                </h3>
                <p className="text-gray-600 mb-4">
                  Search for GitHub users to explore their profiles and repositories
                </p>
                <div className="text-sm text-gray-500">
                  <p>Features:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Real-time user search with debouncing</li>
                    <li>• Detailed user profiles and statistics</li>
                    <li>• Repository listings with metadata</li>
                    <li>• Pagination for large result sets</li>
                    <li>• Error handling and loading states</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a User
                </h3>
                <p className="text-gray-600">
                  Choose a user from the search results to view their profile and repositories
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubSearch; 