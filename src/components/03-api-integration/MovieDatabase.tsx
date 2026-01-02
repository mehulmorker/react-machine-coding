import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Film, 
  Search, 
  Star, 
  Heart, 
  HeartOff,
  Calendar, 
  Clock, 
  Users,
  Play,
  Plus,
  Check,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  Award,
  Globe,
  AlertCircle,
  Loader2,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  TrendingUp
} from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  voteCount: number;
  genres: string[];
  director: string;
  cast: string[];
  budget: number;
  revenue: number;
  language: string;
  country: string;
  trailerUrl: string;
  isInWatchlist: boolean;
  isFavorite: boolean;
  userRating?: number;
}

interface Genre {
  id: string;
  name: string;
}

const GENRES: Genre[] = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'drama', name: 'Drama' },
  { id: 'horror', name: 'Horror' },
  { id: 'sci-fi', name: 'Science Fiction' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'romance', name: 'Romance' },
  { id: 'animation', name: 'Animation' },
  { id: 'documentary', name: 'Documentary' }
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'title', label: 'Title' },
  { value: 'runtime', label: 'Runtime' }
];

// Mock movie data generator
const generateMockMovies = (count: number = 20): Movie[] => {
  const titles = [
    'The Quantum Paradox',
    'Midnight in Tokyo',
    'The Last Explorer',
    'Digital Dreams',
    'Shadows of Tomorrow',
    'The Time Keeper',
    'Ocean\'s Mystery',
    'The Silent Revolution',
    'Beyond the Stars',
    'The Lost Kingdom',
    'Cyber City',
    'The Memory Thief',
    'Desert Storm',
    'The Phoenix Rising',
    'Electric Nights',
    'The Final Hour',
    'Invisible Threads',
    'The Glass Tower',
    'Neon Horizons',
    'The Secret Garden'
  ];

  const overviews = [
    'A thrilling adventure that takes audiences on an unforgettable journey through time and space.',
    'A gripping drama about love, loss, and redemption in the modern world.',
    'An action-packed thriller that keeps you on the edge of your seat until the very end.',
    'A heartwarming story about friendship and the power of human connection.',
    'A mind-bending sci-fi epic that explores the boundaries of reality and imagination.'
  ];

  const directors = ['Christopher Nolan', 'Quentin Tarantino', 'Greta Gerwig', 'Denis Villeneuve', 'Jordan Peele'];
  const actors = ['Ryan Gosling', 'Emma Stone', 'Oscar Isaac', 'Saoirse Ronan', 'Michael B. Jordan', 'Lupita Nyong\'o'];

  return Array.from({ length: count }, (_, i) => ({
    id: `movie-${i + 1}`,
    title: titles[i % titles.length],
    overview: overviews[i % overviews.length],
    posterUrl: `https://picsum.photos/300/450?random=${i + 1}`,
    backdropUrl: `https://picsum.photos/1280/720?random=${i + 100}`,
    releaseDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    runtime: 90 + Math.floor(Math.random() * 90),
    rating: 5 + Math.random() * 5,
    voteCount: 100 + Math.floor(Math.random() * 10000),
    genres: GENRES.slice(0, 2 + Math.floor(Math.random() * 3)).map(g => g.name),
    director: directors[Math.floor(Math.random() * directors.length)],
    cast: actors.slice(0, 3 + Math.floor(Math.random() * 3)),
    budget: 10000000 + Math.floor(Math.random() * 200000000),
    revenue: 50000000 + Math.floor(Math.random() * 500000000),
    language: 'English',
    country: 'United States',
    trailerUrl: `https://example.com/trailer/${i + 1}`,
    isInWatchlist: Math.random() > 0.7,
    isFavorite: Math.random() > 0.8,
    userRating: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined
  }));
};

