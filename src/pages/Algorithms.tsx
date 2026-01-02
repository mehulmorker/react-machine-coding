import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Gamepad2,
  Route,
  BarChart3,
  Play,
  Grid3X3,
  Crown,
  GitBranch,
  Network,
  Zap,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';

interface ComponentInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
  features: string[];
}

const Algorithms: React.FC = () => {
  const components: ComponentInfo[] = [
    {
      title: 'Snake Game',
      description: 'Classic snake game with collision detection and score tracking',
      icon: <Gamepad2 className="w-6 h-6" />,
      path: '/snake-game',
      difficulty: 'Medium',
      concepts: ['Game Loop', 'Collision Detection', 'State Management', 'Canvas Rendering'],
      features: ['Arrow key controls', 'Food generation', 'Score tracking', 'Game over detection', 'Speed increase']
    },
    {
      title: 'Tetris Game',
      description: 'Complete Tetris implementation with line clearing and piece rotation',
      icon: <Grid3X3 className="w-6 h-6" />,
      path: '/tetris',
      difficulty: 'Hard',
      concepts: ['Matrix Operations', 'Rotation Algorithms', 'Line Detection', 'Real-time Updates'],
      features: ['Piece rotation', 'Line clearing', 'Level progression', 'Next piece preview', 'Hold piece']
    },
    {
      title: 'Pathfinding Visualizer',
      description: 'Visual representation of pathfinding algorithms like A* and Dijkstra',
      icon: <Route className="w-6 h-6" />,
      path: '/pathfinding',
      difficulty: 'Hard',
      concepts: ['Graph Algorithms', 'A* Algorithm', 'Dijkstra', 'Heuristics'],
      features: ['Multiple algorithms', 'Wall drawing', 'Animated visualization', 'Path reconstruction', 'Speed controls']
    },
    {
      title: 'Sorting Visualizer',
      description: 'Animated visualization of various sorting algorithms',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/sorting-visualizer',
      difficulty: 'Medium',
      concepts: ['Sorting Algorithms', 'Animation', 'Complexity Analysis', 'Comparison Counting'],
      features: ['Multiple algorithms', 'Speed controls', 'Array size adjustment', 'Comparison counter', 'Time complexity display']
    },
    {
      title: "Conway's Game of Life",
      description: 'Cellular automaton simulation with pattern generation',
      icon: <Play className="w-6 h-6" />,
      path: '/game-of-life',
      difficulty: 'Medium',
      concepts: ['Cellular Automata', 'Grid Simulation', 'Pattern Recognition', 'Optimization'],
      features: ['Play/pause controls', 'Cell toggling', 'Pattern presets', 'Generation counter', 'Speed adjustment']
    },
    {
      title: 'Maze Generator',
      description: 'Procedural maze generation with multiple algorithms',
      icon: <Grid3X3 className="w-6 h-6" />,
      path: '/maze-generator',
      difficulty: 'Hard',
      concepts: ['Maze Generation', 'DFS', 'Recursive Backtracking', 'Graph Traversal'],
      features: ['Multiple algorithms', 'Animated generation', 'Maze solving', 'Export functionality', 'Size controls']
    },
    {
      title: 'N-Queens Visualizer',
      description: 'Visual solution to the N-Queens problem with backtracking',
      icon: <Crown className="w-6 h-6" />,
      path: '/n-queens',
      difficulty: 'Hard',
      concepts: ['Backtracking', 'Constraint Satisfaction', 'Recursion', 'Optimization'],
      features: ['Animated solving', 'Multiple solutions', 'Board size adjustment', 'Solution counter', 'Step-by-step mode']
    },
    {
      title: 'Binary Tree Visualizer',
      description: 'Interactive binary tree operations with visual feedback',
      icon: <GitBranch className="w-6 h-6" />,
      path: '/binary-tree',
      difficulty: 'Hard',
      concepts: ['Tree Algorithms', 'BST Operations', 'Tree Traversal', 'Balancing'],
      features: ['Insert/delete nodes', 'Tree traversals', 'Balance visualization', 'Search operations', 'Animation controls']
    },
    {
      title: 'Graph Visualizer',
      description: 'Interactive graph algorithms with edge and vertex manipulation',
      icon: <Network className="w-6 h-6" />,
      path: '/graph-visualizer',
      difficulty: 'Hard',
      concepts: ['Graph Algorithms', 'DFS/BFS', 'Shortest Path', 'Minimum Spanning Tree'],
      features: ['Add/remove vertices', 'Edge manipulation', 'Algorithm visualization', 'Weighted graphs', 'Multiple layouts']
    },
    {
      title: 'Fractal Generator',
      description: 'Mathematical fractal generation with zoom and customization',
      icon: <Zap className="w-6 h-6" />,
      path: '/fractals',
      difficulty: 'Hard',
      concepts: ['Fractal Mathematics', 'Complex Numbers', 'Iteration', 'Canvas Optimization'],
      features: ['Multiple fractals', 'Zoom controls', 'Color customization', 'Parameter adjustment', 'High resolution export']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = 10; // All algorithm components are implemented: SnakeGame, TetrisGame, PathfindingVisualizer, SortingVisualizer, GameOfLife, MazeGenerator, NQueensVisualizer, BinaryTreeVisualizer, GraphVisualizer, FractalGenerator
  const totalCount = components.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Calculator className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algorithm + UI Challenges
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Interactive visualizations of algorithms and data structures with 
            engaging UI components and real-time animations.
          </p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((completedCount / totalCount) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Concepts Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Calculator className="w-5 h-5" />, title: 'Algorithms', desc: 'Core algorithm patterns' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Visualization', desc: 'Interactive animations' },
              { icon: <Gamepad2 className="w-5 h-5" />, title: 'Games', desc: 'Game development' },
              { icon: <Network className="w-5 h-5" />, title: 'Data Structures', desc: 'Complex structures' }
            ].map((concept, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-indigo-600">{concept.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{concept.title}</h3>
                <p className="text-sm text-gray-600">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((component, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <div className="text-indigo-600">{component.icon}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(component.difficulty)}`}>
                    {component.difficulty}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {component.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {component.description}
                </p>

                {/* Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Concepts:</h4>
                  <div className="flex flex-wrap gap-1">
                    {component.concepts.map((concept, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {component.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                    {component.features.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{component.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <Link
                  to={component.path}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                >
                  Explore Component
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{totalCount}</div>
            <div className="text-gray-600">Total Components</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{completedCount}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {components.reduce((acc, comp) => acc + comp.features.length, 0)}
            </div>
            <div className="text-gray-600">Total Features</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algorithms; 