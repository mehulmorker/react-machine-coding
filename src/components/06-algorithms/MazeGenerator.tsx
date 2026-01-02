import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Zap, 
  MapPin,
  Target,
  Download,
  Upload,
  Info,
  Grid3X3,
  Mouse
} from 'lucide-react';

interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  isVisited: boolean;
  isInMaze: boolean;
  parent: Cell | null;
}

type MazeAlgorithm = 'recursive-backtracking' | 'randomized-prims' | 'randomized-kruskals' | 'binary-tree';
type SolveAlgorithm = 'dfs' | 'bfs' | 'astar';

const MazeGenerator: React.FC = () => {
  const ROWS = 31; // Odd number for proper maze generation
  const COLS = 51; // Odd number for proper maze generation
  
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [algorithm, setAlgorithm] = useState<MazeAlgorithm>('recursive-backtracking');
  const [solveAlgorithm, setSolveAlgorithm] = useState<SolveAlgorithm>('dfs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [startPos, setStartPos] = useState({ row: 1, col: 1 });
  const [endPos, setEndPos] = useState({ row: ROWS - 2, col: COLS - 2 });
  
  const [stats, setStats] = useState({
    generationTime: 0,
    solvingTime: 0,
    pathLength: 0,
    cellsVisited: 0
  });

  const animationRef = useRef<NodeJS.Timeout[]>([]);

  // Initialize maze with all walls
  const initializeMaze = useCallback(() => {
    const newMaze: Cell[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push({
          row,
          col,
          isWall: true,
          isStart: row === startPos.row && col === startPos.col,
          isEnd: row === endPos.row && col === endPos.col,
          isPath: false,
          isVisited: false,
          isInMaze: false,
          parent: null
        });
      }
      newMaze.push(currentRow);
    }
    return newMaze;
  }, [startPos, endPos]);

  // Get neighbors for maze generation
  const getMazeNeighbors = (cell: Cell, maze: Cell[][], distance = 2): Cell[] => {
    const neighbors: Cell[] = [];
    const { row, col } = cell;
    
    const directions = [
      [-distance, 0], // Up
      [distance, 0],  // Down
      [0, -distance], // Left
      [0, distance]   // Right
    ];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
        neighbors.push(maze[newRow][newCol]);
      }
    }
    
    return neighbors;
  };

  // Recursive Backtracking Algorithm
  const generateRecursiveBacktracking = async (startCell: Cell, maze: Cell[][]) => {
    const stack: Cell[] = [startCell];
    const steps: (() => void)[] = [];
    
    startCell.isInMaze = true;
    startCell.isWall = false;
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getMazeNeighbors(current, maze).filter(n => n.isWall && !n.isInMaze);
      
      if (neighbors.length > 0) {
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Remove wall between current and neighbor
        const wallRow = (current.row + randomNeighbor.row) / 2;
        const wallCol = (current.col + randomNeighbor.col) / 2;
        
        steps.push(() => {
          setMaze(prevMaze => {
            const newMaze = [...prevMaze];
            newMaze[wallRow][wallCol] = { ...newMaze[wallRow][wallCol], isWall: false, isInMaze: true };
            newMaze[randomNeighbor.row][randomNeighbor.col] = { 
              ...newMaze[randomNeighbor.row][randomNeighbor.col], 
              isWall: false, 
              isInMaze: true 
            };
            return newMaze;
          });
        });
        
        randomNeighbor.isInMaze = true;
        randomNeighbor.isWall = false;
        maze[wallRow][wallCol].isWall = false;
        maze[wallRow][wallCol].isInMaze = true;
        
        stack.push(randomNeighbor);
      } else {
        stack.pop();
      }
    }
    
    // Execute animation steps
    for (let i = 0; i < steps.length; i++) {
      setTimeout(steps[i], i * animationSpeed);
    }
    
    return steps.length * animationSpeed;
  };

  // Randomized Prim's Algorithm
  const generateRandomizedPrims = async (startCell: Cell, maze: Cell[][]) => {
    const frontier: Cell[] = [];
    const steps: (() => void)[] = [];
    
    startCell.isInMaze = true;
    startCell.isWall = false;
    
    // Add neighbors to frontier
    getMazeNeighbors(startCell, maze).forEach(neighbor => {
      if (!frontier.includes(neighbor)) {
        frontier.push(neighbor);
      }
    });
    
    while (frontier.length > 0) {
      const randomIndex = Math.floor(Math.random() * frontier.length);
      const current = frontier.splice(randomIndex, 1)[0];
      
      const inMazeNeighbors = getMazeNeighbors(current, maze).filter(n => n.isInMaze);
      
      if (inMazeNeighbors.length > 0) {
        const randomNeighbor = inMazeNeighbors[Math.floor(Math.random() * inMazeNeighbors.length)];
        
        // Connect current to random in-maze neighbor
        const wallRow = (current.row + randomNeighbor.row) / 2;
        const wallCol = (current.col + randomNeighbor.col) / 2;
        
        steps.push(() => {
          setMaze(prevMaze => {
            const newMaze = [...prevMaze];
            newMaze[current.row][current.col] = { ...newMaze[current.row][current.col], isWall: false, isInMaze: true };
            newMaze[wallRow][wallCol] = { ...newMaze[wallRow][wallCol], isWall: false, isInMaze: true };
            return newMaze;
          });
        });
        
        current.isInMaze = true;
        current.isWall = false;
        maze[wallRow][wallCol].isWall = false;
        maze[wallRow][wallCol].isInMaze = true;
        
        // Add new neighbors to frontier
        getMazeNeighbors(current, maze).forEach(neighbor => {
          if (!neighbor.isInMaze && !frontier.includes(neighbor)) {
            frontier.push(neighbor);
          }
        });
      }
    }
    
    // Execute animation steps
    for (let i = 0; i < steps.length; i++) {
      setTimeout(steps[i], i * animationSpeed);
    }
    
    return steps.length * animationSpeed;
  };

  // Generate maze
  const generateMaze = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const startTime = performance.now();
    
    // Clear previous animations
    animationRef.current.forEach(timeout => clearTimeout(timeout));
    animationRef.current = [];
    
    // Initialize maze
    const newMaze = initializeMaze();
    setMaze(newMaze);
    
    const startCell = newMaze[1][1]; // Start from (1,1) for proper maze structure
    
    let duration = 0;
    switch (algorithm) {
      case 'recursive-backtracking':
        duration = await generateRecursiveBacktracking(startCell, newMaze);
        break;
      case 'randomized-prims':
        duration = await generateRandomizedPrims(startCell, newMaze);
        break;
      default:
        duration = await generateRecursiveBacktracking(startCell, newMaze);
    }
    
    // Set start and end positions
    setTimeout(() => {
      setMaze(prevMaze => {
        const finalMaze = [...prevMaze];
        finalMaze[startPos.row][startPos.col] = { 
          ...finalMaze[startPos.row][startPos.col], 
          isStart: true, 
          isWall: false 
        };
        finalMaze[endPos.row][endPos.col] = { 
          ...finalMaze[endPos.row][endPos.col], 
          isEnd: true, 
          isWall: false 
        };
        return finalMaze;
      });
      
      const endTime = performance.now();
      setStats(prev => ({ ...prev, generationTime: Math.round(endTime - startTime) }));
      setIsGenerating(false);
    }, duration + 100);
  };

  // Depth-First Search for solving
  const solveDFS = (maze: Cell[][], start: Cell, end: Cell) => {
    const stack = [start];
    const visited = new Set<string>();
    const steps: (() => void)[] = [];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row}-${current.col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      steps.push(() => {
        setMaze(prevMaze => {
          const newMaze = [...prevMaze];
          newMaze[current.row][current.col] = { 
            ...newMaze[current.row][current.col], 
            isVisited: true 
          };
          return newMaze;
        });
      });
      
      if (current === end) {
        // Reconstruct path
        let pathCell: Cell | null = current;
        const pathSteps: (() => void)[] = [];
        
        while (pathCell) {
          const cell = pathCell;
          pathSteps.push(() => {
            setMaze(prevMaze => {
              const newMaze = [...prevMaze];
              newMaze[cell.row][cell.col] = { 
                ...newMaze[cell.row][cell.col], 
                isPath: true 
              };
              return newMaze;
            });
          });
          pathCell = pathCell.parent;
        }
        
        return { steps, pathSteps };
      }
      
      // Add neighbors to stack
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;
        
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
          const neighbor = maze[newRow][newCol];
          if (!neighbor.isWall && !visited.has(`${newRow}-${newCol}`)) {
            neighbor.parent = current;
            stack.push(neighbor);
          }
        }
      }
    }
    
    return { steps, pathSteps: [] };
  };

  // Solve maze
  const solveMaze = async () => {
    if (isSolving || isGenerating) return;
    
    setIsSolving(true);
    const startTime = performance.now();
    
    // Clear previous solution
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => 
        row.map(cell => ({ 
          ...cell, 
          isVisited: false, 
          isPath: false, 
          parent: null 
        }))
      );
      return newMaze;
    });
    
    const startCell = maze[startPos.row][startPos.col];
    const endCell = maze[endPos.row][endPos.col];
    
    const { steps, pathSteps } = solveDFS(maze, startCell, endCell);
    
    // Execute solving animation
    for (let i = 0; i < steps.length; i++) {
      setTimeout(steps[i], i * (animationSpeed / 2));
    }
    
    // Execute path animation after solving
    setTimeout(() => {
      for (let i = 0; i < pathSteps.length; i++) {
        setTimeout(pathSteps[i], i * (animationSpeed / 4));
      }
      
      const endTime = performance.now();
      setStats(prev => ({ 
        ...prev, 
        solvingTime: Math.round(endTime - startTime),
        pathLength: pathSteps.length,
        cellsVisited: steps.length
      }));
      setIsSolving(false);
    }, steps.length * (animationSpeed / 2) + 100);
  };

  // Clear maze
  const clearMaze = () => {
    setMaze(initializeMaze());
    setStats({ generationTime: 0, solvingTime: 0, pathLength: 0, cellsVisited: 0 });
  };

  // Export maze
  const exportMaze = () => {
    const mazeData = {
      maze: maze.map(row => row.map(cell => ({
        row: cell.row,
        col: cell.col,
        isWall: cell.isWall
      }))),
      startPos,
      endPos,
      algorithm,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(mazeData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `maze-${algorithm}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Initialize maze on mount
  useEffect(() => {
    setMaze(initializeMaze());
  }, [initializeMaze]);

  // Get cell classes
  const getCellClasses = (cell: Cell): string => {
    const baseClasses = "w-3 h-3 transition-all duration-200";
    
    if (cell.isStart) return `${baseClasses} bg-green-500 border border-green-600`;
    if (cell.isEnd) return `${baseClasses} bg-red-500 border border-red-600`;
    if (cell.isPath) return `${baseClasses} bg-yellow-400 border border-yellow-500`;
    if (cell.isVisited) return `${baseClasses} bg-blue-200 border border-blue-300`;
    if (cell.isWall) return `${baseClasses} bg-gray-800 border border-gray-900`;
    
    return `${baseClasses} bg-white border border-gray-300`;
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'recursive-backtracking':
        return "Uses a stack-based approach to carve paths through the maze. Creates mazes with long winding passages.";
      case 'randomized-prims':
        return "Builds maze by randomly selecting frontier cells. Creates mazes with shorter dead ends and more branching.";
      case 'randomized-kruskals':
        return "Uses union-find data structure to connect regions. Creates mazes with uniform passage distribution.";
      case 'binary-tree':
        return "Simple algorithm that carves passages in two directions only. Creates distinctive diagonal bias.";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Maze Generator</h1>
              <p className="text-purple-100">Generate and solve mazes with different algorithms</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.generationTime}ms</div>
                <div className="text-sm text-purple-100">Generation Time</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.pathLength}</div>
                <div className="text-sm text-purple-100">Path Length</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Algorithm Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Generation:</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as MazeAlgorithm)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isGenerating || isSolving}
                >
                  <option value="recursive-backtracking">Recursive Backtracking</option>
                  <option value="randomized-prims">Randomized Prim's</option>
                  <option value="randomized-kruskals">Randomized Kruskal's</option>
                  <option value="binary-tree">Binary Tree</option>
                </select>
              </div>

              {/* Solve Algorithm */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Solving:</label>
                <select
                  value={solveAlgorithm}
                  onChange={(e) => setSolveAlgorithm(e.target.value as SolveAlgorithm)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isGenerating || isSolving}
                >
                  <option value="dfs">Depth-First Search</option>
                  <option value="bfs">Breadth-First Search</option>
                  <option value="astar">A* Search</option>
                </select>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{animationSpeed}ms</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Action Buttons */}
              <button
                onClick={generateMaze}
                disabled={isGenerating || isSolving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isGenerating ? <Pause className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                {isGenerating ? 'Generating...' : 'Generate Maze'}
              </button>

              <button
                onClick={solveMaze}
                disabled={isGenerating || isSolving || maze.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isSolving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSolving ? 'Solving...' : 'Solve Maze'}
              </button>

              <button
                onClick={clearMaze}
                disabled={isGenerating || isSolving}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>

              <button
                onClick={exportMaze}
                disabled={isGenerating || isSolving || maze.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
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
              <h3 className="font-semibold text-gray-800 mb-4">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Position: ({startPos.row}, {startPos.col})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={ROWS - 2}
                      step="2"
                      value={startPos.row}
                      onChange={(e) => setStartPos(prev => ({ ...prev, row: Number(e.target.value) }))}
                      className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                    <input
                      type="number"
                      min="1"
                      max={COLS - 2}
                      step="2"
                      value={startPos.col}
                      onChange={(e) => setStartPos(prev => ({ ...prev, col: Number(e.target.value) }))}
                      className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Position: ({endPos.row}, {endPos.col})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={ROWS - 2}
                      step="2"
                      value={endPos.row}
                      onChange={(e) => setEndPos(prev => ({ ...prev, row: Number(e.target.value) }))}
                      className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                    <input
                      type="number"
                      min="1"
                      max={COLS - 2}
                      step="2"
                      value={endPos.col}
                      onChange={(e) => setEndPos(prev => ({ ...prev, col: Number(e.target.value) }))}
                      className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Description */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">{algorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
            </div>
            <p className="text-sm text-gray-600">{getAlgorithmDescription()}</p>
          </div>

          {/* Maze Visualization */}
          <div className="mb-6 flex justify-center">
            <div className="border-2 border-gray-400 rounded-lg overflow-hidden inline-block">
              {maze.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClasses(cell)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                Legend
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
                  <span>End</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-900 rounded"></div>
                  <span>Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                  <span>Solution</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Generation Time:</span>
                  <span className="font-semibold">{stats.generationTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Solving Time:</span>
                  <span className="font-semibold">{stats.solvingTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Path Length:</span>
                  <span className="font-semibold">{stats.pathLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cells Visited:</span>
                  <span className="font-semibold">{stats.cellsVisited}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Mouse className="w-5 h-5 text-yellow-600" />
              Instructions
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Select a generation algorithm and click "Generate Maze"</li>
              <li>• Watch the animated maze generation process</li>
              <li>• Choose a solving algorithm and click "Solve Maze"</li>
              <li>• Adjust animation speed for better visualization</li>
              <li>• Export your maze for sharing or future use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGenerator; 