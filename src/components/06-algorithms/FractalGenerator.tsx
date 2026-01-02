import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Settings, 
  Zap,
  Eye,
  Palette,
  Info,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

type FractalType = 'mandelbrot' | 'julia' | 'sierpinski' | 'koch' | 'dragon' | 'tree' | 'fern';

interface FractalSettings {
  iterations: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  colorScheme: string;
  animationSpeed: number;
}

interface Complex {
  real: number;
  imag: number;
}

const FractalGenerator: React.FC = () => {
  const [fractalType, setFractalType] = useState<FractalType>('mandelbrot');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  
  const [settings, setSettings] = useState<FractalSettings>({
    iterations: 100,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    colorScheme: 'rainbow',
    animationSpeed: 50
  });

  const [stats, setStats] = useState({
    generationTime: 0,
    totalPixels: 0,
    lastFractal: '',
    complexity: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const generationRef = useRef<boolean>(false);

  const width = 800;
  const height = 600;

  // Color schemes
  const getColor = (iteration: number, maxIterations: number, scheme: string): string => {
    const ratio = iteration / maxIterations;
    
    switch (scheme) {
      case 'rainbow':
        const hue = ratio * 360;
        return `hsl(${hue}, 70%, 50%)`;
      
      case 'fire':
        if (ratio < 0.5) {
          return `rgb(${Math.floor(255 * ratio * 2)}, 0, 0)`;
        } else {
          return `rgb(255, ${Math.floor(255 * (ratio - 0.5) * 2)}, 0)`;
        }
      
      case 'ice':
        return `rgb(${Math.floor(100 + 155 * ratio)}, ${Math.floor(200 + 55 * ratio)}, 255)`;
      
      case 'grayscale':
        const gray = Math.floor(255 * ratio);
        return `rgb(${gray}, ${gray}, ${gray})`;
      
      case 'electric':
        return `rgb(${Math.floor(255 * (1 - ratio))}, ${Math.floor(255 * ratio)}, ${Math.floor(128 + 127 * Math.sin(ratio * Math.PI))})`;
      
      default:
        return `rgb(${Math.floor(255 * ratio)}, ${Math.floor(255 * ratio)}, ${Math.floor(255 * ratio)})`;
    }
  };

  // Complex number operations
  const complexAdd = (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag
  });

  const complexMultiply = (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  });

  const complexMagnitudeSquared = (c: Complex): number => 
    c.real * c.real + c.imag * c.imag;

  // Mandelbrot set calculation
  const mandelbrotIteration = (c: Complex, maxIterations: number): number => {
    let z: Complex = { real: 0, imag: 0 };
    let iteration = 0;
    
    while (iteration < maxIterations && complexMagnitudeSquared(z) < 4) {
      z = complexAdd(complexMultiply(z, z), c);
      iteration++;
    }
    
    return iteration;
  };

  // Julia set calculation
  const juliaIteration = (z: Complex, c: Complex, maxIterations: number): number => {
    let iteration = 0;
    
    while (iteration < maxIterations && complexMagnitudeSquared(z) < 4) {
      z = complexAdd(complexMultiply(z, z), c);
      iteration++;
    }
    
    return iteration;
  };

  // Generate Mandelbrot fractal
  const generateMandelbrot = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;
    
    const startTime = Date.now();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const real = (x - width / 2) / (width / 4) / settings.zoom + settings.offsetX;
        const imag = (y - height / 2) / (height / 4) / settings.zoom + settings.offsetY;
        
        const c: Complex = { real, imag };
        const iteration = mandelbrotIteration(c, settings.iterations);
        
        const pixelIndex = (y * width + x) * 4;
        const color = getColor(iteration, settings.iterations, settings.colorScheme);
        const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
        
        pixels[pixelIndex] = rgb[0];     // Red
        pixels[pixelIndex + 1] = rgb[1]; // Green
        pixels[pixelIndex + 2] = rgb[2]; // Blue
        pixels[pixelIndex + 3] = 255;    // Alpha
      }
      
      // Update progress
      if (y % 10 === 0) {
        setCurrentIteration(Math.floor((y / height) * 100));
        ctx.putImageData(imageData, 0, 0);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: width * height,
      lastFractal: 'Mandelbrot Set',
      complexity: settings.iterations
    }));
  };

  // Generate Julia fractal
  const generateJulia = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;
    
    // Julia set constant
    const c: Complex = { real: -0.7, imag: 0.27015 };
    
    const startTime = Date.now();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const real = (x - width / 2) / (width / 4) / settings.zoom + settings.offsetX;
        const imag = (y - height / 2) / (height / 4) / settings.zoom + settings.offsetY;
        
        const z: Complex = { real, imag };
        const iteration = juliaIteration(z, c, settings.iterations);
        
        const pixelIndex = (y * width + x) * 4;
        const color = getColor(iteration, settings.iterations, settings.colorScheme);
        const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
        
        pixels[pixelIndex] = rgb[0];
        pixels[pixelIndex + 1] = rgb[1];
        pixels[pixelIndex + 2] = rgb[2];
        pixels[pixelIndex + 3] = 255;
      }
      
      if (y % 10 === 0) {
        setCurrentIteration(Math.floor((y / height) * 100));
        ctx.putImageData(imageData, 0, 0);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: width * height,
      lastFractal: 'Julia Set',
      complexity: settings.iterations
    }));
  };

  // Generate Sierpinski Triangle
  const generateSierpinski = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#3B82F6';
    
    const startTime = Date.now();
    
    const drawTriangle = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, depth: number) => {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        return;
      }
      
      // Calculate midpoints
      const mid1x = (x1 + x2) / 2;
      const mid1y = (y1 + y2) / 2;
      const mid2x = (x2 + x3) / 2;
      const mid2y = (y2 + y3) / 2;
      const mid3x = (x3 + x1) / 2;
      const mid3y = (y3 + y1) / 2;
      
      // Draw three smaller triangles
      drawTriangle(x1, y1, mid1x, mid1y, mid3x, mid3y, depth - 1);
      drawTriangle(mid1x, mid1y, x2, y2, mid2x, mid2y, depth - 1);
      drawTriangle(mid3x, mid3y, mid2x, mid2y, x3, y3, depth - 1);
    };
    
    const size = Math.min(width, height) * 0.8;
    const centerX = width / 2;
    const centerY = height / 2 + size / 4;
    
    const x1 = centerX;
    const y1 = centerY - size / 2;
    const x2 = centerX - size / 2;
    const y2 = centerY + size / 2;
    const x3 = centerX + size / 2;
    const y3 = centerY + size / 2;
    
    drawTriangle(x1, y1, x2, y2, x3, y3, Math.min(settings.iterations / 20, 8));
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: 0,
      lastFractal: 'Sierpinski Triangle',
      complexity: Math.min(settings.iterations / 20, 8)
    }));
  };

  // Generate Koch Snowflake
  const generateKoch = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;
    
    const startTime = Date.now();
    
    const drawKochLine = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return;
      }
      
      const dx = x2 - x1;
      const dy = y2 - y1;
      
      const x3 = x1 + dx / 3;
      const y3 = y1 + dy / 3;
      const x4 = x1 + 2 * dx / 3;
      const y4 = y1 + 2 * dy / 3;
      
      const x5 = x3 + (x4 - x3) * Math.cos(Math.PI / 3) - (y4 - y3) * Math.sin(Math.PI / 3);
      const y5 = y3 + (x4 - x3) * Math.sin(Math.PI / 3) + (y4 - y3) * Math.cos(Math.PI / 3);
      
      drawKochLine(x1, y1, x3, y3, depth - 1);
      drawKochLine(x3, y3, x5, y5, depth - 1);
      drawKochLine(x5, y5, x4, y4, depth - 1);
      drawKochLine(x4, y4, x2, y2, depth - 1);
    };
    
    const size = Math.min(width, height) * 0.6;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const x1 = centerX - size / 2;
    const y1 = centerY + size / 3;
    const x2 = centerX + size / 2;
    const y2 = centerY + size / 3;
    const x3 = centerX;
    const y3 = centerY - size / 3;
    
    const depth = Math.min(settings.iterations / 20, 6);
    
    drawKochLine(x1, y1, x2, y2, depth);
    drawKochLine(x2, y2, x3, y3, depth);
    drawKochLine(x3, y3, x1, y1, depth);
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: 0,
      lastFractal: 'Koch Snowflake',
      complexity: depth
    }));
  };

  // Generate Fractal Tree
  const generateTree = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    const startTime = Date.now();
    
    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth === 0) return;
      
      const endX = x + length * Math.cos(angle);
      const endY = y + length * Math.sin(angle);
      
      // Color gradient based on depth
      const intensity = depth / (settings.iterations / 10);
      ctx.strokeStyle = `hsl(${120 * intensity}, 70%, ${30 + 40 * intensity}%)`;
      ctx.lineWidth = depth * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      const newLength = length * 0.7;
      const leftAngle = angle - Math.PI / 6;
      const rightAngle = angle + Math.PI / 6;
      
      drawBranch(endX, endY, newLength, leftAngle, depth - 1);
      drawBranch(endX, endY, newLength, rightAngle, depth - 1);
    };
    
    const startX = width / 2;
    const startY = height - 50;
    const initialLength = 100;
    const initialAngle = -Math.PI / 2;
    const maxDepth = Math.min(settings.iterations / 10, 12);
    
    drawBranch(startX, startY, initialLength, initialAngle, maxDepth);
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: 0,
      lastFractal: 'Fractal Tree',
      complexity: maxDepth
    }));
  };

  // Generate Barnsley Fern
  const generateFern = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#22C55E';
    
    const startTime = Date.now();
    
    let x = 0;
    let y = 0;
    
    const points = settings.iterations * 100;
    
    for (let i = 0; i < points; i++) {
      const rand = Math.random();
      let newX, newY;
      
      if (rand < 0.01) {
        newX = 0;
        newY = 0.16 * y;
      } else if (rand < 0.86) {
        newX = 0.85 * x + 0.04 * y;
        newY = -0.04 * x + 0.85 * y + 1.6;
      } else if (rand < 0.93) {
        newX = 0.2 * x - 0.26 * y;
        newY = 0.23 * x + 0.22 * y + 1.6;
      } else {
        newX = -0.15 * x + 0.28 * y;
        newY = 0.26 * x + 0.24 * y + 0.44;
      }
      
      x = newX;
      y = newY;
      
      const screenX = width / 2 + x * 60;
      const screenY = height - y * 60;
      
      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        ctx.fillRect(screenX, screenY, 1, 1);
      }
      
      if (i % 1000 === 0) {
        setCurrentIteration(Math.floor((i / points) * 100));
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    const endTime = Date.now();
    setStats(prev => ({
      ...prev,
      generationTime: endTime - startTime,
      totalPixels: points,
      lastFractal: 'Barnsley Fern',
      complexity: settings.iterations
    }));
  };

  // Generate fractal based on type
  const generateFractal = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setCurrentIteration(0);
    generationRef.current = true;
    
    try {
      switch (fractalType) {
        case 'mandelbrot':
          await generateMandelbrot();
          break;
        case 'julia':
          await generateJulia();
          break;
        case 'sierpinski':
          await generateSierpinski();
          break;
        case 'koch':
          await generateKoch();
          break;
        case 'tree':
          await generateTree();
          break;
        case 'fern':
          await generateFern();
          break;
      }
    } catch (error) {
      console.error('Error generating fractal:', error);
    } finally {
      setIsGenerating(false);
      generationRef.current = false;
      setCurrentIteration(100);
    }
  };

  // Download canvas as image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${fractalType}-fractal.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Reset settings
  const resetSettings = () => {
    setSettings({
      iterations: 100,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      colorScheme: 'rainbow',
      animationSpeed: 50
    });
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    setCurrentIteration(0);
  };

  // Auto-generate on settings change
  useEffect(() => {
    if (!isGenerating) {
      const timer = setTimeout(() => {
        generateFractal();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [fractalType, settings.iterations, settings.zoom, settings.colorScheme]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Fractal Generator</h1>
              <p className="text-purple-100">Generate beautiful mathematical fractals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{currentIteration}%</div>
                <div className="text-sm text-purple-100">Progress</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.complexity}</div>
                <div className="text-sm text-purple-100">Complexity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Fractal Type */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Fractal:</label>
                <select
                  value={fractalType}
                  onChange={(e) => setFractalType(e.target.value as FractalType)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isGenerating}
                >
                  <option value="mandelbrot">Mandelbrot Set</option>
                  <option value="julia">Julia Set</option>
                  <option value="sierpinski">Sierpinski Triangle</option>
                  <option value="koch">Koch Snowflake</option>
                  <option value="tree">Fractal Tree</option>
                  <option value="fern">Barnsley Fern</option>
                </select>
              </div>

              {/* Iterations */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Iterations:</label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={settings.iterations}
                  onChange={(e) => setSettings(prev => ({ ...prev, iterations: Number(e.target.value) }))}
                  className="w-20"
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-600 w-12">{settings.iterations}</span>
              </div>

              {/* Color Scheme */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Colors:</label>
                <select
                  value={settings.colorScheme}
                  onChange={(e) => setSettings(prev => ({ ...prev, colorScheme: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isGenerating}
                >
                  <option value="rainbow">Rainbow</option>
                  <option value="fire">Fire</option>
                  <option value="ice">Ice</option>
                  <option value="electric">Electric</option>
                  <option value="grayscale">Grayscale</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Zoom (for Mandelbrot/Julia) */}
              {(fractalType === 'mandelbrot' || fractalType === 'julia') && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Zoom:</label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={settings.zoom}
                    onChange={(e) => setSettings(prev => ({ ...prev, zoom: Number(e.target.value) }))}
                    className="w-20"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-600 w-12">{settings.zoom.toFixed(1)}x</span>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={generateFractal}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isGenerating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>

              <button
                onClick={downloadImage}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                onClick={clearCanvas}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>

              <button
                onClick={resetSettings}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
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
              <h3 className="font-semibold text-gray-800 mb-4">Fractal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Fractal: {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)}</h4>
                  <div className="text-gray-600 space-y-1">
                    {fractalType === 'mandelbrot' && (
                      <>
                        <p>• Named after Benoit Mandelbrot</p>
                        <p>• Formula: z = z² + c</p>
                        <p>• Complex number iteration</p>
                        <p>• Self-similar at all scales</p>
                      </>
                    )}
                    {fractalType === 'julia' && (
                      <>
                        <p>• Named after Gaston Julia</p>
                        <p>• Related to Mandelbrot set</p>
                        <p>• Fixed constant c = -0.7 + 0.27015i</p>
                        <p>• Beautiful connected patterns</p>
                      </>
                    )}
                    {fractalType === 'sierpinski' && (
                      <>
                        <p>• Named after Wacław Sierpiński</p>
                        <p>• Self-similar triangle subdivision</p>
                        <p>• Infinite perimeter, zero area</p>
                        <p>• Hausdorff dimension ≈ 1.585</p>
                      </>
                    )}
                    {fractalType === 'koch' && (
                      <>
                        <p>• Named after Helge von Koch</p>
                        <p>• Infinite length, finite area</p>
                        <p>• Self-similar at all scales</p>
                        <p>• Fractal dimension ≈ 1.26</p>
                      </>
                    )}
                    {fractalType === 'tree' && (
                      <>
                        <p>• Recursive branching pattern</p>
                        <p>• Models natural tree growth</p>
                        <p>• Binary branching system</p>
                        <p>• Color gradient by depth</p>
                      </>
                    )}
                    {fractalType === 'fern' && (
                      <>
                        <p>• Named after Michael Barnsley</p>
                        <p>• Iterated function system</p>
                        <p>• Models natural fern leaves</p>
                        <p>• Probabilistic generation</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Tips</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Higher iterations = more detail</li>
                    <li>• Try different color schemes</li>
                    <li>• Zoom in for Mandelbrot/Julia sets</li>
                    <li>• Download high-quality images</li>
                    <li>• Each fractal shows infinite complexity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800">Generating {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)} Fractal</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-purple-600 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${currentIteration}%` }}
                >
                  <span className="text-white text-xs font-semibold">{currentIteration}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4 flex justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border border-gray-300 rounded shadow-lg bg-black"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generation Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                Generation Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Fractal:</span>
                  <span className="font-semibold">{stats.lastFractal || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Generation Time:</span>
                  <span className="font-semibold">{stats.generationTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity Level:</span>
                  <span className="font-semibold">{stats.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Canvas Size:</span>
                  <span className="font-semibold">{width} × {height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold">{currentIteration}%</span>
                </div>
              </div>
            </div>

            {/* Settings Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-600" />
                Current Settings
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fractal Type:</span>
                  <span className="font-semibold capitalize">{fractalType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Iterations:</span>
                  <span className="font-semibold">{settings.iterations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color Scheme:</span>
                  <span className="font-semibold capitalize">{settings.colorScheme}</span>
                </div>
                {(fractalType === 'mandelbrot' || fractalType === 'julia') && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zoom Level:</span>
                    <span className="font-semibold">{settings.zoom.toFixed(1)}x</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold">
                    {isGenerating ? 'Generating...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Information */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              About Fractals
            </h3>
            <p className="text-sm text-gray-600">
              Fractals are infinitely complex patterns that repeat at every scale. They are created by repeating simple 
              mathematical processes and are found everywhere in nature - from coastlines and mountains to clouds and 
              blood vessels. Each fractal type demonstrates different mathematical concepts and visual beauty through 
              self-similarity and recursive patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractalGenerator; 