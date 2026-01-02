import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Target, 
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface GameStats {
  score: number;
  highScore: number;
  gamesPlayed: number;
  totalFood: number;
  averageScore: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

const SnakeGame: React.FC = () => {
  // Game configuration
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const DIFFICULTY_SPEEDS = {
    easy: 200,
    medium: 150,
    hard: 100,
    expert: 70
  };

  // Game state
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    gamesPlayed: 0,
    totalFood: 0,
    averageScore: 0
  });

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [lastMoveTime, setLastMoveTime] = useState(0);

  // Refs
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setDirection(nextDirection);
    
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (nextDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision
      if (checkCollision(head, newSnake)) {
        setGameState('gameOver');
        updateGameStats();
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + (difficulty === 'expert' ? 15 : difficulty === 'hard' ? 12 : difficulty === 'medium' ? 10 : 8));
        setFood(generateFood(newSnake));
        setGameStats(prev => ({ ...prev, totalFood: prev.totalFood + 1 }));
        
        if (soundEnabled) {
          // Play eat sound (in real app, you'd have actual audio)
          console.log('Food eaten!');
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, gameState, food, generateFood, checkCollision, difficulty, soundEnabled]);

  // Update game statistics
  const updateGameStats = useCallback(() => {
    setGameStats(prev => {
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newHighScore = Math.max(prev.highScore, score);
      const newTotalScore = prev.averageScore * prev.gamesPlayed + score;
      const newAverageScore = newTotalScore / newGamesPlayed;

      const newStats = {
        score,
        highScore: newHighScore,
        gamesPlayed: newGamesPlayed,
        totalFood: prev.totalFood,
        averageScore: Math.round(newAverageScore)
      };

      // Save to localStorage
      localStorage.setItem('snakeGameStats', JSON.stringify(newStats));
      return newStats;
    });
  }, [score]);

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    const now = Date.now();
    if (now - lastMoveTime < 50) return; // Prevent too rapid direction changes
    
    // Prevent reversing into self
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (opposites[direction] !== newDirection) {
      setNextDirection(newDirection);
      setLastMoveTime(now);
    }
  }, [direction, lastMoveTime]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
        case ' ':
          toggleGame();
          break;
        case 'r':
        case 'R':
          if (gameState === 'gameOver') {
            resetGame();
          }
          break;
      }
    };

    if (gameState === 'playing') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [changeDirection, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(moveSnake, DIFFICULTY_SPEEDS[difficulty]);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState, moveSnake, difficulty]);

  // Load saved stats
  useEffect(() => {
    const savedStats = localStorage.getItem('snakeGameStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#10b981' : '#059669'; // Head is lighter
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#ffffff';
        const eyeSize = cellSize * 0.15;
        const eyeOffset = cellSize * 0.25;
        
        ctx.fillRect(
          segment.x * cellSize + eyeOffset,
          segment.y * cellSize + eyeOffset,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          segment.x * cellSize + cellSize - eyeOffset - eyeSize,
          segment.y * cellSize + eyeOffset,
          eyeSize,
          eyeSize
        );
      }
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      food.x * cellSize + 1,
      food.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
    
    // Add shine to food
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(
      food.x * cellSize + cellSize * 0.3,
      food.y * cellSize + cellSize * 0.3,
      cellSize * 0.3,
      cellSize * 0.3
    );
  }, [snake, food]);

  const toggleGame = () => {
    if (gameState === 'idle') {
      setGameState('playing');
    } else if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameState('idle');
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
              <p className="text-green-100">Classic snake game with modern UI</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-green-100">Score</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{gameStats.highScore}</div>
                <div className="text-sm text-green-100">Best</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 p-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <div className="relative bg-gray-800 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full max-w-[600px] border border-gray-600 rounded"
              />
              
              {/* Game overlay */}
              {gameState !== 'playing' && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    {gameState === 'idle' && (
                      <>
                        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
                        <p className="text-gray-300 mb-6">Use arrow keys or WASD to control the snake</p>
                        <button
                          onClick={toggleGame}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Start Game
                        </button>
                      </>
                    )}
                    
                    {gameState === 'paused' && (
                      <>
                        <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
                        <button
                          onClick={toggleGame}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Resume
                        </button>
                      </>
                    )}
                    
                    {gameState === 'gameOver' && (
                      <>
                        <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                        <p className="text-xl text-gray-300 mb-2">Final Score: {score}</p>
                        <p className="text-gray-400 mb-6">
                          {score === gameStats.highScore ? '🎉 New High Score!' : `Best: ${gameStats.highScore}`}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={resetGame}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Play Again
                          </button>
                          <button
                            onClick={() => {
                              resetGame();
                              setGameState('playing');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Quick Start
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={toggleGame}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {gameState === 'playing' ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                  {difficulty.toUpperCase()}
                </span>
                <span className="text-gray-600">Length: {snake.length}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Score:</span>
                  <span className="font-semibold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Score:</span>
                  <span className="font-semibold text-yellow-600">{gameStats.highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played:</span>
                  <span className="font-semibold">{gameStats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food Eaten:</span>
                  <span className="font-semibold">{gameStats.totalFood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-semibold">{gameStats.averageScore}</span>
                </div>
              </div>
            </div>

            {/* Controls Guide */}
            {showControls && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Controls
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <ArrowUp className="w-4 h-4" />
                      <ArrowDown className="w-4 h-4" />
                      <ArrowLeft className="w-4 h-4" />
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span>Arrow Keys</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">WASD</span>
                    <span>Alternative controls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">SPACE</span>
                    <span>Pause/Resume</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">R</span>
                    <span>Reset (when game over)</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowControls(false)}
                  className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                >
                  Hide controls
                </button>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      disabled={gameState === 'playing'}
                    >
                      <option value="easy">Easy (Slow)</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert (Fast)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Sound Effects</span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Close Settings
                </button>
              </div>
            )}

            {/* Performance Tips */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Pro Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Plan your path ahead</li>
                <li>• Use the edges for turning</li>
                <li>• Don't rush on higher difficulties</li>
                <li>• Expert mode gives bonus points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame; 