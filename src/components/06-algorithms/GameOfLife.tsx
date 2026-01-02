import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Download, Upload, Zap, Settings, Info } from 'lucide-react';

// Grid dimensions
const GRID_WIDTH = 50;
const GRID_HEIGHT = 30;
const CELL_SIZE = 12;

// Predefined patterns
const PATTERNS = {
  glider: {
    name: "Glider",
    pattern: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ],
    description: "A small pattern that travels diagonally"
  },
  blinker: {
    name: "Blinker",
    pattern: [
      [1, 1, 1]
    ],
    description: "Oscillates between horizontal and vertical"
  },
  toad: {
    name: "Toad",
    pattern: [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ],
    description: "Period-2 oscillator"
  },
  beacon: {
    name: "Beacon",
    pattern: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ],
    description: "Period-2 oscillator"
  },
  pulsar: {
    name: "Pulsar",
    pattern: [
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
    ],
    description: "Period-3 oscillator"
  },
  gliderGun: {
    name: "Gosper Glider Gun",
    pattern: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    description: "Produces gliders indefinitely"
  }
};

interface GameStats {
  generation: number;
  population: number;
  totalGenerations: number;
  maxPopulation: number;
}

const GameOfLife: React.FC = () => {
  // Grid state
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false))
  );
  
  // Game state
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200); // ms between generations
  const [drawMode, setDrawMode] = useState<'draw' | 'erase'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Pattern placement
  const [selectedPatternKey, setSelectedPatternKey] = useState<keyof typeof PATTERNS | null>(null);
  const [showPatterns, setShowPatterns] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState<GameStats>({
    generation: 0,
    population: 0,
    totalGenerations: 0,
    maxPopulation: 0
  });
  
  // Refs
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate population
  const calculatePopulation = useCallback((currentGrid: boolean[][]) => {
    return currentGrid.flat().filter(cell => cell).length;
  }, []);

  // Update statistics
  useEffect(() => {
    const population = calculatePopulation(grid);
    setStats(prev => ({
      ...prev,
      population,
      maxPopulation: Math.max(prev.maxPopulation, population)
    }));
  }, [grid, calculatePopulation]);

  // Count living neighbors
  const countNeighbors = useCallback((grid: boolean[][], x: number, y: number): number => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          if (grid[newY][newX]) count++;
        }
      }
    }
    return count;
  }, []);

  // Apply Conway's rules
  const nextGeneration = useCallback((currentGrid: boolean[][]): boolean[][] => {
    const newGrid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false));
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const neighbors = countNeighbors(currentGrid, x, y);
        const isAlive = currentGrid[y][x];
        
        // Conway's Game of Life rules:
        // 1. Any live cell with fewer than two live neighbors dies (underpopulation)
        // 2. Any live cell with two or three live neighbors lives on to the next generation
        // 3. Any live cell with more than three live neighbors dies (overpopulation)
        // 4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
        
        if (isAlive) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3;
        } else {
          newGrid[y][x] = neighbors === 3;
        }
      }
    }
    
    return newGrid;
  }, [countNeighbors]);

  // Game loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = setInterval(() => {
        setGrid(currentGrid => {
          const newGrid = nextGeneration(currentGrid);
          return newGrid;
        });
        setStats(prev => ({
          ...prev,
          generation: prev.generation + 1,
          totalGenerations: prev.totalGenerations + 1
        }));
      }, speed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isRunning, speed, nextGeneration]);

  // Toggle cell state
  const toggleCell = (x: number, y: number) => {
    if (selectedPatternKey) {
      placePattern(selectedPatternKey, x, y);
      setSelectedPatternKey(null);
    } else {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        newGrid[y][x] = drawMode === 'draw' ? true : false;
        return newGrid;
      });
    }
  };

  // Handle mouse events for drawing
  const handleMouseDown = (x: number, y: number) => {
    if (!selectedPatternKey) {
      setIsDrawing(true);
      toggleCell(x, y);
    } else {
      toggleCell(x, y);
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDrawing && !selectedPatternKey) {
      toggleCell(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Place predefined pattern
  const placePattern = (patternKey: keyof typeof PATTERNS, startX: number, startY: number) => {
    const pattern = PATTERNS[patternKey].pattern;
    
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          const newX = startX + x;
          const newY = startY + y;
          
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            if (pattern[y][x] === 1) {
              newGrid[newY][newX] = true;
            }
          }
        }
      }
      
      return newGrid;
    });
  };

  // Game controls
  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const step = () => {
    if (!isRunning) {
      setGrid(nextGeneration);
      setStats(prev => ({
        ...prev,
        generation: prev.generation + 1,
        totalGenerations: prev.totalGenerations + 1
      }));
    }
  };

  const clear = () => {
    setIsRunning(false);
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false)));
    setStats(prev => ({
      ...prev,
      generation: 0,
      population: 0
    }));
  };

  const randomize = () => {
    setGrid(prev => 
      prev.map(row => 
        row.map(() => Math.random() > 0.7)
      )
    );
  };

  // Export/Import functions
  const exportPattern = () => {
    const data = JSON.stringify({
      grid,
      generation: stats.generation,
      timestamp: new Date().toISOString()
    });
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-of-life-pattern-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importPattern = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.grid && Array.isArray(data.grid)) {
          setGrid(data.grid);
          setIsRunning(false);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-green-400">Conway's Game of Life</h1>
          <p className="text-gray-300">Cellular automaton zero-player game</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Grid */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 p-4 rounded-lg">
              {/* Game Board */}
              <div 
                ref={gridRef}
                className="grid gap-px bg-gray-700 p-2 rounded mx-auto w-fit select-none"
                style={{
                  gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
                  gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`
                }}
                onMouseLeave={handleMouseUp}
              >
                {grid.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className={`cursor-pointer transition-colors duration-75 ${
                        showGrid ? 'border border-gray-600' : ''
                      } ${
                        cell ? 'bg-green-400' : 'bg-gray-800 hover:bg-gray-700'
                      } ${selectedPatternKey ? 'hover:bg-blue-500' : ''}`}
                      style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      onMouseDown={() => handleMouseDown(x, y)}
                      onMouseEnter={() => handleMouseEnter(x, y)}
                      onMouseUp={handleMouseUp}
                    />
                  ))
                )}
              </div>
              
              {/* Controls */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={startStop}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={step}
                  disabled={isRunning}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Step
                </button>
                
                <button
                  onClick={clear}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Clear
                </button>
                
                <button
                  onClick={randomize}
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Random
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Statistics */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Generation:</span>
                  <span className="font-bold text-yellow-400">{stats.generation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Population:</span>
                  <span className="font-bold text-green-400">{stats.population}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Population:</span>
                  <span className="font-bold text-blue-400">{stats.maxPopulation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Generations:</span>
                  <span className="font-bold text-purple-400">{stats.totalGenerations}</span>
                </div>
              </div>
            </div>

            {/* Speed Control */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Speed Control</h3>
              <div className="space-y-2">
                <label className="block text-sm">
                  Speed: {(1000 / speed).toFixed(1)} gen/sec
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Fast</span>
                  <span>Slow</span>
                </div>
              </div>
            </div>

            {/* Drawing Controls */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Drawing</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDrawMode('draw')}
                    className={`p-2 rounded text-sm ${
                      drawMode === 'draw' ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Draw
                  </button>
                  <button
                    onClick={() => setDrawMode('erase')}
                    className={`p-2 rounded text-sm ${
                      drawMode === 'erase' ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Erase
                  </button>
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  <span className="text-sm">Show Grid</span>
                </label>
              </div>
            </div>

            {/* Patterns */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Patterns</h3>
              <div className="space-y-2">
                {Object.entries(PATTERNS).map(([key, pattern]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPatternKey(selectedPatternKey === key ? null : key as keyof typeof PATTERNS)}
                    className={`w-full p-2 rounded text-left text-sm ${
                      selectedPatternKey === key ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{pattern.name}</div>
                    <div className="text-xs text-gray-300">{pattern.description}</div>
                  </button>
                ))}
                
                {selectedPatternKey && (
                  <div className="text-xs text-blue-400 bg-blue-900 p-2 rounded">
                    Click on the grid to place {PATTERNS[selectedPatternKey].name}
                  </div>
                )}
              </div>
            </div>

            {/* Import/Export */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Save/Load</h3>
              <div className="space-y-2">
                <button
                  onClick={exportPattern}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Pattern
                </button>
                
                <label className="w-full bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import Pattern
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPattern}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Rules
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>1. Any live cell with 2-3 neighbors survives</p>
                <p>2. Any dead cell with 3 neighbors becomes alive</p>
                <p>3. All other live cells die</p>
                <p>4. All other dead cells stay dead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOfLife; 