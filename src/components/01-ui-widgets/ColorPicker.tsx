import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, Copy, Check, RotateCcw, Pipette } from 'lucide-react';

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: ColorValue) => void;
  onConfirm?: (color: ColorValue) => void;
  showPresets?: boolean;
  showAlpha?: boolean;
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv';
  presetColors?: string[];
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface ColorPickerDemoProps {}

// Utility functions for color conversions
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
};

const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  v /= 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const createColorValue = (hex: string): ColorValue => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  return { hex, rgb, hsl, hsv };
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = '#3b82f6',
  onChange,
  onConfirm,
  showPresets = true,
  showAlpha = false,
  format = 'hex',
  presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#000000', '#374151', '#6b7280',
    '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff'
  ],
  disabled = false,
  size = 'md'
}) => {
  const [currentColor, setCurrentColor] = useState<ColorValue>(() => 
    createColorValue(initialColor)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(currentColor.hsv.h);
  const [saturation, setSaturation] = useState(currentColor.hsv.s);
  const [value, setValue] = useState(currentColor.hsv.v);
  const [alpha, setAlpha] = useState(100);
  const [isDragging, setIsDragging] = useState<'hue' | 'sv' | 'alpha' | null>(null);
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState(currentColor.hex);

  const containerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const updateColor = useCallback((h: number, s: number, v: number) => {
    const rgb = hsvToRgb(h, s, v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const newColor = createColorValue(hex);
    setCurrentColor(newColor);
    setInputValue(hex);
    onChange?.(newColor);
  }, [onChange]);

  useEffect(() => {
    updateColor(hue, saturation, value);
  }, [hue, saturation, value, updateColor]);

  const handleMouseDown = (type: 'hue' | 'sv' | 'alpha', event: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(type);
    handleMouseMove(type, event);
  };

  const handleMouseMove = (type: 'hue' | 'sv' | 'alpha', event: React.MouseEvent | MouseEvent) => {
    if (disabled) return;
    
    if (type === 'hue' && hueRef.current) {
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const newHue = (x / rect.width) * 360;
      setHue(newHue);
    } else if (type === 'sv' && svRef.current) {
      const rect = svRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
      const newSaturation = (x / rect.width) * 100;
      const newValue = 100 - (y / rect.height) * 100;
      setSaturation(newSaturation);
      setValue(newValue);
    } else if (type === 'alpha' && alphaRef.current) {
      const rect = alphaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const newAlpha = (x / rect.width) * 100;
      setAlpha(newAlpha);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(isDragging, event);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (color: string) => {
    const newColor = createColorValue(color);
    setCurrentColor(newColor);
    setHue(newColor.hsv.h);
    setSaturation(newColor.hsv.s);
    setValue(newColor.hsv.v);
    setInputValue(color);
    onChange?.(newColor);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const newColor = createColorValue(value);
      setCurrentColor(newColor);
      setHue(newColor.hsv.h);
      setSaturation(newColor.hsv.s);
      setValue(newColor.hsv.v);
      onChange?.(newColor);
    }
  };

  const copyToClipboard = async () => {
    try {
      let textToCopy = currentColor.hex;
      if (format === 'rgb') {
        textToCopy = `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`;
      } else if (format === 'hsl') {
        textToCopy = `hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`;
      } else if (format === 'hsv') {
        textToCopy = `hsv(${currentColor.hsv.h}, ${currentColor.hsv.s}%, ${currentColor.hsv.v}%)`;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const resetColor = () => {
    const defaultColor = createColorValue(initialColor);
    setCurrentColor(defaultColor);
    setHue(defaultColor.hsv.h);
    setSaturation(defaultColor.hsv.s);
    setValue(defaultColor.hsv.v);
    setInputValue(initialColor);
    onChange?.(defaultColor);
  };

  const formatColorValue = () => {
    switch (format) {
      case 'rgb':
        return `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`;
      case 'hsl':
        return `hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`;
      case 'hsv':
        return `hsv(${currentColor.hsv.h}, ${currentColor.hsv.s}%, ${currentColor.hsv.v}%)`;
      default:
        return currentColor.hex;
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]} border-2 border-gray-300 rounded-lg shadow-sm 
          transition-all duration-200 hover:shadow-md focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ backgroundColor: currentColor.hex }}
        aria-label={`Color picker, current color: ${formatColorValue()}`}
      />

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-80">
          {/* Saturation/Value Area */}
          <div
            ref={svRef}
            className="relative w-full h-48 rounded-lg cursor-crosshair overflow-hidden"
            style={{
              background: `linear-gradient(to right, #ffffff, hsl(${hue}, 100%, 50%)), 
                          linear-gradient(to bottom, transparent, #000000)`
            }}
            onMouseDown={(e) => handleMouseDown('sv', e)}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none transform -translate-x-2 -translate-y-2"
              style={{
                left: `${saturation}%`,
                top: `${100 - value}%`
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="mt-4">
            <div
              ref={hueRef}
              className="relative w-full h-4 rounded-lg cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
              onMouseDown={(e) => handleMouseDown('hue', e)}
            >
              <div
                className="absolute w-4 h-6 bg-white border-2 border-gray-300 rounded shadow-md pointer-events-none transform -translate-x-2 -translate-y-1"
                style={{ left: `${(hue / 360) * 100}%` }}
              />
            </div>
          </div>

          {/* Alpha Slider */}
          {showAlpha && (
            <div className="mt-4">
              <div
                ref={alphaRef}
                className="relative w-full h-4 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, transparent, ${currentColor.hex}), 
                              repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, #fff 2px, #fff 4px)`
                }}
                onMouseDown={(e) => handleMouseDown('alpha', e)}
              >
                <div
                  className="absolute w-4 h-6 bg-white border-2 border-gray-300 rounded shadow-md pointer-events-none transform -translate-x-2 -translate-y-1"
                  style={{ left: `${alpha}%` }}
                />
              </div>
            </div>
          )}

          {/* Color Value Input */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3b82f6"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Copy color"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={resetColor}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Reset to default"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Color Format Display */}
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm font-mono text-gray-700">
            {formatColorValue()}
          </div>

          {/* Preset Colors */}
          {showPresets && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presets
              </label>
              <div className="grid grid-cols-8 gap-1">
                {presetColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(color)}
                    className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm?.(currentColor);
                setIsOpen(false);
              }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ColorPickerDemo: React.FC<ColorPickerDemoProps> = () => {
  const [selectedColor, setSelectedColor] = useState<ColorValue>(
    createColorValue('#3b82f6')
  );
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl' | 'hsv'>('hex');
  const [showPresets, setShowPresets] = useState(true);
  const [showAlpha, setShowAlpha] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [disabled, setDisabled] = useState(false);

  const customPresets = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Color Picker</h1>
              <p className="text-gray-600">Advanced color selection with HSV color space</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Color Picker:</label>
                  <ColorPicker
                    initialColor={selectedColor.hex}
                    onChange={setSelectedColor}
                    format={format}
                    showPresets={showPresets}
                    showAlpha={showAlpha}
                    size={size}
                    disabled={disabled}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Color:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">HEX:</span>
                      <span className="font-mono ml-2">{selectedColor.hex}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">RGB:</span>
                      <span className="font-mono ml-2">
                        ({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">HSL:</span>
                      <span className="font-mono ml-2">
                        ({selectedColor.hsl.h}, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">HSV:</span>
                      <span className="font-mono ml-2">
                        ({selectedColor.hsv.h}, {selectedColor.hsv.s}%, {selectedColor.hsv.v}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div 
                  className="w-full h-24 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hex">HEX</option>
                    <option value="rgb">RGB</option>
                    <option value="hsl">HSL</option>
                    <option value="hsv">HSV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showPresets}
                      onChange={(e) => setShowPresets(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show Presets</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showAlpha}
                      onChange={(e) => setShowAlpha(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show Alpha Channel</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={disabled}
                      onChange={(e) => setDisabled(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Disabled</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Different Variants */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Basic</h3>
                <div className="flex items-center space-x-2">
                  <ColorPicker initialColor="#ef4444" />
                  <span className="text-sm text-gray-600">Simple color picker</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">With Alpha</h3>
                <div className="flex items-center space-x-2">
                  <ColorPicker initialColor="#22c55e" showAlpha={true} />
                  <span className="text-sm text-gray-600">With transparency</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Presets</h3>
                <div className="flex items-center space-x-2">
                  <ColorPicker 
                    initialColor="#8b5cf6" 
                    presetColors={customPresets}
                  />
                  <span className="text-sm text-gray-600">Custom palette</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">HSV Color Space</h3>
                  <p className="text-sm text-gray-600">Professional color selection with hue, saturation, and value controls</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Multiple Formats</h3>
                  <p className="text-sm text-gray-600">Support for HEX, RGB, HSL, and HSV color formats</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alpha Channel</h3>
                  <p className="text-sm text-gray-600">Optional transparency control for advanced color management</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Preset Colors</h3>
                  <p className="text-sm text-gray-600">Customizable color presets for quick selection</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Keyboard Support</h3>
                  <p className="text-sm text-gray-600">Full keyboard navigation and accessibility support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Copy to Clipboard</h3>
                  <p className="text-sm text-gray-600">One-click color value copying in selected format</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerDemo; 