import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Brush, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  Type,
  Palette,
  Download,
  Upload,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Settings,
  Layers,
  Eye,
  EyeOff,
  Plus,
  Copy,
  Move,
  ZoomIn,
  ZoomOut,
  Grid
} from 'lucide-react';

type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text' | 'select';

interface DrawingPoint {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  tool: Tool;
  points: DrawingPoint[];
  color: string;
  strokeWidth: number;
  opacity: number;
  layerId: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
  paths: DrawingPath[];
}

interface CanvasState {
  layers: Layer[];
  activeLayerId: string;
  history: Layer[][];
  historyIndex: number;
}

const DrawingApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  
  // Canvas state
  const [canvasState, setCanvasState] = useState<CanvasState>({
    layers: [
      {
        id: 'layer-1',
        name: 'Background',
        visible: true,
        opacity: 1,
        locked: false,
        paths: []
      }
    ],
    activeLayerId: 'layer-1',
    history: [],
    historyIndex: -1
  });
  
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [startPoint, setStartPoint] = useState<DrawingPoint | null>(null);
  
  // UI state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  
  // Predefined colors
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX / zoom - panOffset.x,
      y: (e.clientY - rect.top) * scaleY / zoom - panOffset.y
    };
  }, [zoom, panOffset]);

  const saveToHistory = useCallback(() => {
    setCanvasState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(prev.layers)));
      
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49)
      };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(point);

    if (tool === 'brush' || tool === 'eraser') {
      const newPath: DrawingPath = {
        id: `path-${Date.now()}`,
        tool,
        points: [point],
        color: tool === 'eraser' ? '#FFFFFF' : color,
        strokeWidth,
        opacity,
        layerId: canvasState.activeLayerId
      };
      setCurrentPath(newPath);
    }
  }, [tool, color, strokeWidth, opacity, canvasState.activeLayerId, getMousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const point = getMousePos(e);

    if (tool === 'brush' || tool === 'eraser') {
      setCurrentPath(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, point]
        };
      });
    }
  }, [isDrawing, tool, getMousePos]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath && (tool === 'brush' || tool === 'eraser')) {
      setCanvasState(prev => ({
        ...prev,
        layers: prev.layers.map(layer => 
          layer.id === canvasState.activeLayerId
            ? { ...layer, paths: [...layer.paths, currentPath] }
            : layer
        )
      }));
      saveToHistory();
    } else if (startPoint && (tool === 'rectangle' || tool === 'circle' || tool === 'line')) {
      const endPoint = getMousePos({ clientX: 0, clientY: 0 } as any); // This would be the actual mouse position
      const newPath: DrawingPath = {
        id: `path-${Date.now()}`,
        tool,
        points: [startPoint, endPoint],
        color,
        strokeWidth,
        opacity,
        layerId: canvasState.activeLayerId
      };
      
      setCanvasState(prev => ({
        ...prev,
        layers: prev.layers.map(layer => 
          layer.id === canvasState.activeLayerId
            ? { ...layer, paths: [...layer.paths, newPath] }
            : layer
        )
      }));
      saveToHistory();
    }
    
    setCurrentPath(null);
    setStartPoint(null);
  }, [isDrawing, currentPath, startPoint, tool, color, strokeWidth, opacity, canvasState.activeLayerId, saveToHistory, getMousePos]);

  const drawPath = useCallback((ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    ctx.globalAlpha = path.opacity;
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (path.tool === 'brush' || path.tool === 'eraser') {
      if (path.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length; i++) {
        const point = path.points[i];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    } else if (path.tool === 'rectangle' && path.points.length >= 2) {
      const [start, end] = path.points;
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (path.tool === 'circle' && path.points.length >= 2) {
      const [start, end] = path.points;
      const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (path.tool === 'line' && path.points.length >= 2) {
      const [start, end] = path.points;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  }, [showGrid]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx);

    // Draw all layers
    canvasState.layers.forEach(layer => {
      if (!layer.visible) return;
      
      ctx.globalAlpha = layer.opacity;
      layer.paths.forEach(path => {
        drawPath(ctx, path);
      });
    });

    // Draw current path being drawn
    if (currentPath) {
      drawPath(ctx, currentPath);
    }

    ctx.globalAlpha = 1;
  }, [canvasState.layers, currentPath, drawPath, drawGrid]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const undo = () => {
    if (canvasState.historyIndex > 0) {
      setCanvasState(prev => ({
        ...prev,
        layers: prev.history[prev.historyIndex - 1],
        historyIndex: prev.historyIndex - 1
      }));
    }
  };

  const redo = () => {
    if (canvasState.historyIndex < canvasState.history.length - 1) {
      setCanvasState(prev => ({
        ...prev,
        layers: prev.history[prev.historyIndex + 1],
        historyIndex: prev.historyIndex + 1
      }));
    }
  };

  const clearCanvas = () => {
    setCanvasState(prev => ({
      ...prev,
      layers: prev.layers.map(layer => 
        layer.id === prev.activeLayerId 
          ? { ...layer, paths: [] }
          : layer
      )
    }));
    saveToHistory();
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${canvasState.layers.length + 1}`,
      visible: true,
      opacity: 1,
      locked: false,
      paths: []
    };
    
    setCanvasState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      activeLayerId: newLayer.id
    }));
  };

  const deleteLayer = (layerId: string) => {
    if (canvasState.layers.length <= 1) return;
    
    setCanvasState(prev => {
      const newLayers = prev.layers.filter(l => l.id !== layerId);
      const newActiveId = prev.activeLayerId === layerId 
        ? newLayers[0]?.id || ''
        : prev.activeLayerId;
      
      return {
        ...prev,
        layers: newLayers,
        activeLayerId: newActiveId
      };
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setCanvasState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    }));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const activeLayer = canvasState.layers.find(l => l.id === canvasState.activeLayerId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => setTool('brush')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'brush' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Brush"
        >
          <Brush className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('eraser')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'eraser' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('rectangle')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'rectangle' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Rectangle"
        >
          <Square className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('circle')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'circle' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Circle"
        >
          <Circle className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('line')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'line' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Line"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('text')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'text' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          title="Text"
        >
          <Type className="w-5 h-5" />
        </button>

        <div className="w-full border-t border-gray-600 my-2"></div>
        
        <button
          onClick={undo}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title="Undo"
          disabled={canvasState.historyIndex <= 0}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={redo}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title="Redo"
          disabled={canvasState.historyIndex >= canvasState.history.length - 1}
        >
          <RotateCw className="w-5 h-5" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title="Clear"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color }}
              title="Color"
            />
            {showColorPicker && (
              <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border p-3 z-10">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transform transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 rounded border"
                />
              </div>
            )}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-8">{strokeWidth}</span>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-8">{Math.round(opacity * 100)}%</span>
          </div>

          <div className="flex-1"></div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 px-2">{Math.round(zoom * 100)}%</span>
            
            <button
              onClick={() => setZoom(Math.min(4, zoom + 0.25))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowLayers(!showLayers)}
              className={`p-2 rounded-lg transition-colors ${
                showLayers ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Layers"
            >
              <Layers className="w-5 h-5" />
            </button>
            
            <button
              onClick={downloadCanvas}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 bg-white shadow-lg cursor-crosshair"
            style={{ 
              transform: `translate(-50%, -50%) scale(${zoom})`,
              transformOrigin: 'center'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* Layers Panel */}
      {showLayers && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
            <h3 className="font-semibold text-gray-800">Layers</h3>
            <button
              onClick={addLayer}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Add Layer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {canvasState.layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  layer.id === canvasState.activeLayerId
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setCanvasState(prev => ({ ...prev, activeLayerId: layer.id }))}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                
                <div className="flex-1">
                  <div className="font-medium text-sm">{layer.name}</div>
                  <div className="text-xs text-gray-500">{layer.paths.length} paths</div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayer(layer.id);
                  }}
                  className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                  disabled={canvasState.layers.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingApp; 