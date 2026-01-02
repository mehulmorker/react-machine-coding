import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Plus,
  Search,
  Shuffle,
  Repeat,
  MoreHorizontal,
  Download,
  ExternalLink,
  Music,
  Mic,
  Radio,
  ListMusic,
  Clock,
  User,
  Album,
  TrendingUp,
  Star
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  audioUrl: string;
  isLiked: boolean;
  plays: number;
  releaseDate: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songs: Song[];
  isPublic: boolean;
  followers: number;
  creator: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  followers: number;
  verified: boolean;
  topSongs: Song[];
}

const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:22',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: true,
    plays: 2847293847,
    releaseDate: '2019'
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: '3:53',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: false,
    plays: 5827394857,
    releaseDate: '2017'
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    image: 'https://images.unsplash.com/photo-1414609245224-efa02bfb01e4?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: true,
    plays: 1847293847,
    releaseDate: '2020'
  },
  {
    id: '4',
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'STAY',
    duration: '2:21',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: false,
    plays: 2394857293,
    releaseDate: '2021'
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: '2:58',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: true,
    plays: 1574829384,
    releaseDate: '2021'
  },
  {
    id: '6',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: '3:58',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    audioUrl: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb_mp3.mp3',
    isLiked: false,
    plays: 1847394857,
    releaseDate: '2020'
  }
];

const samplePlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Today\'s Top Hits',
    description: 'The biggest songs right now',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    songs: sampleSongs.slice(0, 4),
    isPublic: true,
    followers: 29847593,
    creator: 'Spotify'
  },
  {
    id: '2',
    name: 'Liked Songs',
    description: 'Your personal collection',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    songs: sampleSongs.filter(song => song.isLiked),
    isPublic: false,
    followers: 0,
    creator: 'You'
  },
  {
    id: '3',
    name: 'Chill Vibes',
    description: 'Relaxing music for any moment',
    image: 'https://images.unsplash.com/photo-1414609245224-efa02bfb01e4?w=300&h=300&fit=crop',
    songs: sampleSongs.slice(2, 6),
    isPublic: true,
    followers: 8574839,
    creator: 'Spotify'
  }
];

const SpotifyPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(sampleSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(samplePlaylists[0]);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set(['1', '3', '5']));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
    }
  };

  const toggleLike = (songId: string) => {
    const newLiked = new Set(likedSongs);
    if (newLiked.has(songId)) {
      newLiked.delete(songId);
    } else {
      newLiked.add(songId);
    }
    setLikedSongs(newLiked);
  };

  const nextSong = () => {
    const currentIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong?.id);
    const nextIndex = currentIndex < currentPlaylist.songs.length - 1 ? currentIndex + 1 : 0;
    playSong(currentPlaylist.songs[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylist.songs.length - 1;
    playSong(currentPlaylist.songs[prevIndex]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredSongs = sampleSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-black border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-500 flex items-center">
              <Music className="w-8 h-8 mr-2" />
              Spotify
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-4 mb-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'search' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'library' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-5 h-5" />
              <span>Your Library</span>
            </button>
          </nav>

          {/* Playlists */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Playlists</h3>
            <div className="space-y-2">
              {samplePlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    setCurrentPlaylist(playlist);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-8 h-8 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{playlist.name}</div>
                    <div className="text-xs text-gray-500 truncate">{playlist.creator}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black">
          {/* Header */}
          <div className="bg-gradient-to-b from-gray-800 to-transparent p-6">
            {activeTab === 'search' && (
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-black placeholder-gray-500 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'home' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Good afternoon</h2>
                
                {/* Quick Access */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {samplePlaylists.slice(0, 6).map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setCurrentPlaylist(playlist);
                      }}
                      className="flex items-center bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors p-2"
                    >
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <span className="ml-4 font-semibold text-white truncate">{playlist.name}</span>
                    </button>
                  ))}
                </div>

                {/* Recently Played */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Recently played</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {sampleSongs.slice(0, 6).map((song) => (
                      <div
                        key={song.id}
                        className="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                        onClick={() => playSong(song)}
                      >
                        <div className="relative mb-3">
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-full aspect-square rounded-lg"
                          />
                          <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 text-black fill-current" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-white truncate">{song.title}</h4>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Playlists */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Made for you</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {samplePlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedPlaylist(playlist);
                          setCurrentPlaylist(playlist);
                        }}
                      >
                        <div className="relative mb-3">
                          <img
                            src={playlist.image}
                            alt={playlist.name}
                            className="w-full aspect-square rounded-lg"
                          />
                          <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 text-black fill-current" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-white truncate">{playlist.name}</h4>
                        <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div>
                {searchQuery ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Search results for "{searchQuery}"</h2>
                    <div className="space-y-2">
                      {filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => playSong(song)}
                        >
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-12 h-12 rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{song.title}</h4>
                            <p className="text-gray-400 text-sm">{song.artist}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
                            className={`p-2 rounded-full transition-colors ${
                              likedSongs.has(song.id) ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                            }`}
                          >
                            <Heart className="w-5 h-5" fill={likedSongs.has(song.id) ? 'currentColor' : 'none'} />
                          </button>
                          <span className="text-gray-400 text-sm">{song.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Browse all</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B'].map((genre) => (
                        <div
                          key={genre}
                          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform"
                        >
                          <h3 className="text-2xl font-bold text-white">{genre}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Library</h2>
                <div className="space-y-4">
                  {samplePlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setCurrentPlaylist(playlist);
                      }}
                    >
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-16 h-16 rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{playlist.name}</h4>
                        <p className="text-gray-400 text-sm">{playlist.description}</p>
                        <p className="text-gray-500 text-xs">{playlist.songs.length} songs • {playlist.creator}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{formatNumber(playlist.followers)} followers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlist View */}
            {selectedPlaylist && (
              <div className="mt-8">
                <div className="flex items-end space-x-6 mb-8">
                  <img
                    src={selectedPlaylist.image}
                    alt={selectedPlaylist.name}
                    className="w-56 h-56 rounded-lg shadow-2xl"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white uppercase tracking-wider">Playlist</p>
                    <h1 className="text-5xl font-bold text-white mb-4">{selectedPlaylist.name}</h1>
                    <p className="text-gray-300 mb-2">{selectedPlaylist.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="font-semibold text-white">{selectedPlaylist.creator}</span>
                      <span>•</span>
                      <span>{formatNumber(selectedPlaylist.followers)} followers</span>
                      <span>•</span>
                      <span>{selectedPlaylist.songs.length} songs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <button
                    onClick={() => playSong(selectedPlaylist.songs[0])}
                    className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 transition-colors"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <Heart className="w-8 h-8" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <Download className="w-6 h-6" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </div>

                {/* Songs List */}
                <div>
                  <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 border-b border-gray-800 pb-2 mb-4">
                    <div className="col-span-1">#</div>
                    <div className="col-span-6">TITLE</div>
                    <div className="col-span-3">ALBUM</div>
                    <div className="col-span-1">PLAYS</div>
                    <div className="col-span-1"><Clock className="w-4 h-4" /></div>
                  </div>
                  <div className="space-y-2">
                    {selectedPlaylist.songs.map((song, index) => (
                      <div
                        key={song.id}
                        className={`grid grid-cols-12 gap-4 items-center p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${
                          currentSong?.id === song.id ? 'bg-gray-800' : ''
                        }`}
                        onClick={() => playSong(song)}
                      >
                        <div className="col-span-1 text-gray-400">{index + 1}</div>
                        <div className="col-span-6 flex items-center space-x-3">
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-10 h-10 rounded"
                          />
                          <div>
                            <h4 className={`font-medium ${currentSong?.id === song.id ? 'text-green-500' : 'text-white'}`}>
                              {song.title}
                            </h4>
                            <p className="text-gray-400 text-sm">{song.artist}</p>
                          </div>
                        </div>
                        <div className="col-span-3 text-gray-400 text-sm">{song.album}</div>
                        <div className="col-span-1 text-gray-400 text-sm">{formatNumber(song.plays)}</div>
                        <div className="col-span-1 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              likedSongs.has(song.id) ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                            }`}
                          >
                            <Heart className="w-4 h-4" fill={likedSongs.has(song.id) ? 'currentColor' : 'none'} />
                          </button>
                          <span className="text-gray-400 text-sm">{song.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Player */}
      {currentSong && (
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            {/* Current Song Info */}
            <div className="flex items-center space-x-4 w-1/4">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-14 h-14 rounded"
              />
              <div>
                <h4 className="font-medium text-white">{currentSong.title}</h4>
                <p className="text-gray-400 text-sm">{currentSong.artist}</p>
              </div>
              <button
                onClick={() => toggleLike(currentSong.id)}
                className={`p-2 rounded transition-colors ${
                  likedSongs.has(currentSong.id) ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                }`}
              >
                <Heart className="w-4 h-4" fill={likedSongs.has(currentSong.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center w-1/2">
              <div className="flex items-center space-x-4 mb-2">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded transition-colors ${
                    isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={prevSong} className="text-gray-400 hover:text-white">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button onClick={nextSong} className="text-gray-400 hover:text-white">
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                  className={`p-2 rounded transition-colors ${
                    repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                  {repeatMode === 'one' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-2 w-full">
                <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none slider-thumb:appearance-none slider-thumb:bg-white slider-thumb:rounded-full slider-thumb:w-3 slider-thumb:h-3 hover:slider-thumb:scale-110"
                />
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2 w-1/4 justify-end">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none slider-thumb:appearance-none slider-thumb:bg-white slider-thumb:rounded-full slider-thumb:w-3 slider-thumb:h-3"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default SpotifyPlayer; 