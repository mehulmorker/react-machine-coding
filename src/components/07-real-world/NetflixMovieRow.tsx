import React, { useState, useRef } from 'react';
import { 
  Play, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  backdrop: string;
  trailer: string;
  genre: string[];
  year: number;
  rating: string;
  duration: string;
  description: string;
  cast: string[];
  director: string;
  imdbRating: number;
  netflixRating: number;
  isNew: boolean;
  isTrending: boolean;
  isInMyList: boolean;
}

interface MovieRow {
  id: string;
  title: string;
  movies: Movie[];
}

const sampleMovies: Movie[] = [
  {
    id: '1',
    title: 'Stranger Things',
    thumbnail: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    year: 2023,
    rating: 'TV-14',
    duration: '4 Seasons',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
    director: 'The Duffer Brothers',
    imdbRating: 8.7,
    netflixRating: 96,
    isNew: true,
    isTrending: true,
    isInMyList: false
  },
  {
    id: '2',
    title: 'The Crown',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Drama', 'Biography', 'History'],
    year: 2023,
    rating: 'TV-MA',
    duration: '6 Seasons',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
    cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton'],
    director: 'Peter Morgan',
    imdbRating: 8.6,
    netflixRating: 94,
    isNew: false,
    isTrending: true,
    isInMyList: true
  },
  {
    id: '3',
    title: 'Wednesday',
    thumbnail: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Comedy', 'Horror', 'Mystery'],
    year: 2022,
    rating: 'TV-14',
    duration: '1 Season',
    description: 'Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.',
    cast: ['Jenna Ortega', 'Emma Myers', 'Hunter Doohan'],
    director: 'Tim Burton',
    imdbRating: 8.1,
    netflixRating: 91,
    isNew: false,
    isTrending: false,
    isInMyList: false
  },
  {
    id: '4',
    title: 'Money Heist',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Crime', 'Drama', 'Thriller'],
    year: 2021,
    rating: 'TV-MA',
    duration: '5 Seasons',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
    cast: ['Álvaro Morte', 'Itziar Ituño', 'Pedro Alonso'],
    director: 'Álex Pina',
    imdbRating: 8.2,
    netflixRating: 89,
    isNew: false,
    isTrending: false,
    isInMyList: true
  },
  {
    id: '5',
    title: 'Squid Game',
    thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Drama', 'Thriller', 'Action'],
    year: 2021,
    rating: 'TV-MA',
    duration: '1 Season',
    description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games for a tempting prize, but the stakes are deadly.',
    cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-jun'],
    director: 'Hwang Dong-hyuk',
    imdbRating: 8.0,
    netflixRating: 95,
    isNew: false,
    isTrending: true,
    isInMyList: false
  },
  {
    id: '6',
    title: 'The Witcher',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=675&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    genre: ['Fantasy', 'Drama', 'Action'],
    year: 2023,
    rating: 'TV-MA',
    duration: '3 Seasons',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan'],
    director: 'Lauren Schmidt Hissrich',
    imdbRating: 8.2,
    netflixRating: 88,
    isNew: true,
    isTrending: false,
    isInMyList: true
  }
];

const movieRows: MovieRow[] = [
  {
    id: '1',
    title: 'Trending Now',
    movies: sampleMovies.filter(movie => movie.isTrending)
  },
  {
    id: '2',
    title: 'My List',
    movies: sampleMovies.filter(movie => movie.isInMyList)
  },
  {
    id: '3',
    title: 'New Releases',
    movies: sampleMovies.filter(movie => movie.isNew)
  },
  {
    id: '4',
    title: 'Popular on Netflix',
    movies: sampleMovies
  },
  {
    id: '5',
    title: 'Drama Series',
    movies: sampleMovies.filter(movie => movie.genre.includes('Drama'))
  }
];

