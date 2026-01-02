import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, User, Bot, Trophy, Clock, Settings, Play, Home } from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameMode = 'pvp' | 'ai-easy' | 'ai-hard';
type GameStatus = 'playing' | 'win' | 'draw';

interface GameState {
  board: Player[];
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player;
  winningLine: number[] | null;
  moveHistory: { board: Player[]; player: Player; position: number }[];
}

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
}

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameStatus: 'playing',
    winner: null,
    winningLine: null,
    moveHistory: []
  });

  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [aiSymbol, setAiSymbol] = useState<Player>('O');
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  // Check for winner
  const checkWinner = useCallback((board: Player[]): { winner: Player; winningLine: number[] | null } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winningLine: combination };
      }
    }
    return { winner: null, winningLine: null };
  }, [winningCombinations]);

  // Check if board is full
  const isBoardFull = (board: Player[]): boolean => {
    return board.every(cell => cell !== null);
  };

  // AI Move - Easy (Random)
  const getRandomMove = (board: Player[]): number => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  // AI Move - Hard (Minimax Algorithm)
  const minimax = (board: Player[], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const { winner } = checkWinner(board);
    
    if (winner === aiSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = aiSymbol;
          const eval_score = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, eval_score);
          alpha = Math.max(alpha, eval_score);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = playerSymbol;
          const eval_score = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          minEval = Math.min(minEval, eval_score);
          beta = Math.min(beta, eval_score);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  };

  const getBestMove = (board: Player[]): number => {
    let bestMove = -1;
    let bestValue = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const moveValue = minimax(board, 0, false);
        board[i] = null;

        if (moveValue > bestValue) {
          bestMove = i;
          bestValue = moveValue;
        }
      }
    }

    return bestMove;
  };

  // Make AI move
  const makeAIMove = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || gameState.currentPlayer !== aiSymbol) return;

    setTimeout(() => {
      const newBoard = [...gameState.board];
      let aiMove: number;

      if (gameMode === 'ai-easy') {
        aiMove = getRandomMove(newBoard);
      } else {
        aiMove = getBestMove(newBoard);
      }

      if (aiMove !== -1) {
        newBoard[aiMove] = aiSymbol;
        
        const { winner, winningLine } = checkWinner(newBoard);
        const newGameStatus: GameStatus = winner ? 'win' : isBoardFull(newBoard) ? 'draw' : 'playing';

        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: playerSymbol,
          gameStatus: newGameStatus,
          winner,
          winningLine,
          moveHistory: [...prev.moveHistory, { board: newBoard, player: aiSymbol, position: aiMove }]
        }));
      }
    }, 500); // Add delay for better UX
  }, [gameState, gameMode, aiSymbol, playerSymbol, checkWinner]);

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (gameState.board[index] !== null || gameState.gameStatus !== 'playing') return;
    
    // For AI modes, only allow player moves
    if ((gameMode === 'ai-easy' || gameMode === 'ai-hard') && gameState.currentPlayer !== playerSymbol) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, winningLine } = checkWinner(newBoard);
    const newGameStatus: GameStatus = winner ? 'win' : isBoardFull(newBoard) ? 'draw' : 'playing';
    
    const nextPlayer: Player = gameState.currentPlayer === 'X' ? 'O' : 'X';

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: newGameStatus,
      winner,
      winningLine,
      moveHistory: [...prev.moveHistory, { board: newBoard, player: gameState.currentPlayer, position: index }]
    }));
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      winningLine: null,
      moveHistory: []
    });
    setGameStarted(true);
  };

  // Update stats when game ends
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' && gameStarted) {
      setStats(prev => {
        const newStats = { ...prev };
        newStats.gamesPlayed += 1;

        if (gameState.gameStatus === 'draw') {
          newStats.draws += 1;
        } else if (gameState.winner === playerSymbol) {
          newStats.wins += 1;
        } else {
          newStats.losses += 1;
        }

        return newStats;
      });
    }
  }, [gameState.gameStatus, gameState.winner, playerSymbol, gameStarted]);

  // Trigger AI move
  useEffect(() => {
    if ((gameMode === 'ai-easy' || gameMode === 'ai-hard') && gameState.currentPlayer === aiSymbol && gameState.gameStatus === 'playing') {
      makeAIMove();
    }
  }, [gameState.currentPlayer, gameMode, aiSymbol, makeAIMove, gameState.gameStatus]);

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const getCellClassName = (index: number) => {
    let className = 'w-20 h-20 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 hover:bg-gray-100';
    
    if (gameState.board[index]) {
      className += gameState.board[index] === 'X' ? ' text-blue-600' : ' text-red-600';
    }
    
    if (gameState.winningLine?.includes(index)) {
      className += ' bg-green-200 border-green-400';
    }
    
    if (gameState.gameStatus !== 'playing' || gameState.board[index]) {
      className += ' cursor-not-allowed';
    }

    return className;
  };

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tic-Tac-Toe Game</h1>
            <p className="text-gray-600">Challenge yourself against AI or play with a friend!</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Game Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setGameMode('pvp')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    gameMode === 'pvp' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">Player vs Player</div>
                  <div className="text-sm text-gray-500">Classic 2-player mode</div>
                </button>
                <button
                  onClick={() => setGameMode('ai-easy')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    gameMode === 'ai-easy' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <Bot className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">AI Easy</div>
                  <div className="text-sm text-gray-500">Random moves</div>
                </button>
                <button
                  onClick={() => setGameMode('ai-hard')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    gameMode === 'ai-hard' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <Bot className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <div className="font-medium">AI Hard</div>
                  <div className="text-sm text-gray-500">Minimax algorithm</div>
                </button>
              </div>
            </div>

            {(gameMode === 'ai-easy' || gameMode === 'ai-hard') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Your Symbol</label>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setPlayerSymbol('X');
                      setAiSymbol('O');
                    }}
                    className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-colors ${
                      playerSymbol === 'X' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'
                    }`}
                  >
                    X
                  </button>
                  <button
                    onClick={() => {
                      setPlayerSymbol('O');
                      setAiSymbol('X');
                    }}
                    className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-colors ${
                      playerSymbol === 'O' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200'
                    }`}
                  >
                    O
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Game Board */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Tic-Tac-Toe</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGameStarted(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Game Status */}
            <div className="text-center mb-6">
              {gameState.gameStatus === 'playing' ? (
                <div className="text-lg">
                  Current Player: <span className={`font-bold ${gameState.currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                    {gameState.currentPlayer}
                  </span>
                  {(gameMode === 'ai-easy' || gameMode === 'ai-hard') && (
                    <span className="ml-2 text-gray-500">
                      ({gameState.currentPlayer === playerSymbol ? 'You' : 'AI'})
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-lg">
                  {gameState.gameStatus === 'draw' ? (
                    <span className="text-yellow-600 font-bold">It's a Draw!</span>
                  ) : (
                    <span className={`font-bold ${gameState.winner === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                      {gameState.winner} Wins!
                      {(gameMode === 'ai-easy' || gameMode === 'ai-hard') && (
                        <span className="ml-2">
                          ({gameState.winner === playerSymbol ? 'You Win!' : 'AI Wins!'})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Game Board */}
            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-3 gap-1 bg-gray-400 p-1 rounded-lg">
                {gameState.board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={getCellClassName(index)}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Games Played:</span>
                <span className="font-medium">{stats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Wins:</span>
                <span className="font-medium text-green-600">{stats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Losses:</span>
                <span className="font-medium text-red-600">{stats.losses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Draws:</span>
                <span className="font-medium text-yellow-600">{stats.draws}</span>
              </div>
              {stats.gamesPlayed > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium">
                      {Math.round((stats.wins / stats.gamesPlayed) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-medium capitalize">
                  {gameMode === 'pvp' ? 'Player vs Player' : `AI ${gameMode.split('-')[1]}`}
                </span>
              </div>
              {(gameMode === 'ai-easy' || gameMode === 'ai-hard') && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You:</span>
                    <span className={`font-bold ${playerSymbol === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                      {playerSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI:</span>
                    <span className={`font-bold ${aiSymbol === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                      {aiSymbol}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Moves:</span>
                <span className="font-medium">{gameState.moveHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Move History */}
          {gameState.moveHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Move History
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameState.moveHistory.map((move, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">Move {index + 1}:</span>
                    <span className={`font-medium ${move.player === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                      {move.player} → Position {move.position + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe; 