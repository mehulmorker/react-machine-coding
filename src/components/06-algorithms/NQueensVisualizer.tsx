import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Crown,
  Info,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Queen {
  row: number;
  col: number;
  isConflict: boolean;
  isPlaced: boolean;
}

interface SolutionStep {
  board: Queen[][];
  queens: Queen[];
  step: number;
  action: 'place' | 'remove' | 'check' | 'solution';
  description: string;
}

const NQueensVisualizer: React.FC = () => {
  const [boardSize, setBoardSize] = useState(8);
  const [board, setBoard] = useState<Queen[][]>([]);
  const [queens, setQueens] = useState<Queen[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [showSettings, setShowSettings] = useState(false);
  const [stepByStep, setStepByStep] = useState(false);
  
  const [solutions, setSolutions] = useState<Queen[][]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  
  const [stats, setStats] = useState({
    solutionsFound: 0,
    totalSteps: 0,
    backtrackCount: 0,
    executionTime: 0,
    currentStep: 0
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const solutionSteps = useRef<SolutionStep[]>([]);
  const stepIndex = useRef(0);
  const startTime = useRef<number>(0);

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: Queen[][] = [];
    for (let row = 0; row < boardSize; row++) {
      const currentRow: Queen[] = [];
      for (let col = 0; col < boardSize; col++) {
        currentRow.push({
          row,
          col,
          isConflict: false,
          isPlaced: false
        });
      }
      newBoard.push(currentRow);
    }
    return newBoard;
  }, [boardSize]);

  // Check if placing a queen at (row, col) is safe
  const isSafe = (queens: Queen[], row: number, col: number): boolean => {
    for (const queen of queens) {
      // Check same column
      if (queen.col === col) return false;
      
      // Check diagonals
      if (Math.abs(queen.row - row) === Math.abs(queen.col - col)) return false;
    }
    return true;
  };

  // Update conflicts on board
  const updateConflicts = (board: Queen[][], queens: Queen[]) => {
    // Reset all conflicts
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        board[row][col].isConflict = false;
      }
    }

    // Mark conflicts for each queen
    queens.forEach((queen, index) => {
      queens.forEach((otherQueen, otherIndex) => {
        if (index !== otherIndex) {
          // Same column conflict
          if (queen.col === otherQueen.col) {
            board[queen.row][queen.col].isConflict = true;
            board[otherQueen.row][otherQueen.col].isConflict = true;
          }
          
          // Diagonal conflict
          if (Math.abs(queen.row - otherQueen.row) === Math.abs(queen.col - otherQueen.col)) {
            board[queen.row][queen.col].isConflict = true;
            board[otherQueen.row][otherQueen.col].isConflict = true;
          }
        }
      });
    });
  };

  // Solve N-Queens using backtracking
  const solveNQueens = useCallback(() => {
    const allSolutions: Queen[][] = [];
    const steps: SolutionStep[] = [];
    let stepCount = 0;
    let backtrackCount = 0;

    const solve = (currentQueens: Queen[], row: number): boolean => {
      stepCount++;

      if (row === boardSize) {
        // Found a solution
        const solution = [...currentQueens];
        allSolutions.push(solution);
        
        const newBoard = initializeBoard();
        solution.forEach(queen => {
          newBoard[queen.row][queen.col].isPlaced = true;
        });
        
        steps.push({
          board: newBoard.map(row => [...row]),
          queens: [...solution],
          step: stepCount,
          action: 'solution',
          description: `Solution ${allSolutions.length} found!`
        });

        if (!showAllSolutions) return true; // Return first solution only
        return false; // Continue finding all solutions
      }

      for (let col = 0; col < boardSize; col++) {
        if (isSafe(currentQueens, row, col)) {
          // Place queen
          const newQueen: Queen = { row, col, isConflict: false, isPlaced: true };
          currentQueens.push(newQueen);

          const newBoard = initializeBoard();
          currentQueens.forEach(queen => {
            newBoard[queen.row][queen.col].isPlaced = true;
          });
          updateConflicts(newBoard, currentQueens);

          steps.push({
            board: newBoard.map(row => [...row]),
            queens: [...currentQueens],
            step: stepCount,
            action: 'place',
            description: `Placing queen at row ${row + 1}, column ${col + 1}`
          });

          if (solve(currentQueens, row + 1)) {
            return true;
          }

          // Backtrack
          currentQueens.pop();
          backtrackCount++;
          
          const backtrackBoard = initializeBoard();
          currentQueens.forEach(queen => {
            backtrackBoard[queen.row][queen.col].isPlaced = true;
          });

          steps.push({
            board: backtrackBoard.map(row => [...row]),
            queens: [...currentQueens],
            step: stepCount,
            action: 'remove',
            description: `Backtracking: Removing queen from row ${row + 1}, column ${col + 1}`
          });
        }
      }

      return false;
    };

    solve([], 0);
    
    return {
      solutions: allSolutions,
      steps,
      totalSteps: stepCount,
      backtrackCount
    };
  }, [boardSize, showAllSolutions, initializeBoard]);

  // Start solving animation
  const startSolving = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    startTime.current = Date.now();
    
    const result = solveNQueens();
    setSolutions(result.solutions);
    solutionSteps.current = result.steps;
    stepIndex.current = 0;
    
    setStats(prev => ({
      ...prev,
      solutionsFound: result.solutions.length,
      totalSteps: result.totalSteps,
      backtrackCount: result.backtrackCount,
      currentStep: 0
    }));

    if (stepByStep) {
      // Manual step-by-step mode
      setIsRunning(false);
      if (result.steps.length > 0) {
        const firstStep = result.steps[0];
        setBoard(firstStep.board);
        setQueens(firstStep.queens);
        setStats(prev => ({ ...prev, currentStep: 1 }));
      }
    } else {
      // Automatic animation
      animateSteps();
    }
  };

  // Animate through steps
  const animateSteps = () => {
    if (stepIndex.current >= solutionSteps.current.length) {
      setIsRunning(false);
      setStats(prev => ({ ...prev, executionTime: Date.now() - startTime.current }));
      return;
    }

    if (isPaused) return;

    const currentStep = solutionSteps.current[stepIndex.current];
    setBoard(currentStep.board);
    setQueens(currentStep.queens);
    setStats(prev => ({ ...prev, currentStep: stepIndex.current + 1 }));

    stepIndex.current++;

    animationRef.current = setTimeout(() => {
      animateSteps();
    }, animationSpeed);
  };

  // Step forward manually
  const stepForward = () => {
    if (stepIndex.current < solutionSteps.current.length) {
      const currentStep = solutionSteps.current[stepIndex.current];
      setBoard(currentStep.board);
      setQueens(currentStep.queens);
      setStats(prev => ({ ...prev, currentStep: stepIndex.current + 1 }));
      stepIndex.current++;
    }
  };

  // Step backward manually
  const stepBackward = () => {
    if (stepIndex.current > 0) {
      stepIndex.current--;
      const currentStep = solutionSteps.current[stepIndex.current];
      setBoard(currentStep.board);
      setQueens(currentStep.queens);
      setStats(prev => ({ ...prev, currentStep: stepIndex.current + 1 }));
    }
  };

  // Pause/Resume
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && isRunning) {
      animateSteps();
    }
  };

  // Reset visualization
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setBoard(initializeBoard());
    setQueens([]);
    setSolutions([]);
    setCurrentSolutionIndex(0);
    solutionSteps.current = [];
    stepIndex.current = 0;
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    setStats({
      solutionsFound: 0,
      totalSteps: 0,
      backtrackCount: 0,
      executionTime: 0,
      currentStep: 0
    });
  };

  // Show specific solution
  const showSolution = (index: number) => {
    if (index >= 0 && index < solutions.length) {
      setCurrentSolutionIndex(index);
      const solution = solutions[index];
      const newBoard = initializeBoard();
      
      solution.forEach(queen => {
        newBoard[queen.row][queen.col].isPlaced = true;
      });
      
      setBoard(newBoard);
      setQueens(solution);
    }
  };

  // Initialize board on mount or size change
  useEffect(() => {
    resetVisualization();
  }, [boardSize]);

  // Continue animation when unpaused
  useEffect(() => {
    if (isRunning && !isPaused && !stepByStep) {
      animateSteps();
    }
  }, [isPaused]);

  // Get cell classes
  const getCellClasses = (cell: Queen, rowIndex: number, colIndex: number): string => {
    const isLight = (rowIndex + colIndex) % 2 === 0;
    let baseClasses = `w-12 h-12 flex items-center justify-center text-2xl transition-all duration-300 border border-gray-300`;
    
    if (isLight) {
      baseClasses += ' bg-amber-100';
    } else {
      baseClasses += ' bg-amber-300';
    }

    if (cell.isPlaced) {
      if (cell.isConflict) {
        baseClasses += ' bg-red-400 border-red-600';
      } else {
        baseClasses += ' bg-green-400 border-green-600';
      }
    }

    return baseClasses;
  };

  const getCurrentStepDescription = (): string => {
    if (stepIndex.current > 0 && stepIndex.current <= solutionSteps.current.length) {
      return solutionSteps.current[stepIndex.current - 1].description;
    }
    return 'Ready to start solving...';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">N-Queens Visualizer</h1>
              <p className="text-yellow-100">Solve the N-Queens problem using backtracking</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.solutionsFound}</div>
                <div className="text-sm text-yellow-100">Solutions Found</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.backtrackCount}</div>
                <div className="text-sm text-yellow-100">Backtracks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Board Size */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Board Size:</label>
                <select
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isRunning}
                >
                  <option value={4}>4×4</option>
                  <option value={5}>5×5</option>
                  <option value={6}>6×6</option>
                  <option value={7}>7×7</option>
                  <option value={8}>8×8</option>
                  <option value={9}>9×9</option>
                  <option value={10}>10×10</option>
                </select>
              </div>

              {/* Animation Speed */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-20"
                  disabled={isRunning}
                />
                <span className="text-sm text-gray-600">{animationSpeed}ms</span>
              </div>

              {/* Step by Step Mode */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stepByStep"
                  checked={stepByStep}
                  onChange={(e) => setStepByStep(e.target.checked)}
                  disabled={isRunning}
                />
                <label htmlFor="stepByStep" className="text-sm font-medium text-gray-700">
                  Step-by-step mode
                </label>
              </div>

              {/* Find All Solutions */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allSolutions"
                  checked={showAllSolutions}
                  onChange={(e) => setShowAllSolutions(e.target.checked)}
                  disabled={isRunning}
                />
                <label htmlFor="allSolutions" className="text-sm font-medium text-gray-700">
                  Find all solutions
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Action Buttons */}
              <button
                onClick={startSolving}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                <Crown className="w-4 h-4" />
                Solve N-Queens
              </button>

              {!stepByStep && (
                <button
                  onClick={togglePause}
                  disabled={!isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}

              {stepByStep && (
                <>
                  <button
                    onClick={stepBackward}
                    disabled={stepIndex.current <= 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={stepForward}
                    disabled={stepIndex.current >= solutionSteps.current.length}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    →
                  </button>
                </>
              )}

              <button
                onClick={resetVisualization}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Settings & Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">N-Queens Problem</h4>
                  <p className="text-sm text-gray-600">
                    Place N queens on an N×N chessboard so that no two queens attack each other.
                    Queens attack horizontally, vertically, and diagonally.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Backtracking Algorithm</h4>
                  <p className="text-sm text-gray-600">
                    Systematically explores all possible placements, backtracking when conflicts arise.
                    Guarantees finding all solutions if they exist.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Step Description */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Current Step</h3>
            </div>
            <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
            <div className="mt-2 text-xs text-gray-500">
              Step {stats.currentStep} of {solutionSteps.current.length}
            </div>
          </div>

          {/* Chessboard */}
          <div className="mb-6 flex justify-center">
            <div className="border-4 border-gray-800 rounded-lg overflow-hidden inline-block">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClasses(cell, rowIndex, colIndex)}
                    >
                      {cell.isPlaced && <Crown className="w-8 h-8 text-gray-800" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Navigation */}
          {solutions.length > 1 && (
            <div className="mb-6 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Found Solutions ({solutions.length})</h3>
              <div className="flex flex-wrap gap-2">
                {solutions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => showSolution(index)}
                    className={`px-3 py-1 rounded ${
                      currentSolutionIndex === index
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-green-600 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    Solution {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Solutions Found:</span>
                  <span className="font-semibold">{stats.solutionsFound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-semibold">{stats.totalSteps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backtracks:</span>
                  <span className="font-semibold">{stats.backtrackCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Execution Time:</span>
                  <span className="font-semibold">{stats.executionTime}ms</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-gray-600" />
                Legend
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-100 border border-gray-300"></div>
                  <span>Light Square</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-300 border border-gray-300"></div>
                  <span>Dark Square</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 border border-green-600 flex items-center justify-center">
                    <Crown className="w-2 h-2 text-gray-800" />
                  </div>
                  <span>Safe Queen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 border border-red-600 flex items-center justify-center">
                    <Crown className="w-2 h-2 text-gray-800" />
                  </div>
                  <span>Conflicting Queen</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Complexity
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Board Size:</span>
                  <span className="font-semibold">{boardSize}×{boardSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Search Space:</span>
                  <span className="font-semibold">~{Math.pow(boardSize, boardSize).toExponential(1)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  The N-Queens problem has exponential time complexity. 
                  Larger boards may take significantly longer to solve.
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-600" />
              Instructions
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Select board size and solving options</li>
              <li>• Click "Solve N-Queens" to start the backtracking algorithm</li>
              <li>• Watch as queens are placed and removed during backtracking</li>
              <li>• Use step-by-step mode for detailed analysis</li>
              <li>• Enable "Find all solutions" to discover every possible arrangement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NQueensVisualizer; 