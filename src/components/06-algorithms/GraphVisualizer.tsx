import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus,
  Minus,
  Settings, 
  GitBranch,
  Target,
  MousePointer,
  Info,
  Shuffle,
  MapPin,
  Route
} from 'lucide-react';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  isHighlighted: boolean;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  previous: GraphNode | null;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  isHighlighted: boolean;
  isInPath: boolean;
}

type GraphAlgorithm = 'dfs' | 'bfs' | 'dijkstra' | 'astar' | 'mst-kruskal' | 'mst-prim';
type GraphMode = 'add-node' | 'add-edge' | 'set-start' | 'set-end' | 'remove';

const GraphVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mode, setMode] = useState<GraphMode>('add-node');
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [showSettings, setShowSettings] = useState(false);
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  
  const [pathResult, setPathResult] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [stats, setStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    pathLength: 0,
    totalWeight: 0,
    lastOperation: '',
    executionTime: 0
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const nodeIdCounter = useRef(0);
  const edgeIdCounter = useRef(0);

  // Create a new node
  const createNode = (x: number, y: number, label?: string): GraphNode => {
    nodeIdCounter.current++;
    const id = `node-${nodeIdCounter.current}`;
    return {
      id,
      x,
      y,
      label: label || id.split('-')[1],
      isHighlighted: false,
      isVisited: false,
      isStart: false,
      isEnd: false,
      distance: Infinity,
      previous: null
    };
  };

  // Create a new edge
  const createEdge = (from: string, to: string, weight?: number): GraphEdge => {
    edgeIdCounter.current++;
    return {
      id: `edge-${edgeIdCounter.current}`,
      from,
      to,
      weight: weight || (isWeighted ? Math.floor(Math.random() * 10) + 1 : 1),
      isHighlighted: false,
      isInPath: false
    };
  };

  // Get neighbors of a node
  const getNeighbors = (nodeId: string): { node: GraphNode; weight: number }[] => {
    const neighbors: { node: GraphNode; weight: number }[] = [];
    
    edges.forEach(edge => {
      let neighborId: string | null = null;
      let weight = edge.weight;
      
      if (edge.from === nodeId) {
        neighborId = edge.to;
      } else if (!isDirected && edge.to === nodeId) {
        neighborId = edge.from;
      }
      
      if (neighborId) {
        const neighborNode = nodes.find(node => node.id === neighborId);
        if (neighborNode) {
          neighbors.push({ node: neighborNode, weight });
        }
      }
    });
    
    return neighbors;
  };

  // Breadth-First Search
  const bfs = async (startNodeId: string, endNodeId?: string) => {
    const visited = new Set<string>();
    const queue = [startNodeId];
    const path: string[] = [];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      path.push(currentId);
      
      // Highlight current node
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          isHighlighted: node.id === currentId,
          isVisited: visited.has(node.id)
        }))
      );
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (endNodeId && currentId === endNodeId) {
        break;
      }
      
      // Add neighbors to queue
      const neighbors = getNeighbors(currentId);
      neighbors.forEach(({ node }) => {
        if (!visited.has(node.id)) {
          queue.push(node.id);
        }
      });
    }
    
    return path;
  };

  // Depth-First Search
  const dfs = async (startNodeId: string, endNodeId?: string) => {
    const visited = new Set<string>();
    const stack = [startNodeId];
    const path: string[] = [];
    
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      path.push(currentId);
      
      // Highlight current node
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          isHighlighted: node.id === currentId,
          isVisited: visited.has(node.id)
        }))
      );
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (endNodeId && currentId === endNodeId) {
        break;
      }
      
      // Add neighbors to stack (in reverse order for correct traversal)
      const neighbors = getNeighbors(currentId);
      neighbors.reverse().forEach(({ node }) => {
        if (!visited.has(node.id)) {
          stack.push(node.id);
        }
      });
    }
    
    return path;
  };

  // Dijkstra's Algorithm
  const dijkstra = async (startNodeId: string, endNodeId?: string) => {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();
    
    // Initialize distances
    nodes.forEach(node => {
      distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
      previous.set(node.id, null);
      unvisited.add(node.id);
    });
    
    const path: string[] = [];
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentId: string | null = null;
      let minDistance = Infinity;
      
      unvisited.forEach(nodeId => {
        const distance = distances.get(nodeId) || Infinity;
        if (distance < minDistance) {
          minDistance = distance;
          currentId = nodeId;
        }
      });
      
      if (!currentId || minDistance === Infinity) break;
      
      unvisited.delete(currentId);
      path.push(currentId);
      
      // Update display
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          isHighlighted: node.id === currentId,
          isVisited: !unvisited.has(node.id),
          distance: distances.get(node.id) || Infinity
        }))
      );
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
      
      if (endNodeId && currentId === endNodeId) {
        break;
      }
      
      // Update neighbors
      const neighbors = getNeighbors(currentId);
      neighbors.forEach(({ node, weight }) => {
        if (unvisited.has(node.id) && currentId !== null) {
          const currentDistance = distances.get(currentId) || Infinity;
          const neighborDistance = distances.get(node.id) || Infinity;
          const newDistance = currentDistance + weight;
          if (newDistance < neighborDistance) {
            distances.set(node.id, newDistance);
            previous.set(node.id, currentId);
          }
        }
      });
    }
    
    // Reconstruct path if end node specified
    if (endNodeId && previous.has(endNodeId)) {
      const reconstructedPath: string[] = [];
      let current: string | null = endNodeId;
      
      while (current) {
        reconstructedPath.unshift(current);
        current = previous.get(current) || null;
      }
      
      // Highlight path
      setEdges(prevEdges => 
        prevEdges.map(edge => ({
          ...edge,
          isInPath: reconstructedPath.some((nodeId, index) => 
            index > 0 && 
            ((edge.from === reconstructedPath[index - 1] && edge.to === nodeId) ||
             (!isDirected && edge.to === reconstructedPath[index - 1] && edge.from === nodeId))
          )
        }))
      );
      
      return reconstructedPath;
    }
    
    return path;
  };

  // Run selected algorithm
  const runAlgorithm = async () => {
    if (isAnimating || nodes.length === 0) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    const startTime = Date.now();
    
    // Reset states
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        isHighlighted: false,
        isVisited: false,
        distance: Infinity
      }))
    );
    
    setEdges(prevEdges => 
      prevEdges.map(edge => ({
        ...edge,
        isHighlighted: false,
        isInPath: false
      }))
    );
    
    const startNode = nodes.find(node => node.isStart);
    const endNode = nodes.find(node => node.isEnd);
    
    if (!startNode) {
      setStats(prev => ({ ...prev, lastOperation: 'No start node selected' }));
      setIsAnimating(false);
      return;
    }
    
    let result: string[] = [];
    
    switch (algorithm) {
      case 'bfs':
        result = await bfs(startNode.id, endNode?.id);
        break;
      case 'dfs':
        result = await dfs(startNode.id, endNode?.id);
        break;
      case 'dijkstra':
        result = await dijkstra(startNode.id, endNode?.id);
        break;
      default:
        result = await bfs(startNode.id, endNode?.id);
    }
    
    setPathResult(result);
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      lastOperation: `${algorithm.toUpperCase()} completed`,
      pathLength: result.length,
      executionTime: endTime - startTime
    }));
    
    setIsAnimating(false);
  };

  // Handle SVG click
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isAnimating) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (mode === 'add-node') {
      const newNode = createNode(x, y);
      setNodes(prev => [...prev, newNode]);
      setStats(prev => ({ 
        ...prev, 
        nodeCount: prev.nodeCount + 1,
        lastOperation: `Added node ${newNode.label}`
      }));
    }
  };

  // Handle node click
  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isAnimating) return;
    
    switch (mode) {
      case 'add-edge':
        if (selectedNode && selectedNode !== nodeId) {
          const newEdge = createEdge(selectedNode, nodeId);
          setEdges(prev => [...prev, newEdge]);
          setStats(prev => ({ 
            ...prev, 
            edgeCount: prev.edgeCount + 1,
            lastOperation: `Added edge ${selectedNode} → ${nodeId}`
          }));
          setSelectedNode(null);
        } else {
          setSelectedNode(nodeId);
        }
        break;
      case 'set-start':
        setNodes(prev => prev.map(node => ({
          ...node,
          isStart: node.id === nodeId,
          isEnd: node.isEnd && node.id !== nodeId
        })));
        setStats(prev => ({ ...prev, lastOperation: `Set start node: ${nodeId}` }));
        break;
      case 'set-end':
        setNodes(prev => prev.map(node => ({
          ...node,
          isEnd: node.id === nodeId,
          isStart: node.isStart && node.id !== nodeId
        })));
        setStats(prev => ({ ...prev, lastOperation: `Set end node: ${nodeId}` }));
        break;
      case 'remove':
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setEdges(prev => prev.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
        setStats(prev => ({ 
          ...prev, 
          nodeCount: Math.max(0, prev.nodeCount - 1),
          lastOperation: `Removed node ${nodeId}`
        }));
        break;
    }
  };

  // Generate random graph
  const generateRandomGraph = () => {
    if (isAnimating) return;
    
    setNodes([]);
    setEdges([]);
    
    const nodeCount = 8;
    const newNodes: GraphNode[] = [];
    
    // Create nodes in a circle
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const x = 400 + Math.cos(angle) * 150;
      const y = 300 + Math.sin(angle) * 150;
      newNodes.push(createNode(x, y, (i + 1).toString()));
    }
    
    // Set start and end nodes
    newNodes[0].isStart = true;
    newNodes[nodeCount - 1].isEnd = true;
    
    setNodes(newNodes);
    
    // Create random edges
    const newEdges: GraphEdge[] = [];
    const edgeCount = Math.floor(nodeCount * 1.5);
    
    for (let i = 0; i < edgeCount; i++) {
      const from = Math.floor(Math.random() * nodeCount);
      const to = Math.floor(Math.random() * nodeCount);
      
      if (from !== to && !newEdges.some(edge => 
        (edge.from === newNodes[from].id && edge.to === newNodes[to].id) ||
        (!isDirected && edge.to === newNodes[from].id && edge.from === newNodes[to].id)
      )) {
        newEdges.push(createEdge(newNodes[from].id, newNodes[to].id));
      }
    }
    
    setEdges(newEdges);
    setStats(prev => ({
      ...prev,
      nodeCount: newNodes.length,
      edgeCount: newEdges.length,
      lastOperation: 'Generated random graph'
    }));
  };

  // Clear graph
  const clearGraph = () => {
    if (isAnimating) return;
    
    setNodes([]);
    setEdges([]);
    setPathResult([]);
    setSelectedNode(null);
    setCurrentStep(0);
    setStats({
      nodeCount: 0,
      edgeCount: 0,
      pathLength: 0,
      totalWeight: 0,
      lastOperation: 'Graph cleared',
      executionTime: 0
    });
  };

  // Update stats when nodes/edges change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      totalWeight: edges.reduce((sum, edge) => sum + edge.weight, 0)
    }));
  }, [nodes, edges]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Graph Visualizer</h1>
              <p className="text-indigo-100">Visualize graph algorithms and pathfinding</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.nodeCount}</div>
                <div className="text-sm text-indigo-100">Nodes</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.edgeCount}</div>
                <div className="text-sm text-indigo-100">Edges</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Mode Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Mode:</label>
                <select
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as GraphMode);
                    setSelectedNode(null);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isAnimating}
                >
                  <option value="add-node">Add Node</option>
                  <option value="add-edge">Add Edge</option>
                  <option value="set-start">Set Start</option>
                  <option value="set-end">Set End</option>
                  <option value="remove">Remove</option>
                </select>
              </div>

              {/* Algorithm Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Algorithm:</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as GraphAlgorithm)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isAnimating}
                >
                  <option value="bfs">Breadth-First Search</option>
                  <option value="dfs">Depth-First Search</option>
                  <option value="dijkstra">Dijkstra's Algorithm</option>
                </select>
              </div>

              {/* Graph Type */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="directed"
                    checked={isDirected}
                    onChange={(e) => setIsDirected(e.target.checked)}
                    disabled={isAnimating}
                  />
                  <label htmlFor="directed" className="text-sm font-medium text-gray-700">
                    Directed
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="weighted"
                    checked={isWeighted}
                    onChange={(e) => setIsWeighted(e.target.checked)}
                    disabled={isAnimating}
                  />
                  <label htmlFor="weighted" className="text-sm font-medium text-gray-700">
                    Weighted
                  </label>
                </div>
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

              {/* Action Buttons */}
              <button
                onClick={runAlgorithm}
                disabled={isAnimating || nodes.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                <Play className="w-4 h-4" />
                Run Algorithm
              </button>

              <button
                onClick={generateRandomGraph}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Random Graph
              </button>

              <button
                onClick={clearGraph}
                disabled={isAnimating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Info
              </button>
            </div>
          </div>

          {/* Settings/Info Panel */}
          {showSettings && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Graph Algorithms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Instructions</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Click on canvas to add nodes</li>
                    <li>• Select "Add Edge" mode and click two nodes to connect them</li>
                    <li>• Set start and end nodes for pathfinding</li>
                    <li>• Choose an algorithm and click "Run Algorithm"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Algorithms</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• BFS: Shortest path (unweighted graphs)</li>
                    <li>• DFS: Depth-first exploration</li>
                    <li>• Dijkstra: Shortest path (weighted graphs)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Current Mode Display */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Current Mode: {mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {mode === 'add-node' && 'Click on the canvas to add new nodes'}
              {mode === 'add-edge' && (selectedNode ? `Click another node to connect with ${selectedNode}` : 'Click a node to start adding an edge')}
              {mode === 'set-start' && 'Click a node to set it as the start point'}
              {mode === 'set-end' && 'Click a node to set it as the end point'}
              {mode === 'remove' && 'Click nodes to remove them'}
            </p>
          </div>

          {/* Graph Visualization */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <svg
              ref={svgRef}
              width="800"
              height="600"
              className="border border-gray-300 rounded cursor-crosshair"
              onClick={handleSvgClick}
            >
              {/* Render edges */}
              {edges.map(edge => {
                const fromNode = nodes.find(node => node.id === edge.from);
                const toNode = nodes.find(node => node.id === edge.to);
                
                if (!fromNode || !toNode) return null;
                
                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const unitX = dx / length;
                const unitY = dy / length;
                
                // Adjust for node radius
                const radius = 20;
                const startX = fromNode.x + unitX * radius;
                const startY = fromNode.y + unitY * radius;
                const endX = toNode.x - unitX * radius;
                const endY = toNode.y - unitY * radius;
                
                return (
                  <g key={edge.id}>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={edge.isInPath ? "#10B981" : edge.isHighlighted ? "#F59E0B" : "#6B7280"}
                      strokeWidth={edge.isInPath ? "4" : "2"}
                      className="transition-all duration-300"
                    />
                    
                    {/* Arrow for directed graphs */}
                    {isDirected && (
                      <polygon
                        points={`${endX},${endY} ${endX - 10 * unitX + 5 * unitY},${endY - 10 * unitY - 5 * unitX} ${endX - 10 * unitX - 5 * unitY},${endY - 10 * unitY + 5 * unitX}`}
                        fill={edge.isInPath ? "#10B981" : "#6B7280"}
                      />
                    )}
                    
                    {/* Weight label */}
                    {isWeighted && (
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 - 5}
                        textAnchor="middle"
                        fill="#374151"
                        fontSize="12"
                        fontWeight="bold"
                        className="bg-white"
                      >
                        {edge.weight}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* Render nodes */}
              {nodes.map(node => (
                <g
                  key={node.id}
                  onClick={(e) => handleNodeClick(node.id, e)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={
                      node.isStart ? "#10B981" :
                      node.isEnd ? "#EF4444" :
                      node.isHighlighted ? "#F59E0B" :
                      node.isVisited ? "#8B5CF6" :
                      selectedNode === node.id ? "#3B82F6" :
                      "#9CA3AF"
                    }
                    stroke="#1F2937"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:stroke-4"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {node.label}
                  </text>
                  
                  {/* Distance label for Dijkstra */}
                  {algorithm === 'dijkstra' && node.distance !== Infinity && node.isVisited && (
                    <text
                      x={node.x}
                      y={node.y - 30}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.distance}
                    </text>
                  )}
                </g>
              ))}
              
              {/* Empty state */}
              {nodes.length === 0 && (
                <text x="400" y="300" textAnchor="middle" fill="#9CA3AF" fontSize="18">
                  Click to add nodes or generate a random graph
                </text>
              )}
            </svg>
          </div>

          {/* Path Result */}
          {pathResult.length > 0 && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Route className="w-5 h-5 text-purple-600" />
                Algorithm Result
              </h3>
              <div className="flex flex-wrap gap-2">
                {pathResult.map((nodeId, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg font-semibold"
                  >
                    {nodes.find(node => node.id === nodeId)?.label || nodeId}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Path length: {pathResult.length} nodes
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
                  <span className="text-gray-600">Nodes:</span>
                  <span className="font-semibold">{stats.nodeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edges:</span>
                  <span className="font-semibold">{stats.edgeCount}</span>
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
                  <span className="text-gray-600">Last Operation:</span>
                  <span className="font-semibold text-xs">{stats.lastOperation || 'None'}</span>
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
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  <span>Start Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-gray-800"></div>
                  <span>End Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-gray-800"></div>
                  <span>Currently Visiting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
                  <span>Visited Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                  <span>Selected Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-green-500 border border-gray-800"></div>
                  <span>Solution Path</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer; 