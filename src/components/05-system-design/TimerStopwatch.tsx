import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  Timer as TimerIcon,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Flag,
  Bell,
  Settings,
  Save,
  Trash2,
  Edit2,
  History,
  AlertCircle
} from 'lucide-react';

type Mode = 'stopwatch' | 'timer';
type TimerStatus = 'stopped' | 'running' | 'paused' | 'finished';

interface LapTime {
  id: string;
  lapNumber: number;
  lapTime: number;
  totalTime: number;
  timestamp: Date;
}

interface PresetTimer {
  id: string;
  name: string;
  duration: number; // in seconds
  createdAt: Date;
}

interface TimerSession {
  id: string;
  mode: Mode;
  duration: number;
  completedAt: Date;
  type: string;
}

const TimerStopwatch: React.FC = () => {
  const [mode, setMode] = useState<Mode>('stopwatch');
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const [time, setTime] = useState(0); // in milliseconds
  const [displayTime, setDisplayTime] = useState(0);
  
  // Timer specific state
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [remainingTime, setRemainingTime] = useState(0);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customSeconds, setCustomSeconds] = useState(0);
  
  // Stopwatch specific state
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lapStartTime, setLapStartTime] = useState(0);
  
  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMilliseconds, setShowMilliseconds] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  
  // Presets and history
  const [presets, setPresets] = useState<PresetTimer[]>([
    { id: '1', name: 'Pomodoro', duration: 1500, createdAt: new Date() }, // 25 min
    { id: '2', name: 'Short Break', duration: 300, createdAt: new Date() }, // 5 min
    { id: '3', name: 'Long Break', duration: 900, createdAt: new Date() }, // 15 min
    { id: '4', name: 'Study Session', duration: 3600, createdAt: new Date() }, // 1 hour
  ]);
  
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Initialize audio
  useEffect(() => {
    // Create audio context for timer alerts
    audioRef.current = new Audio();
    // In a real app, you would load actual audio files
    // audioRef.current.src = '/path/to/timer-sound.mp3';
  }, []);

  const formatTime = useCallback((ms: number, includeMs: boolean = showMilliseconds) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${includeMs ? `.${milliseconds.toString().padStart(2, '0')}` : ''}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${includeMs ? `.${milliseconds.toString().padStart(2, '0')}` : ''}`;
  }, [showMilliseconds]);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // 800 Hz
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  const startTimer = useCallback(() => {
    if (status === 'running') return;
    
    setStatus('running');
    const now = Date.now();
    
    if (mode === 'stopwatch') {
      if (status === 'paused') {
        startTimeRef.current = now - pausedTimeRef.current;
      } else {
        startTimeRef.current = now;
        setTime(0);
        setLapStartTime(0);
      }
    } else {
      if (status === 'paused') {
        startTimeRef.current = now - (timerDuration * 1000 - remainingTime);
      } else {
        startTimeRef.current = now;
        setRemainingTime(timerDuration * 1000);
      }
    }
  }, [status, mode, timerDuration, remainingTime]);

  const pauseTimer = useCallback(() => {
    setStatus('paused');
    if (mode === 'stopwatch') {
      pausedTimeRef.current = time;
    }
  }, [mode, time]);

  const resetTimer = useCallback(() => {
    setStatus('stopped');
    setTime(0);
    setDisplayTime(0);
    setRemainingTime(0);
    setLaps([]);
    setLapStartTime(0);
    pausedTimeRef.current = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const addLap = useCallback(() => {
    if (mode !== 'stopwatch' || status !== 'running') return;
    
    const currentTime = time;
    const lapTime = currentTime - lapStartTime;
    
    const newLap: LapTime = {
      id: `lap-${Date.now()}`,
      lapNumber: laps.length + 1,
      lapTime,
      totalTime: currentTime,
      timestamp: new Date()
    };
    
    setLaps(prev => [newLap, ...prev]);
    setLapStartTime(currentTime);
  }, [mode, status, time, laps.length, lapStartTime]);

  const setCustomTimer = useCallback(() => {
    const totalSeconds = customHours * 3600 + customMinutes * 60 + customSeconds;
    setTimerDuration(totalSeconds);
    setRemainingTime(totalSeconds * 1000);
    setStatus('stopped');
  }, [customHours, customMinutes, customSeconds]);

  const selectPreset = useCallback((preset: PresetTimer) => {
    setTimerDuration(preset.duration);
    setRemainingTime(preset.duration * 1000);
    setStatus('stopped');
    setShowPresets(false);
  }, []);

  const savePreset = useCallback(() => {
    const name = prompt('Enter preset name:');
    if (!name) return;
    
    const newPreset: PresetTimer = {
      id: `preset-${Date.now()}`,
      name,
      duration: timerDuration,
      createdAt: new Date()
    };
    
    setPresets(prev => [...prev, newPreset]);
  }, [timerDuration]);

  const saveSession = useCallback((type: string, duration: number) => {
    const session: TimerSession = {
      id: `session-${Date.now()}`,
      mode,
      duration,
      completedAt: new Date(),
      type
    };
    
    setSessions(prev => [session, ...prev.slice(0, 49)]); // Keep last 50 sessions
  }, [mode]);

  // Main timer loop
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        
        if (mode === 'stopwatch') {
          setTime(elapsed);
          setDisplayTime(elapsed);
        } else {
          const remaining = Math.max(0, timerDuration * 1000 - elapsed);
          setRemainingTime(remaining);
          setDisplayTime(timerDuration * 1000 - remaining);
          
          if (remaining === 0) {
            setStatus('finished');
            playSound();
            saveSession('Timer Completed', timerDuration);
          }
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, mode, timerDuration, playSound, saveSession]);

  // Auto-start next timer
  useEffect(() => {
    if (status === 'finished' && autoStart) {
      setTimeout(() => {
        resetTimer();
        if (mode === 'timer') {
          startTimer();
        }
      }, 1000);
    }
  }, [status, autoStart, mode, resetTimer, startTimer]);

  const getBestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((best, current) => 
      current.lapTime < best.lapTime ? current : best
    );
  };

  const getWorstLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, current) => 
      current.lapTime > worst.lapTime ? current : worst
    );
  };

  const getAverageLap = () => {
    if (laps.length === 0) return 0;
    const total = laps.reduce((sum, lap) => sum + lap.lapTime, 0);
    return total / laps.length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Timer & Stopwatch</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <History className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex mt-4 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => { setMode('stopwatch'); resetTimer(); }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                mode === 'stopwatch' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              Stopwatch
            </button>
            <button
              onClick={() => { setMode('timer'); resetTimer(); }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                mode === 'timer' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
              }`}
            >
              <TimerIcon className="w-4 h-4" />
              Timer
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Main Display */}
          <div className="text-center mb-8">
            <div className={`text-8xl font-mono font-bold mb-4 ${
              status === 'finished' ? 'text-red-600' : 
              status === 'running' ? 'text-green-600' : 'text-gray-800'
            }`}>
              {mode === 'stopwatch' 
                ? formatTime(displayTime) 
                : formatTime(remainingTime || timerDuration * 1000)
              }
            </div>
            
            {status === 'finished' && (
              <div className="flex items-center justify-center gap-2 text-red-600 text-xl font-semibold">
                <AlertCircle className="w-6 h-6" />
                Time's Up!
              </div>
            )}
            
            {mode === 'stopwatch' && laps.length > 0 && (
              <div className="text-lg text-gray-600">
                Lap {laps.length}: {formatTime(time - lapStartTime)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {status === 'stopped' ? (
              <button
                onClick={startTimer}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            ) : status === 'running' ? (
              <>
                <button
                  onClick={pauseTimer}
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
                {mode === 'stopwatch' && (
                  <button
                    onClick={addLap}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-5 h-5" />
                    Lap
                  </button>
                )}
              </>
            ) : status === 'paused' ? (
              <button
                onClick={startTimer}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
            ) : (
              <button
                onClick={resetTimer}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Timer Settings */}
            {mode === 'timer' && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TimerIcon className="w-5 h-5" />
                  Timer Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Custom Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Custom Time
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={customHours}
                          onChange={(e) => setCustomHours(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Hours"
                        />
                      </div>
                      <span className="text-gray-500">:</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Minutes"
                        />
                      </div>
                      <span className="text-gray-500">:</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={customSeconds}
                          onChange={(e) => setCustomSeconds(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Seconds"
                        />
                      </div>
                    </div>
                    <button
                      onClick={setCustomTimer}
                      className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      Set Timer
                    </button>
                  </div>
                  
                  {/* Preset Buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Quick Presets
                      </label>
                      <button
                        onClick={() => setShowPresets(!showPresets)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {showPresets ? 'Hide' : 'Show All'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {presets.slice(0, showPresets ? presets.length : 4).map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => selectPreset(preset)}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm transition-colors"
                        >
                          {preset.name}
                          <div className="text-xs text-gray-500">
                            {formatTime(preset.duration * 1000, false)}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={savePreset}
                      className="mt-2 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Current as Preset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lap Times / Stats */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {mode === 'stopwatch' ? (
                  <>
                    <Flag className="w-5 h-5" />
                    Lap Times
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    Statistics
                  </>
                )}
              </h3>
              
              {mode === 'stopwatch' ? (
                <div className="space-y-3">
                  {laps.length > 0 && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-600 font-semibold">Best Lap</div>
                          <div>{formatTime(getBestLap()?.lapTime || 0)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-semibold">Worst Lap</div>
                          <div>{formatTime(getWorstLap()?.lapTime || 0)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-600 font-semibold">Average</div>
                          <div>{formatTime(getAverageLap())}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {laps.map((lap) => (
                      <div
                        key={lap.id}
                        className={`flex items-center justify-between p-3 bg-white rounded-lg ${
                          lap.id === getBestLap()?.id ? 'ring-2 ring-green-400' :
                          lap.id === getWorstLap()?.id ? 'ring-2 ring-red-400' : ''
                        }`}
                      >
                        <span className="font-medium">Lap {lap.lapNumber}</span>
                        <div className="text-right">
                          <div className="font-mono font-semibold">
                            {formatTime(lap.lapTime)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: {formatTime(lap.totalTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {laps.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        Start the stopwatch and press "Lap" to record lap times
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatTime(timerDuration * 1000, false)}
                      </div>
                      <div className="text-sm text-gray-500">Timer Duration</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {Math.round(((timerDuration * 1000 - remainingTime) / (timerDuration * 1000)) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-orange-600">
                        {status === 'running' ? 'Running' : 
                         status === 'paused' ? 'Paused' :
                         status === 'finished' ? 'Finished' : 'Stopped'}
                      </div>
                      <div className="text-xs text-gray-500">Status</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Sound Alerts
                    </label>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Show Milliseconds
                    </label>
                    <button
                      onClick={() => setShowMilliseconds(!showMilliseconds)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        showMilliseconds ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {showMilliseconds ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Auto-start Next Timer
                    </label>
                    <button
                      onClick={() => setAutoStart(!autoStart)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        autoStart ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {autoStart ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Session History
              </h3>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-medium">{session.type}</div>
                      <div className="text-sm text-gray-500">
                        {session.completedAt.toLocaleDateString()} at {session.completedAt.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold">
                        {formatTime(session.duration * 1000, false)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {session.mode}
                      </div>
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No sessions completed yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerStopwatch; 