const NetflixMovieRow: React.FC = () => {
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [myList, setMyList] = useState<Set<string>>(new Set(['2', '4', '6']));
  const [likedMovies, setLikedMovies] = useState<Set<string>>(new Set());
  const [dislikedMovies, setDislikedMovies] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollRow = (rowId: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[rowId];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleMyList = (movieId: string) => {
    const newMyList = new Set(myList);
    if (newMyList.has(movieId)) {
      newMyList.delete(movieId);
    } else {
      newMyList.add(movieId);
    }
    setMyList(newMyList);
  };

  const toggleLike = (movieId: string) => {
    const newLiked = new Set(likedMovies);
    const newDisliked = new Set(dislikedMovies);
    
    if (newLiked.has(movieId)) {
      newLiked.delete(movieId);
    } else {
      newLiked.add(movieId);
      newDisliked.delete(movieId);
    }
    
    setLikedMovies(newLiked);
    setDislikedMovies(newDisliked);
  };

  const toggleDislike = (movieId: string) => {
    const newLiked = new Set(likedMovies);
    const newDisliked = new Set(dislikedMovies);
    
    if (newDisliked.has(movieId)) {
      newDisliked.delete(movieId);
    } else {
      newDisliked.add(movieId);
      newLiked.delete(movieId);
    }
    
    setLikedMovies(newLiked);
    setDislikedMovies(newDisliked);
  };

  const MovieCard: React.FC<{ movie: Movie; rowId: string }> = ({ movie, rowId }) => {
    const isHovered = hoveredMovie === movie.id;
    
    return (
      <div
        className="relative flex-shrink-0 w-64 h-36 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:z-10"
        onMouseEnter={() => setHoveredMovie(movie.id)}
        onMouseLeave={() => setHoveredMovie(null)}
      >
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover rounded-md"
        />
        
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-md flex flex-col justify-between p-3 transition-opacity duration-300">
            {/* Top badges */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col space-y-1">
                {movie.isNew && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>
                )}
                {movie.isTrending && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">TRENDING</span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">{movie.imdbRating}</span>
              </div>
            </div>

            {/* Bottom info */}
            <div>
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMovie(movie);
                    }}
                    className="bg-white text-black rounded-full p-1.5 hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(movie.id);
                    }}
                    className={`rounded-full p-1.5 transition-colors ${
                      myList.has(movie.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(movie.id);
                    }}
                    className={`rounded-full p-1.5 transition-colors ${
                      likedMovies.has(movie.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDislike(movie.id);
                    }}
                    className={`rounded-full p-1.5 transition-colors ${
                      dislikedMovies.has(movie.id)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMovie(movie);
                  }}
                  className="bg-gray-700 text-white rounded-full p-1.5 hover:bg-gray-600 transition-colors"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-300">
                <span className="border border-gray-400 px-1 rounded">{movie.rating}</span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.genre.slice(0, 2).map((g) => (
                  <span key={g} className="text-xs text-gray-300 bg-gray-800 px-1 rounded">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MovieModal: React.FC<{ movie: Movie; onClose: () => void }> = ({ movie, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header with backdrop */}
          <div className="relative h-64 md:h-80">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Play button overlay */}
            <div className="absolute bottom-8 left-8">
              <div className="flex items-center space-x-4">
                <button className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                  <span className="font-bold">Play</span>
                </button>
                <button
                  onClick={() => toggleMyList(movie.id)}
                  className={`rounded-full p-3 transition-colors ${
                    myList.has(movie.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleLike(movie.id)}
                  className={`rounded-full p-3 transition-colors ${
                    likedMovies.has(movie.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleDislike(movie.id)}
                  className={`rounded-full p-3 transition-colors ${
                    dislikedMovies.has(movie.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-white mb-4">{movie.title}</h1>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{movie.imdbRating} IMDb</span>
                  </div>
                  <span className="border border-gray-400 px-2 py-1 rounded">{movie.rating}</span>
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                  <div className="flex items-center space-x-1">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {movie.netflixRating}% Match
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-gray-400 w-20">Cast:</span>
                    <span className="text-white">{movie.cast.join(', ')}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-400 w-20">Director:</span>
                    <span className="text-white">{movie.director}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-400 w-20">Genres:</span>
                    <span className="text-white">{movie.genre.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">More Like This</h3>
                  <div className="space-y-3">
                    {sampleMovies.slice(0, 3).map((similarMovie) => (
                      <div key={similarMovie.id} className="flex space-x-3">
                        <img
                          src={similarMovie.thumbnail}
                          alt={similarMovie.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium">{similarMovie.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">{similarMovie.year}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-400">{similarMovie.imdbRating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Year</span>
                      <span className="text-white">{movie.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{movie.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating</span>
                      <span className="text-white">{movie.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IMDb Score</span>
                      <span className="text-white">{movie.imdbRating}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-transparent p-8">
        <h1 className="text-4xl font-bold mb-2">Netflix Movie Rows</h1>
        <p className="text-gray-400">Horizontal scrolling movie interface with hover effects and detailed modals</p>
      </div>

      {/* Movie Rows */}
      <div className="space-y-8 pb-8">
        {movieRows.map((row) => (
          <div key={row.id} className="px-8">
            <h2 className="text-xl font-bold mb-4">{row.title}</h2>
            <div className="relative group">
              {/* Left scroll button */}
              <button
                onClick={() => scrollRow(row.id, 'left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Movies container */}
              <div
                ref={(el) => { scrollRefs.current[row.id] = el; }}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {row.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} rowId={row.id} />
                ))}
              </div>

              {/* Right scroll button */}
              <button
                onClick={() => scrollRow(row.id, 'right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Statistics */}
      <div className="px-8 py-6 bg-gray-900">
        <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-500">{myList.size}</div>
            <div className="text-sm text-gray-400">In My List</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">{likedMovies.size}</div>
            <div className="text-sm text-gray-400">Liked</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-500">{dislikedMovies.size}</div>
            <div className="text-sm text-gray-400">Disliked</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-500">{sampleMovies.length}</div>
            <div className="text-sm text-gray-400">Total Movies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetflixMovieRow; 