const MovieDatabase: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'watchlist' | 'favorites'>('all');

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.cast.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesGenre = selectedGenres.length === 0 || 
                          selectedGenres.some(genre => movie.genres.includes(genre));
      
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'watchlist' && movie.isInWatchlist) ||
                        (activeTab === 'favorites' && movie.isFavorite);
      
      return matchesSearch && matchesGenre && matchesTab;
    });

    // Sort movies
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'release_date':
          aValue = new Date(a.releaseDate);
          bValue = new Date(b.releaseDate);
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'runtime':
          aValue = a.runtime;
          bValue = b.runtime;
          break;
        default:
          aValue = a.voteCount;
          bValue = b.voteCount;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [movies, searchTerm, selectedGenres, sortBy, sortOrder, activeTab]);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMovies = generateMockMovies(50);
      setMovies(mockMovies);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle watchlist
  const toggleWatchlist = useCallback((movieId: string) => {
    setMovies(prev => prev.map(movie => 
      movie.id === movieId 
        ? { ...movie, isInWatchlist: !movie.isInWatchlist }
        : movie
    ));
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((movieId: string) => {
    setMovies(prev => prev.map(movie => 
      movie.id === movieId 
        ? { ...movie, isFavorite: !movie.isFavorite }
        : movie
    ));
  }, []);

  // Rate movie
  const rateMovie = useCallback((movieId: string, rating: number) => {
    setMovies(prev => prev.map(movie => 
      movie.id === movieId 
        ? { ...movie, userRating: rating }
        : movie
    ));
  }, []);

  // Toggle genre filter
  const toggleGenre = useCallback((genreName: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreName)
        ? prev.filter(g => g !== genreName)
        : [...prev, genreName]
    );
  }, []);

  // Format runtime
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Open movie details modal
  const openMovieDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading movies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Movies</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMovies}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Film className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Movie Database</h1>
          </div>
          <p className="text-gray-600">
            Discover movies, create watchlists, and track your favorite films
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Movies', count: movies.length },
              { key: 'watchlist', label: 'Watchlist', count: movies.filter(m => m.isInWatchlist).length },
              { key: 'favorites', label: 'Favorites', count: movies.filter(m => m.isFavorite).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search movies, directors, actors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.name)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedGenres.includes(genre.name)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Movies Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => openMovieDetails(movie)}
                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWatchlist(movie.id)}
                        className={`p-2 rounded-full transition-colors ${
                          movie.isInWatchlist
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {movie.isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleFavorite(movie.id)}
                        className={`p-2 rounded-full transition-colors ${
                          movie.isFavorite
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {movie.isFavorite ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {movie.rating.toFixed(1)}
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{movie.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(movie.releaseDate).getFullYear()}
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </p>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres.slice(0, 2).map(genre => (
                      <span key={genre} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* User Rating */}
                  {movie.userRating && (
                    <div className="flex items-center mb-2">
                      <span className="text-xs text-gray-600 mr-2">Your Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <Star
                            key={rating}
                            className={`w-3 h-3 ${
                              rating <= movie.userRating!
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => openMovieDetails(movie)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <div className="flex space-x-1">
                      {movie.isInWatchlist && (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      )}
                      {movie.isFavorite && (
                        <Heart className="w-4 h-4 text-red-600 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movie Details Modal */}
        {showModal && selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedMovie.backdropUrl}
                  alt={selectedMovie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedMovie.title}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                      {selectedMovie.rating.toFixed(1)}
                    </span>
                    <span>{new Date(selectedMovie.releaseDate).getFullYear()}</span>
                    <span>{formatRuntime(selectedMovie.runtime)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Overview</h3>
                    <p className="text-gray-600 mb-6">{selectedMovie.overview}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Director</h4>
                        <p className="text-gray-600">{selectedMovie.director}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cast</h4>
                        <p className="text-gray-600">{selectedMovie.cast.join(', ')}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Budget</h4>
                        <p className="text-gray-600">{formatCurrency(selectedMovie.budget)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Revenue</h4>
                        <p className="text-gray-600">{formatCurrency(selectedMovie.revenue)}</p>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.genres.map(genre => (
                          <span key={genre} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Sidebar */}
                  <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleWatchlist(selectedMovie.id)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          selectedMovie.isInWatchlist
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {selectedMovie.isInWatchlist ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 mr-2" />
                            In Watchlist
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-4 h-4 mr-2" />
                            Add to Watchlist
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleFavorite(selectedMovie.id)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          selectedMovie.isFavorite
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {selectedMovie.isFavorite ? (
                          <>
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Favorite
                          </>
                        ) : (
                          <>
                            <HeartOff className="w-4 h-4 mr-2" />
                            Add to Favorites
                          </>
                        )}
                      </button>

                      <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                    </div>

                    {/* User Rating */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Rate this movie</h4>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => rateMovie(selectedMovie.id, rating)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                rating <= (selectedMovie.userRating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {selectedMovie.userRating && (
                        <p className="text-center text-sm text-gray-600 mt-2">
                          You rated this {selectedMovie.userRating} out of 5 stars
                        </p>
                      )}
                    </div>

                    {/* Movie Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Movie Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-medium">{selectedMovie.rating.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Votes</span>
                          <span className="font-medium">{selectedMovie.voteCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Language</span>
                          <span className="font-medium">{selectedMovie.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Country</span>
                          <span className="font-medium">{selectedMovie.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDatabase; 