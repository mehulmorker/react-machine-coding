import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus,
  Minus,
  Settings, 
  GitBranch,
  Search,
  Target,
  Info,
  ArrowDown,
  ArrowRight,
  ArrowUp
} from 'lucide-react';

interface TreeNode {
  value: number;
  id: string;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  isHighlighted: boolean;
  isVisited: boolean;
  isActive: boolean;
}

interface TreeOperation {
  type: 'insert' | 'delete' | 'search' | 'traverse';
  value?: number;
  traversalType?: 'inorder' | 'preorder' | 'postorder' | 'levelorder';
  description: string;
}

type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

const BinaryTreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [showSettings, setShowSettings] = useState(false);
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [stats, setStats] = useState({
    nodeCount: 0,
    treeHeight: 0,
    lastOperation: '',
    traversalTime: 0
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const nodeIdCounter = useRef(0);

  // Create a new tree node
  const createNode = (value: number): TreeNode => {
    nodeIdCounter.current++;
    return {
      value,
      id: `node-${nodeIdCounter.current}`,
      left: null,
      right: null,
      x: 0,
      y: 0,
      isHighlighted: false,
      isVisited: false,
      isActive: false
    };
  };

  // Insert value into BST
  const insertNode = useCallback((root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return createNode(value);
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }

    return root;
  }, []);

  // Find minimum value node
  const findMinNode = (node: TreeNode): TreeNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Delete node from BST
  const deleteNode = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root) return null;

    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node to be deleted found
      if (!root.left) return root.right;
      if (!root.right) return root.left;

      // Node with two children
      const minNode = findMinNode(root.right);
      root.value = minNode.value;
      root.right = deleteNode(root.right, minNode.value);
    }

    return root;
  }, []);

  // Search for a value in the tree
  const searchTree = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root || root.value === value) {
      return root;
    }

    if (value < root.value) {
      return searchTree(root.left, value);
    }

    return searchTree(root.right, value);
  }, []);

  // Calculate tree height
  const calculateHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
  };

  // Count nodes in tree
  const countNodes = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  // Calculate positions for tree nodes
  const calculatePositions = useCallback((
    node: TreeNode | null, 
    x: number, 
    y: number, 
    horizontalSpacing: number
  ): void => {
    if (!node) return;

    node.x = x;
    node.y = y;

    const spacing = horizontalSpacing / 2;
    
    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, spacing);
    }
    
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, spacing);
    }
  }, []);

  // Tree traversal algorithms
  const inorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      inorderTraversal(node.left, result);
      result.push(node.value);
      inorderTraversal(node.right, result);
    }
    return result;
  };

  const preorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      result.push(node.value);
      preorderTraversal(node.left, result);
      preorderTraversal(node.right, result);
    }
    return result;
  };

  const postorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      postorderTraversal(node.left, result);
      postorderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const levelorderTraversal = (root: TreeNode | null): number[] => {
    if (!root) return [];
    
    const result: number[] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  };

  // Animate traversal
  const animateTraversal = async (type: TraversalType) => {
    if (!root || isAnimating) return;

    setIsAnimating(true);
    setCurrentStep(0);
    const startTime = Date.now();

    // Reset all node states
    const resetNodeStates = (node: TreeNode | null): void => {
      if (node) {
        node.isHighlighted = false;
        node.isVisited = false;
        node.isActive = false;
        resetNodeStates(node.left);
        resetNodeStates(node.right);
      }
    };

    resetNodeStates(root);

    let traversalOrder: number[] = [];
    
    switch (type) {
      case 'inorder':
        traversalOrder = inorderTraversal(root);
        break;
      case 'preorder':
        traversalOrder = preorderTraversal(root);
        break;
      case 'postorder':
        traversalOrder = postorderTraversal(root);
        break;
      case 'levelorder':
        traversalOrder = levelorderTraversal(root);
        break;
    }

    setTraversalResult(traversalOrder);

    // Animate each step
    for (let i = 0; i < traversalOrder.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          setRoot(prevRoot => {
            const newRoot = JSON.parse(JSON.stringify(prevRoot));
            const findAndHighlight = (node: TreeNode | null, value: number): void => {
              if (node) {
                if (node.value === value) {
                  node.isActive = true;
                  node.isVisited = true;
                }
                findAndHighlight(node.left, value);
                findAndHighlight(node.right, value);
              }
            };
            findAndHighlight(newRoot, traversalOrder[i]);
            return newRoot;
          });
          setCurrentStep(i + 1);
          resolve(void 0);
        }, animationSpeed);
      });
    }

    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      lastOperation: `${type} traversal`,
      traversalTime: endTime - startTime
    }));

    setIsAnimating(false);
  };

  // Insert value
  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || isAnimating) return;

    setRoot(prevRoot => {
      const newRoot = insertNode(prevRoot, value);
      return newRoot;
    });
    
    setInputValue('');
    setStats(prev => ({
      ...prev,
      lastOperation: `Insert ${value}`,
      nodeCount: countNodes(root) + 1,
      treeHeight: calculateHeight(root)
    }));
  };

  // Delete value
  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || isAnimating) return;

    setRoot(prevRoot => {
      const newRoot = deleteNode(prevRoot, value);
      return newRoot;
    });
    
    setInputValue('');
    setStats(prev => ({
      ...prev,
      lastOperation: `Delete ${value}`,
      nodeCount: Math.max(0, countNodes(root) - 1),
      treeHeight: calculateHeight(root)
    }));
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchValue || !root || isAnimating) return;

    setIsAnimating(true);
    const value = parseInt(searchValue);

    const resetHighlights = (node: TreeNode | null): void => {
      if (!node) return;
      node.isHighlighted = false;
      node.isActive = false;
      node.isVisited = false;
      resetHighlights(node.left);
      resetHighlights(node.right);
    };

    resetHighlights(root);

    let current: TreeNode | null = root;

    while (current) {
      current.isHighlighted = true;
      setRoot({ ...root });
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));

      if (current.value === value) {
        current.isActive = true;
        setStats(prev => ({ ...prev, lastOperation: `Found ${value}` }));
        break;
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (!current) {
      setStats(prev => ({ ...prev, lastOperation: `${value} not found` }));
    }

    setSearchValue('');
    setIsAnimating(false);
  };

  // Generate random tree
  const generateRandomTree = () => {
    if (isAnimating) return;

    setRoot(null);
    const values = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    const uniqueValues = Array.from(new Set(values)).slice(0, 8);
    
    let newRoot: TreeNode | null = null;
    uniqueValues.forEach(value => {
      newRoot = insertNode(newRoot, value);
    });
    
    setRoot(newRoot);
    setStats(prev => ({
      ...prev,
      lastOperation: 'Generated random tree',
      nodeCount: countNodes(newRoot),
      treeHeight: calculateHeight(newRoot)
    }));
  };

  // Clear tree
  const clearTree = () => {
    if (isAnimating) return;
    
    setRoot(null);
    setTraversalResult([]);
    setCurrentStep(0);
    setStats({
      nodeCount: 0,
      treeHeight: 0,
      lastOperation: 'Tree cleared',
      traversalTime: 0
    });
  };

  // Update positions when tree changes
  useEffect(() => {
    if (root) {
      calculatePositions(root, 400, 80, 200);
      setStats(prev => ({
        ...prev,
        nodeCount: countNodes(root),
        treeHeight: calculateHeight(root)
      }));
    }
  }, [root, calculatePositions]);

  // Render tree edges
  const renderEdges = (node: TreeNode | null): React.ReactElement[] => {
    if (!node) return [];

    const edges: React.ReactElement[] = [];

    if (node.left) {
      edges.push(
        <line
          key={`edge-${node.id}-left`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="#374151"
          strokeWidth="2"
        />
      );
      edges.push(...renderEdges(node.left));
    }

    if (node.right) {
      edges.push(
        <line
          key={`edge-${node.id}-right`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="#374151"
          strokeWidth="2"
        />
      );
      edges.push(...renderEdges(node.right));
    }

    return edges;
  };

  // Render tree nodes
  const renderNodes = (node: TreeNode | null): React.ReactElement[] => {
    if (!node) return [];

    const nodes: React.ReactElement[] = [];

    // Add current node
    nodes.push(
      <g key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={node.isActive ? "#10B981" : node.isHighlighted ? "#F59E0B" : node.isVisited ? "#8B5CF6" : "#3B82F6"}
          stroke="#1F2937"
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );

    // Add child nodes
    if (node.left) {
      nodes.push(...renderNodes(node.left));
    }
    if (node.right) {
      nodes.push(...renderNodes(node.right));
    }

    return nodes;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Binary Tree Visualizer</h1>
              <p className="text-green-100">Visualize binary search tree operations and traversals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.nodeCount}</div>
                <div className="text-sm text-green-100">Nodes</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.treeHeight}</div>
                <div className="text-sm text-green-100">Height</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Insert/Delete Controls */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32"
                  disabled={isAnimating}
                />
                <button
                  onClick={handleInsert}
                  disabled={isAnimating || !inputValue}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Insert
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isAnimating || !inputValue || !root}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Search Controls */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search value"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32"
                  disabled={isAnimating}
                />
                <button
                  onClick={handleSearch}
                  disabled={isAnimating || !searchValue || !root}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {/* Traversal Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={traversalType}
                  onChange={(e) => setTraversalType(e.target.value as TraversalType)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isAnimating}
                >
                  <option value="inorder">In-order</option>
                  <option value="preorder">Pre-order</option>
                  <option value="postorder">Post-order</option>
                  <option value="levelorder">Level-order</option>
                </select>
                <button
                  onClick={() => animateTraversal(traversalType)}
                  disabled={isAnimating || !root}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Traverse
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Animation Speed */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-20"
                  disabled={isAnimating}
                />
                <span className="text-sm text-gray-600">{animationSpeed}ms</span>
              </div>

              {/* Tree Operations */}
              <button
                onClick={generateRandomTree}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Random Tree
              </button>

              <button
                onClick={clearTree}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Info
              </button>
            </div>
          </div>

          {/* Settings/Info Panel */}
          {showSettings && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Binary Search Tree Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Structure Rules</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Left child ≤ Parent node</li>
                    <li>• Right child &gt; Parent node</li>
                    <li>• No duplicate values allowed</li>
                    <li>• Recursive structure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Traversal Types</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• In-order: Left → Root → Right</li>
                    <li>• Pre-order: Root → Left → Right</li>
                    <li>• Post-order: Left → Right → Root</li>
                    <li>• Level-order: Breadth-first search</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tree Visualization */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <svg width="800" height="400" className="mx-auto">
              {root && (
                <>
                  {renderEdges(root)}
                  {renderNodes(root)}
                </>
              )}
              {!root && (
                <text x="400" y="200" textAnchor="middle" fill="#9CA3AF" fontSize="18">
                  Tree is empty. Insert some values to get started!
                </text>
              )}
            </svg>
          </div>

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal Result
              </h3>
              <div className="flex flex-wrap gap-2">
                {traversalResult.map((value, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-purple-300 text-purple-600'
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Step {currentStep} of {traversalResult.length}
              </div>
            </div>
          )}

          {/* Statistics and Legend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Node Count:</span>
                  <span className="font-semibold">{stats.nodeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tree Height:</span>
                  <span className="font-semibold">{stats.treeHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Operation:</span>
                  <span className="font-semibold">{stats.lastOperation || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traversal Time:</span>
                  <span className="font-semibold">{stats.traversalTime}ms</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                Legend
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                  <span>Normal Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-gray-800"></div>
                  <span>Currently Visiting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
                  <span>Visited in Traversal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  <span>Found/Target Node</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Instructions
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enter a number and click "Insert" to add nodes to the tree</li>
              <li>• Use "Delete" to remove nodes (handles all BST deletion cases)</li>
              <li>• "Search" will animate the path to find a specific value</li>
              <li>• Select a traversal type and click "Traverse" to see the algorithm in action</li>
              <li>• Generate a random tree to experiment with different structures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer; 