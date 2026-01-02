import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  MapPin, 
  Target, 
  Settings,
  Zap,
  Info,
  Grid,
  Mouse,
  Paintbrush
} from 'lucide-react';

interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  heuristic: number;
  fScore: number;
  previousNode: Node | null;
  isAnimated: boolean;
}

type Algorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs';
type DrawMode = 'wall' | 'start' | 'end' | 'erase';

const PathfindingVisualizer: React.FC = () => {
  const ROWS = 25;
  const COLS = 50;
  const ANIMATION_SPEED = 10; // milliseconds

  // State
  const [grid, setGrid] = useState<Node[][]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [startNode, setStartNode] = useState({ row: 12, col: 10 });
  const [endNode, setEndNode] = useState({ row: 12, col: 40 });
  const [showSettings, setShowSettings] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(10);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [mazeType, setMazeType] = useState<'random' | 'recursive' | 'none'>('none');

  // Statistics
  const [stats, setStats] = useState({
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    isPathFound: false
  });

  const animationRef = useRef<NodeJS.Timeout[]>([]);

  // Initialize grid
  const createNode = (row: number, col: number): Node => ({
    row,
    col,
    isStart: row === startNode.row && col === startNode.col,
    isEnd: row === endNode.row && col === endNode.col,
    isWall: false,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    heuristic: 0,
    fScore: Infinity,
    previousNode: null,
    isAnimated: false
  });

  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, [startNode, endNode]);

  // Get neighbors
  const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;
    
    // Cardinal directions
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

    // Diagonal directions (if allowed)
    if (allowDiagonal) {
      if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
      if (row > 0 && col < COLS - 1) neighbors.push(grid[row - 1][col + 1]);
      if (row < ROWS - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);
      if (row < ROWS - 1 && col < COLS - 1) neighbors.push(grid[row + 1][col + 1]);
    }

    return neighbors.filter(neighbor => !neighbor.isWall);
  };

  // Heuristic function (Manhattan distance)
  const manhattanDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  // Euclidean distance for diagonal movement
  const euclideanDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.sqrt(Math.pow(nodeA.row - nodeB.row, 2) + Math.pow(nodeA.col - nodeB.col, 2));
  };

  // Dijkstra's Algorithm
  const dijkstra = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodes: Node[] = [];
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;

    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift()!;
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return { visitedNodes, pathNodes: [] };
      
      closestNode.isVisited = true;
      visitedNodes.push(closestNode);
      
      if (closestNode === endNode) {
        return { visitedNodes, pathNodes: getNodesInShortestPathOrder(endNode) };
      }
      
      updateUnvisitedNeighbors(closestNode, grid);
    }
    
    return { visitedNodes, pathNodes: [] };
  };

  // A* Algorithm
  const aStar = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodes: Node[] = [];
    const openSet = [startNode];
    const closedSet: Node[] = [];
    
    startNode.distance = 0;
    startNode.heuristic = allowDiagonal 
      ? euclideanDistance(startNode, endNode) 
      : manhattanDistance(startNode, endNode);
    startNode.fScore = startNode.heuristic;

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fScore < current.fScore) {
          current = openSet[i];
        }
      }

      if (current === endNode) {
        return { visitedNodes, pathNodes: getNodesInShortestPathOrder(endNode) };
      }

      // Move current from openSet to closedSet
      openSet.splice(openSet.indexOf(current), 1);
      closedSet.push(current);
      current.isVisited = true;
      visitedNodes.push(current);

      const neighbors = getNeighbors(current, grid);
      
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) continue;
        
        const tentativeGScore = current.distance + (allowDiagonal ? euclideanDistance(current, neighbor) : 1);
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= neighbor.distance) {
          continue;
        }
        
        neighbor.previousNode = current;
        neighbor.distance = tentativeGScore;
        neighbor.heuristic = allowDiagonal 
          ? euclideanDistance(neighbor, endNode) 
          : manhattanDistance(neighbor, endNode);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;
      }
    }
    
    return { visitedNodes, pathNodes: [] };
  };

  // BFS Algorithm
  const bfs = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodes: Node[] = [];
    const queue = [startNode];
    startNode.isVisited = true;
    visitedNodes.push(startNode);

    while (queue.length) {
      const currentNode = queue.shift()!;
      
      if (currentNode === endNode) {
        return { visitedNodes, pathNodes: getNodesInShortestPathOrder(endNode) };
      }
      
      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.previousNode = currentNode;
          visitedNodes.push(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return { visitedNodes, pathNodes: [] };
  };

  // DFS Algorithm
  const dfs = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodes: Node[] = [];
    const stack = [startNode];

    while (stack.length) {
      const currentNode = stack.pop()!;
      
      if (currentNode.isVisited) continue;
      
      currentNode.isVisited = true;
      visitedNodes.push(currentNode);
      
      if (currentNode === endNode) {
        return { visitedNodes, pathNodes: getNodesInShortestPathOrder(endNode) };
      }
      
      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }
    }
    
    return { visitedNodes, pathNodes: [] };
  };

  // Helper functions
  const getAllNodes = (grid: Node[][]): Node[] => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const sortNodesByDistance = (unvisitedNodes: Node[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const unvisitedNeighbors = getNeighbors(node, grid).filter(neighbor => !neighbor.isVisited);
    for (const neighbor of unvisitedNeighbors) {
      const distance = allowDiagonal ? euclideanDistance(node, neighbor) : 1;
      neighbor.distance = node.distance + distance;
      neighbor.previousNode = node;
    }
  };

  const getNodesInShortestPathOrder = (finishNode: Node): Node[] => {
    const nodesInShortestPathOrder = [];
    let currentNode: Node | null = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  };

  // Visualize algorithm
  const visualizeAlgorithm = async () => {
    if (isRunning) return;
    
    clearPath();
    setIsRunning(true);
    setIsAnimating(true);
    
    const startTime = performance.now();
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    
    let result;
    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(grid, startNodeObj, endNodeObj);
        break;
      case 'astar':
        result = aStar(grid, startNodeObj, endNodeObj);
        break;
      case 'bfs':
        result = bfs(grid, startNodeObj, endNodeObj);
        break;
      case 'dfs':
        result = dfs(grid, startNodeObj, endNodeObj);
        break;
    }
    
    const { visitedNodes, pathNodes } = result;
    const endTime = performance.now();
    
    // Animate visited nodes
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        setGrid(prevGrid => {
          const newGrid = [...prevGrid];
          const node = visitedNodes[i];
          newGrid[node.row][node.col] = { ...node, isAnimated: true };
          return newGrid;
        });
      }, animationSpeed * i);
    }
    
    // Animate path
    setTimeout(() => {
      for (let i = 0; i < pathNodes.length; i++) {
        setTimeout(() => {
          setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const node = pathNodes[i];
            newGrid[node.row][node.col] = { ...node, isPath: true };
            return newGrid;
          });
        }, 50 * i);
      }
      
      setStats({
        nodesVisited: visitedNodes.length,
        pathLength: pathNodes.length,
        executionTime: Math.round(endTime - startTime),
        isPathFound: pathNodes.length > 0
      });
      
      setIsAnimating(false);
      setIsRunning(false);
    }, animationSpeed * visitedNodes.length);
  };

  // Clear functions
  const clearPath = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          isAnimated: false,
          distance: Infinity,
          fScore: Infinity,
          heuristic: 0,
          previousNode: null
        }))
      );
      return newGrid;
    });
    setStats({ nodesVisited: 0, pathLength: 0, executionTime: 0, isPathFound: false });
  };

  const clearWalls = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row =>
        row.map(node => ({ ...node, isWall: false }))
      );
      return newGrid;
    });
  };

  const clearAll = () => {
    setGrid(initializeGrid());
    setStats({ nodesVisited: 0, pathLength: 0, executionTime: 0, isPathFound: false });
  };

  // Generate random walls
  const generateRandomMaze = () => {
    clearAll();
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (Math.random() < 0.3 && 
              !(row === startNode.row && col === startNode.col) && 
              !(row === endNode.row && col === endNode.col)) {
            newGrid[row][col] = { ...newGrid[row][col], isWall: true };
          }
        }
      }
      return newGrid;
    });
  };

  // Mouse handlers
  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    setIsMousePressed(true);
    handleGridInteraction(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isRunning) return;
    handleGridInteraction(row, col);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const handleGridInteraction = (row: number, col: number) => {
    const node = grid[row][col];
    
    if (drawMode === 'start' && !node.isEnd) {
      setStartNode({ row, col });
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        // Clear previous start node
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            newGrid[r][c] = { ...newGrid[r][c], isStart: false };
          }
        }
        newGrid[row][col] = { ...newGrid[row][col], isStart: true, isWall: false };
        return newGrid;
      });
    } else if (drawMode === 'end' && !node.isStart) {
      setEndNode({ row, col });
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        // Clear previous end node
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            newGrid[r][c] = { ...newGrid[r][c], isEnd: false };
          }
        }
        newGrid[row][col] = { ...newGrid[row][col], isEnd: true, isWall: false };
        return newGrid;
      });
    } else if (drawMode === 'wall' && !node.isStart && !node.isEnd) {
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = { ...newGrid[row][col], isWall: true };
        return newGrid;
      });
    } else if (drawMode === 'erase') {
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = { ...newGrid[row][col], isWall: false };
        return newGrid;
      });
    }
  };

  // Initialize grid on mount
  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  // Get node classes
  const getNodeClasses = (node: Node): string => {
    const baseClasses = "w-4 h-4 border border-gray-300 cursor-pointer transition-all duration-200";
    
    if (node.isStart) return `${baseClasses} bg-green-500 border-green-600`;
    if (node.isEnd) return `${baseClasses} bg-red-500 border-red-600`;
    if (node.isPath) return `${baseClasses} bg-yellow-400 border-yellow-500 animate-pulse`;
    if (node.isAnimated && node.isVisited) return `${baseClasses} bg-blue-400 border-blue-500 animate-pulse`;
    if (node.isVisited) return `${baseClasses} bg-blue-200 border-blue-300`;
    if (node.isWall) return `${baseClasses} bg-gray-800 border-gray-900`;
    
    return `${baseClasses} bg-white hover:bg-gray-100`;
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'dijkstra':
        return "Guarantees shortest path. Explores all directions equally.";
      case 'astar':
        return "Guarantees shortest path. Uses heuristics to guide search.";
      case 'bfs':
        return "Guarantees shortest path. Explores level by level.";
      case 'dfs':
        return "Does not guarantee shortest path. Explores as far as possible.";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pathfinding Visualizer</h1>
              <p className="text-blue-100">Visualize how pathfinding algorithms work</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.nodesVisited}</div>
                <div className="text-sm text-blue-100">Nodes Visited</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.pathLength}</div>
                <div className="text-sm text-blue-100">Path Length</div>
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
                <label className="text-sm font-medium text-gray-700">Algorithm:</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isRunning}
                >
                  <option value="astar">A* Search</option>
                  <option value="dijkstra">Dijkstra's</option>
                  <option value="bfs">Breadth-First Search</option>
                  <option value="dfs">Depth-First Search</option>
                </select>
              </div>

              {/* Draw Mode */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Draw:</label>
                <div className="flex gap-1">
                  {[
                    { mode: 'wall' as DrawMode, icon: <Grid className="w-4 h-4" />, label: 'Wall' },
                    { mode: 'start' as DrawMode, icon: <MapPin className="w-4 h-4" />, label: 'Start' },
                    { mode: 'end' as DrawMode, icon: <Target className="w-4 h-4" />, label: 'End' },
                    { mode: 'erase' as DrawMode, icon: <Trash2 className="w-4 h-4" />, label: 'Erase' }
                  ].map(({ mode, icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setDrawMode(mode)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        drawMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={isRunning}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Action Buttons */}
              <button
                onClick={visualizeAlgorithm}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? 'Running...' : 'Visualize'}
              </button>

              <button
                onClick={clearPath}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Path
              </button>

              <button
                onClick={clearWalls}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Walls
              </button>

              <button
                onClick={generateRandomMaze}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Zap className="w-4 h-4" />
                Random Maze
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animation Speed: {animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="diagonal"
                    checked={allowDiagonal}
                    onChange={(e) => setAllowDiagonal(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="diagonal" className="text-sm font-medium text-gray-700">
                    Allow Diagonal Movement
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Description */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">{algorithm.toUpperCase()} Algorithm</h3>
            </div>
            <p className="text-sm text-gray-600">{getAlgorithmDescription()}</p>
          </div>

          {/* Grid */}
          <div className="mb-6">
            <div 
              className="inline-block border-2 border-gray-400 rounded-lg overflow-hidden"
              onMouseLeave={handleMouseUp}
            >
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((node, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getNodeClasses(node)}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
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
              <h3 className="font-semibold text-gray-800 mb-4">Legend</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
                  <span>Start Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
                  <span>End Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-900 rounded"></div>
                  <span>Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                  <span>Shortest Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Unvisited</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nodes Visited:</span>
                  <span className="font-semibold">{stats.nodesVisited}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Path Length:</span>
                  <span className="font-semibold">{stats.pathLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Execution Time:</span>
                  <span className="font-semibold">{stats.executionTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Path Found:</span>
                  <span className={`font-semibold ${stats.isPathFound ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.isPathFound ? 'Yes' : 'No'}
                  </span>
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
              <li>• Select an algorithm and drawing mode</li>
              <li>• Click and drag to draw walls, or change start/end positions</li>
              <li>• Generate a random maze for testing</li>
              <li>• Click "Visualize" to see the algorithm in action</li>
              <li>• Yellow path shows the shortest route found</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer; 