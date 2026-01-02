import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCw, ArrowDown, ArrowLeft, ArrowRight, Home, Volume2, VolumeX } from 'lucide-react';

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

// Tetromino shapes (each represented as 4x4 grid)
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f5ff'
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#ffff00'
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: '#ff7f00'
  }
};

interface Piece {
  type: keyof typeof TETROMINOES;
  x: number;
  y: number;
  rotation: number;
}

interface GameStats {
  score: number;
  level: number;
  lines: number;
  totalPieces: number;
  totalGames: number;
  highScore: number;
}

const TetrisGame: React.FC = () => {
  // Game state
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameOver'>('idle');
  const [gameSpeed, setGameSpeed] = useState(500); // ms
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Game statistics
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('tetris-stats');
    return saved ? JSON.parse(saved) : {
      score: 0,
      level: 1,
      lines: 0,
      totalPieces: 0,
      totalGames: 0,
      highScore: 0
    };
  });

  // Refs for game loop
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDropTimeRef = useRef(0);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('tetris-stats', JSON.stringify(stats));
  }, [stats]);

  // Create random tetromino
  const createRandomPiece = useCallback((): Piece => {
    const types = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return {
      type: randomType,
      x: Math.floor(BOARD_WIDTH / 2) - 2,
      y: 0,
      rotation: 0
    };
  }, []);

  // Rotate piece shape based on rotation value
  const rotatePiece = (shape: number[][], rotation: number): number[][] => {
    let rotated = shape;
    for (let i = 0; i < rotation; i++) {
      const n = rotated.length;
      const temp = Array(n).fill(null).map(() => Array(n).fill(0));
      
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          temp[col][n - 1 - row] = rotated[row][col];
        }
      }
      rotated = temp;
    }
    return rotated;
  };

  // Check if piece position is valid
  const isValidPosition = useCallback((piece: Piece, board: number[][]): boolean => {
    const shape = rotatePiece(TETROMINOES[piece.type].shape, piece.rotation);
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = piece.x + col;
          const newY = piece.y + row;
          
          // Check boundaries
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          // Check collision with existing pieces
          if (newY >= 0 && board[newY][newX] !== EMPTY_CELL) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  // Place piece on board
  const placePiece = useCallback((piece: Piece, board: number[][]): number[][] => {
    const newBoard = board.map(row => [...row]);
    const shape = rotatePiece(TETROMINOES[piece.type].shape, piece.rotation);
    const color = TETROMINOES[piece.type].color;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = piece.x + col;
          const newY = piece.y + row;
          if (newY >= 0) {
            newBoard[newY][newX] = 1; // Mark as filled
          }
        }
      }
    }
    return newBoard;
  }, []);

  // Clear completed lines
  const clearLines = useCallback((board: number[][]): { newBoard: number[][], linesCleared: number } => {
    const newBoard = [...board];
    let linesCleared = 0;
    
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every(cell => cell !== EMPTY_CELL)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
        linesCleared++;
        row++; // Check the same row again
      }
    }
    
    return { newBoard, linesCleared };
  }, []);

  // Calculate score based on lines cleared
  const calculateScore = (linesCleared: number, level: number): number => {
    const baseScores = [0, 40, 100, 300, 1200];
    return baseScores[linesCleared] * level;
  };

  // Move piece
  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (!currentPiece || gameState !== 'playing') return;

    let newPiece = { ...currentPiece };
    
    switch (direction) {
      case 'left':
        newPiece.x -= 1;
        break;
      case 'right':
        newPiece.x += 1;
        break;
      case 'down':
        newPiece.y += 1;
        break;
      case 'rotate':
        newPiece.rotation = (newPiece.rotation + 1) % 4;
        break;
    }

    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else if (direction === 'down') {
      // Piece has landed, place it and create new piece
      const newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      
      // Update stats
      const scoreGained = calculateScore(linesCleared, stats.level);
      const newLines = stats.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const newScore = stats.score + scoreGained;
      
      setStats(prev => ({
        ...prev,
        score: newScore,
        level: newLevel,
        lines: newLines,
        totalPieces: prev.totalPieces + 1,
        highScore: Math.max(prev.highScore, newScore)
      }));
      
      // Increase speed based on level
      setGameSpeed(Math.max(50, 500 - (newLevel - 1) * 30));
      
      // Create new piece
      const newCurrentPiece = nextPiece || createRandomPiece();
      const newNextPiece = createRandomPiece();
      
      // Check game over
      if (!isValidPosition(newCurrentPiece, clearedBoard)) {
        setGameState('gameOver');
        setStats(prev => ({ ...prev, totalGames: prev.totalGames + 1 }));
      } else {
        setCurrentPiece(newCurrentPiece);
        setNextPiece(newNextPiece);
      }
    }
  }, [currentPiece, gameState, board, isValidPosition, placePiece, clearLines, stats, nextPiece, createRandomPiece]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        movePiece('down');
      }, gameSpeed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameSpeed, movePiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          event.preventDefault();
          movePiece('rotate');
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePiece]);

  // Game control functions
  const startGame = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));
    const firstPiece = createRandomPiece();
    const secondPiece = createRandomPiece();
    
    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setStats(prev => ({ ...prev, score: 0, level: 1, lines: 0 }));
    setGameSpeed(500);
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('idle');
    setCurrentPiece(null);
    setNextPiece(null);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)));
  };

  // Render board with current piece
  const renderBoard = () => {
    let displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      const shape = rotatePiece(TETROMINOES[currentPiece.type].shape, currentPiece.rotation);
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] !== 0) {
            const newX = currentPiece.x + col;
            const newY = currentPiece.y + row;
            if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
              displayBoard[newY][newX] = 2; // Current piece marker
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const shape = TETROMINOES[nextPiece.type].shape;
    const color = TETROMINOES[nextPiece.type].color;
    
    return shape.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-4 h-4 border border-gray-300"
            style={{
              backgroundColor: cell === 1 ? color : '#f8f9fa'
            }}
          />
        ))}
      </div>
    ));
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-cyan-400">Tetris Game</h1>
          <p className="text-gray-300">Classic block-stacking puzzle game</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-10 gap-px bg-gray-700 p-2 rounded mx-auto w-fit">
                {displayBoard.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="w-6 h-6 border border-gray-600"
                      style={{
                        backgroundColor: 
                          cell === 2 ? TETROMINOES[currentPiece?.type || 'I'].color :
                          cell === 1 ? '#666' : '#1f2937'
                      }}
                    />
                  ))
                )}
              </div>
              
              {/* Game Over Overlay */}
              {gameState === 'gameOver' && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
                    <p className="text-xl mb-2">Final Score: {stats.score.toLocaleString()}</p>
                    <p className="text-lg mb-4">Level: {stats.level}</p>
                    <button
                      onClick={startGame}
                      className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded font-medium"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
              
              {/* Paused Overlay */}
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-4">Paused</h2>
                    <p className="text-lg">Press P to resume</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => movePiece('left')}
                disabled={gameState !== 'playing'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePiece('rotate')}
                disabled={gameState !== 'playing'}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 p-3 rounded flex items-center justify-center"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePiece('right')}
                disabled={gameState !== 'playing'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePiece('down')}
                disabled={gameState !== 'playing'}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-3 rounded flex items-center justify-center"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game Controls */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Game Controls</h3>
              <div className="space-y-2">
                {gameState === 'idle' && (
                  <button
                    onClick={startGame}
                    className="w-full bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Game
                  </button>
                )}
                
                {gameState === 'playing' && (
                  <button
                    onClick={togglePause}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded flex items-center justify-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                
                {gameState === 'paused' && (
                  <button
                    onClick={togglePause}
                    className="w-full bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Resume
                  </button>
                )}
                
                <button
                  onClick={resetGame}
                  className="w-full bg-red-600 hover:bg-red-700 p-2 rounded flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Reset
                </button>
                
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded flex items-center justify-center gap-2"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Sound: {soundEnabled ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            {/* Next Piece */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Next Piece</h3>
              <div className="flex justify-center">
                <div className="space-y-px">
                  {renderNextPiece()}
                </div>
              </div>
            </div>

            {/* Current Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Current Game</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-yellow-400">{stats.score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-green-400">{stats.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span className="font-bold text-blue-400">{stats.lines}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pieces:</span>
                  <span className="font-bold text-purple-400">{stats.totalPieces}</span>
                </div>
              </div>
            </div>

            {/* All-Time Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">All-Time Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>High Score:</span>
                  <span className="font-bold text-yellow-400">{stats.highScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Games Played:</span>
                  <span className="font-bold text-gray-300">{stats.totalGames}</span>
                </div>
              </div>
            </div>

            {/* Controls Guide */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Controls</h3>
              <div className="space-y-1 text-sm">
                <div>← / A: Move Left</div>
                <div>→ / D: Move Right</div>
                <div>↓ / S: Soft Drop</div>
                <div>↑ / W / Space: Rotate</div>
                <div>P: Pause/Resume</div>
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">About</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Classic Tetris with all 7 tetromino shapes.</p>
                <p>Clear horizontal lines to score points.</p>
                <p>Game speed increases every 10 lines.</p>
                <p>Try to achieve the highest score!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame; 