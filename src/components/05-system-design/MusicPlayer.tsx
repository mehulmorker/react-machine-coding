import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  Plus,
  Music,
  List,
  Settings,
  Download,
  Share2,
  MoreVertical,
  Search,
  Clock
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  genre: string;
  year: number;
  isFavorite: boolean;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  coverUrl: string;
  createdAt: Date;
}

type RepeatMode = 'none' | 'one' | 'all';
type ViewMode = 'player' | 'playlist' | 'library';

const MusicPlayer: React.FC = () => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  // Player modes
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [isShuffled, setIsShuffled] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('player');
  
  // UI state
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('all');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Sample data
  const [songs] = useState<Song[]>([
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 355,
      coverUrl: '🎵',
      audioUrl: '',
      genre: 'Rock',
      year: 1975,
      isFavorite: true
    },
    {
      id: '2',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: 482,
      coverUrl: '🎸',
      audioUrl: '',
      genre: 'Rock',
      year: 1971,
      isFavorite: false
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      coverUrl: '🦅',
      audioUrl: '',
      genre: 'Rock',
      year: 1976,
      isFavorite: true
    },
    {
      id: '4',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
      coverUrl: '☮️',
      audioUrl: '',
      genre: 'Pop',
      year: 1971,
      isFavorite: false
    },
    {
      id: '5',
      title: 'Sweet Child O\' Mine',
      artist: 'Guns N\' Roses',
      album: 'Appetite for Destruction',
      duration: 356,
      coverUrl: '🌹',
      audioUrl: '',
      genre: 'Rock',
      year: 1987,
      isFavorite: true
    }
  ]);

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'favorites',
      name: 'Favorites',
      songs: songs.filter(song => song.isFavorite),
      coverUrl: '❤️',
      createdAt: new Date()
    },
    {
      id: 'rock',
      name: 'Rock Classics',
      songs: songs.filter(song => song.genre === 'Rock'),
      coverUrl: '🎸',
      createdAt: new Date()
    }
  ]);

  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>(songs);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Audio effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [repeatMode]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playSong = (song: Song, playlist: Song[] = currentPlaylist) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentIndex(playlist.findIndex(s => s.id === song.id));
    setIsPlaying(true);
    
    // In a real app, you would set the audio source here
    // audioRef.current.src = song.audioUrl;
    // audioRef.current.play();
  };

  const togglePlayPause = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0]);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentPlaylist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.length;
      if (nextIndex === 0 && repeatMode === 'none') {
        setIsPlaying(false);
        return;
      }
    }

    const nextSong = currentPlaylist[nextIndex];
    playSong(nextSong, currentPlaylist);
  };

  const playPrevious = () => {
    if (currentPlaylist.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = currentPlaylist.length - 1;
      }
    }

    const prevSong = currentPlaylist[prevIndex];
    playSong(prevSong, currentPlaylist);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleFavorite = (songId: string) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for song:', songId);
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return '🔂';
      case 'all': return '🔁';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Music Player</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('player')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'player' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Music className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('playlist')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'playlist' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('library')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'library' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Player */}
        {viewMode === 'player' && (
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              {/* Album Art */}
              <div className="text-center mb-8">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-8xl shadow-2xl">
                  {currentSong?.coverUrl || '🎵'}
                </div>
              </div>

              {/* Song Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {currentSong?.title || 'No song selected'}
                </h2>
                <p className="text-xl text-white/70">
                  {currentSong?.artist || 'Unknown artist'}
                </p>
                <p className="text-lg text-white/50">
                  {currentSong?.album || 'Unknown album'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div
                  ref={progressRef}
                  onClick={seekTo}
                  className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2"
                >
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-200"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-3 rounded-full transition-colors ${
                    isShuffled ? 'bg-purple-500 text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-6 h-6" />
                </button>

                <button
                  onClick={playPrevious}
                  className="p-3 text-white/70 hover:text-white transition-colors"
                >
                  <SkipBack className="w-8 h-8" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="p-4 bg-white text-purple-900 rounded-full hover:bg-white/90 transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>

                <button
                  onClick={playNext}
                  className="p-3 text-white/70 hover:text-white transition-colors"
                >
                  <SkipForward className="w-8 h-8" />
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`p-3 rounded-full transition-colors ${
                    repeatMode !== 'none' ? 'bg-purple-500 text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Repeat className="w-6 h-6" />
                  {getRepeatIcon() && <span className="ml-1 text-xs">{getRepeatIcon()}</span>}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                      setIsMuted(newVolume === 0);
                    }}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <span className="text-sm text-white/70 w-12">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Library View */}
        {viewMode === 'library' && (
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Music Library</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors ${
                      currentSong?.id === song.id ? 'bg-white/20' : ''
                    }`}
                    onClick={() => playSong(song, filteredSongs)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                      {song.coverUrl}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{song.title}</div>
                      <div className="text-sm text-white/70 truncate">{song.artist}</div>
                    </div>
                    <div className="text-sm text-white/50 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(song.duration)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        song.isFavorite ? 'text-pink-500' : 'text-white/50 hover:text-pink-500'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={song.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Playlists View */}
        {viewMode === 'playlist' && (
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-6">Playlists</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                    onClick={() => setCurrentPlaylist(playlist.songs)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                        {playlist.coverUrl}
                      </div>
                      <div>
                        <div className="font-medium">{playlist.name}</div>
                        <div className="text-sm text-white/70">{playlist.songs.length} songs</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {playlist.songs.slice(0, 3).map((song) => (
                        <div key={song.id} className="text-sm text-white/60 truncate">
                          {song.title} - {song.artist}
                        </div>
                      ))}
                      {playlist.songs.length > 3 && (
                        <div className="text-sm text-white/50">
                          +{playlist.songs.length - 3} more songs
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Playlist */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium mb-3">Now Playing Queue</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentPlaylist.map((song, index) => (
                    <div
                      key={song.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentIndex ? 'bg-purple-500/30' : 'hover:bg-white/10'
                      }`}
                      onClick={() => playSong(song, currentPlaylist)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-sm">
                        {song.coverUrl}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{song.title}</div>
                        <div className="text-xs text-white/70 truncate">{song.artist}</div>
                      </div>
                      <div className="text-xs text-white/50">
                        {formatTime(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
                <span>Liked Songs</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                <span>Downloads</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
                <span>Create Playlist</span>
              </button>
            </div>
          </div>

          {/* Recently Played */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recently Played</h3>
            <div className="space-y-3">
              {songs.slice(0, 4).map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  onClick={() => playSong(song)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg">
                    {song.coverUrl}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{song.title}</div>
                    <div className="text-xs text-white/70 truncate">{song.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Total Songs:</span>
                <span className="font-medium">{songs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Playlists:</span>
                <span className="font-medium">{playlists.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Favorites:</span>
                <span className="font-medium">{songs.filter(s => s.isFavorite).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Total Duration:</span>
                <span className="font-medium">
                  {formatTime(songs.reduce((total, song) => total + song.duration, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Custom CSS for slider */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
        `
      }} />
    </div>
  );
};

export default MusicPlayer; 