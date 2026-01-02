import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Pen, 
  Square, 
  Circle, 
  Triangle,
  Type,
  StickyNote,
  Eraser,
  Move,
  MousePointer,
  Palette,
  Download,
  Upload,
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Eye,
  EyeOff,
  Users,
  Share2,
  Save,
  Settings,
  Presentation,
  Hand,
  Minus,
  Plus,
  RotateCw
} from 'lucide-react';

type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'triangle' | 'line' | 'text' | 'sticky' | 'eraser' | 'hand';

interface Point {
  x: number;
  y: number;
}

interface WhiteboardElement {
  id: string;
  type: Tool;
  points: Point[];
  color: string;
  strokeWidth: number;
  fill?: boolean;
  text?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
}

interface StickyNote {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  author: string;
}

interface User {
  id: string;
  name: string;
  color: string;
  cursor: Point;
  isActive: boolean;
}

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tools and drawing state
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [isFilled, setIsFilled] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  
  // Canvas state
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<WhiteboardElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // UI state
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showToolbox, setShowToolbox] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  
  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [selectedSticky, setSelectedSticky] = useState<string | null>(null);
  
  // Collaboration
  const [users] = useState<User[]>([
    { id: '1', name: 'Alice', color: '#ff6b6b', cursor: { x: 0, y: 0 }, isActive: true },
    { id: '2', name: 'Bob', color: '#4ecdc4', cursor: { x: 100, y: 100 }, isActive: true },
    { id: '3', name: 'Charlie', color: '#45b7d1', cursor: { x: 200, y: 150 }, isActive: false }
  ]);

  const colors = [
    '#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
  ];

  const tools = [
    { type: 'select' as Tool, icon: MousePointer, label: 'Select' },
    { type: 'pen' as Tool, icon: Pen, label: 'Pen' },
    { type: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
    { type: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { type: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { type: 'triangle' as Tool, icon: Triangle, label: 'Triangle' },
    { type: 'text' as Tool, icon: Type, label: 'Text' },
    { type: 'sticky' as Tool, icon: StickyNote, label: 'Sticky Note' },
    { type: 'hand' as Tool, icon: Hand, label: 'Pan' }
  ];

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - panOffset.x) / zoom,
      y: (e.clientY - rect.top - panOffset.y) / zoom
    };
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToHistory = (newElements: WhiteboardElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setStickyNotes([]);
    addToHistory([]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    setIsDrawing(true);

    if (selectedTool === 'sticky') {
      const newSticky: StickyNote = {
        id: generateId(),
        x: point.x,
        y: point.y,
        width: 200,
        height: 150,
        text: 'New Note',
        color: '#ffd93d',
        author: 'You'
      };
      setStickyNotes([...stickyNotes, newSticky]);
      setSelectedSticky(newSticky.id);
      return;
    }

    if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement: WhiteboardElement = {
          id: generateId(),
          type: 'text',
          points: [point],
          color: strokeColor,
          strokeWidth: 1,
          text,
          fontSize
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
      }
      return;
    }

    const newElement: WhiteboardElement = {
      id: generateId(),
      type: selectedTool,
      points: [point],
      color: strokeColor,
      strokeWidth,
      fill: isFilled,
      opacity: 1
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);

    if (!isDrawing || !currentElement) return;

    if (selectedTool === 'pen' || selectedTool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, point]
      });
    } else {
      setCurrentElement({
        ...currentElement,
        points: [currentElement.points[0], point]
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      addToHistory(newElements);
      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    const gridSize = 20 * zoom;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

    for (let x = panOffset.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = panOffset.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
    ctx.save();
    ctx.globalAlpha = element.opacity || 1;
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const [start, end] = element.points;

    switch (element.type) {
      case 'pen':
        ctx.beginPath();
        if (element.points.length > 0) {
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
        }
        ctx.stroke();
        break;

      case 'rectangle':
        if (end) {
          const width = end.x - start.x;
          const height = end.y - start.y;
          if (element.fill) {
            ctx.fillStyle = element.color;
            ctx.fillRect(start.x, start.y, width, height);
          }
          ctx.strokeRect(start.x, start.y, width, height);
        }
        break;

      case 'circle':
        if (end) {
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          ctx.beginPath();
          ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          if (element.fill) {
            ctx.fillStyle = element.color;
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case 'triangle':
        if (end) {
          const width = end.x - start.x;
          const height = end.y - start.y;
          ctx.beginPath();
          ctx.moveTo(start.x + width / 2, start.y);
          ctx.lineTo(start.x, start.y + height);
          ctx.lineTo(start.x + width, start.y + height);
          ctx.closePath();
          if (element.fill) {
            ctx.fillStyle = element.color;
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case 'line':
        if (end) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
        break;

      case 'text':
        if (element.text) {
          ctx.font = `${element.fontSize || 16}px Arial`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, start.x, start.y);
        }
        break;

      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        if (element.points.length > 0) {
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        break;
    }

    ctx.restore();
  };

  const drawUserCursors = (ctx: CanvasRenderingContext2D) => {
    users.filter(user => user.isActive && user.id !== '1').forEach(user => {
      ctx.save();
      ctx.fillStyle = user.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Draw cursor
      ctx.beginPath();
      ctx.moveTo(user.cursor.x, user.cursor.y);
      ctx.lineTo(user.cursor.x + 10, user.cursor.y + 10);
      ctx.lineTo(user.cursor.x + 5, user.cursor.y + 12);
      ctx.lineTo(user.cursor.x + 2, user.cursor.y + 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw name
      ctx.fillStyle = user.color;
      ctx.font = '12px Arial';
      ctx.fillText(user.name, user.cursor.x + 15, user.cursor.y + 10);
      
      ctx.restore();
    });
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    drawGrid(ctx);

    // Draw elements
    elements.forEach(element => drawElement(ctx, element));

    // Draw current element
    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    ctx.restore();

    // Draw user cursors (not affected by zoom/pan)
    drawUserCursors(ctx);
  }, [elements, currentElement, panOffset, zoom, showGrid, users]);

  // Draw whenever state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleStickyChange = (id: string, text: string) => {
    setStickyNotes(notes => 
      notes.map(note => 
        note.id === id ? { ...note, text } : note
      )
    );
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(notes => notes.filter(note => note.id !== id));
    setSelectedSticky(null);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toolbox */}
      {showToolbox && !isPresentationMode && (
        <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4 z-10">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(tool.type)}
              className={`p-3 mb-2 rounded-lg transition-colors ${
                selectedTool === tool.type
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        {!isPresentationMode && (
          <div className="bg-white shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stroke Settings */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Stroke:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm w-6">{strokeWidth}</span>
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setStrokeColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      strokeColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-gray-300"
                />
              </div>

              {/* Fill Toggle */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Fill:</label>
                <button
                  onClick={() => setIsFilled(!isFilled)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    isFilled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {isFilled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* View Options */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Toggle Grid"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Presentation Mode"
              >
                <Presentation className="w-4 h-4" />
              </button>

              {/* File Operations */}
              <button
                onClick={downloadCanvas}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>

              <button className="p-2 rounded-lg hover:bg-gray-100" title="Share">
                <Share2 className="w-4 h-4" />
              </button>

              {/* Collaborators */}
              <div className="flex items-center gap-2 ml-4">
                <Users className="w-4 h-4" />
                <div className="flex -space-x-2">
                  {users.filter(u => u.isActive).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas Container */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Sticky Notes */}
          {stickyNotes.map((note) => (
            <div
              key={note.id}
              className="absolute border-2 border-gray-300 rounded-lg shadow-lg resize"
              style={{
                left: note.x * zoom + panOffset.x,
                top: note.y * zoom + panOffset.y,
                width: note.width * zoom,
                height: note.height * zoom,
                backgroundColor: note.color,
                transform: `scale(${zoom})`
              }}
            >
              <div className="flex items-center justify-between p-2 bg-black bg-opacity-10 rounded-t-lg">
                <span className="text-xs font-bold">{note.author}</span>
                <button
                  onClick={() => deleteStickyNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <textarea
                value={note.text}
                onChange={(e) => handleStickyChange(note.id, e.target.value)}
                className="w-full flex-1 p-2 bg-transparent border-none outline-none resize-none"
                style={{ height: (note.height - 40) * zoom }}
                placeholder="Enter your note..."
              />
            </div>
          ))}

          {/* Presentation Mode Overlay */}
          {isPresentationMode && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Presentation Mode</span>
                <button
                  onClick={() => setIsPresentationMode(false)}
                  className="ml-2 hover:text-red-400"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Layers */}
      {showLayers && !isPresentationMode && (
        <div className="w-64 bg-white shadow-lg p-4">
          <h3 className="font-semibold mb-4">Layers</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {elements.map((element, index) => (
              <div
                key={element.id}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedElement === element.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedElement(element.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize">{element.type}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: element.color }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newElements = elements.filter(el => el.id !== element.id);
                        setElements(newElements);
                        addToHistory(newElements);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Whiteboard; 