import React, { useState, useCallback } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

/**
 * Counter App with Reset
 * 
 * Features:
 * - Increment/Decrement counter
 * - Reset to initial value
 * - Visual feedback for state changes
 * - Keyboard shortcuts support
 * - Disabled states for better UX
 */
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(0), []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          increment();
          break;
        case 'ArrowDown':
          event.preventDefault();
          decrement();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            reset();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [increment, decrement, reset]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Counter App</h1>
          <p className="text-gray-600">
            A simple counter with increment, decrement, and reset functionality
          </p>
        </div>

        {/* Counter Display */}
        <div className="text-center">
          <div className={`text-6xl font-bold transition-all duration-300 ${
            count > 0 ? 'text-green-600' : count < 0 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {count}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Current Value
          </div>
        </div>

        {/* Step Control */}
        <div className="flex items-center justify-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Step:
          </label>
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={decrement}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Minus className="h-5 w-5" />
            <span>Decrement</span>
          </button>

          <button
            onClick={reset}
            disabled={count === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset</span>
          </button>

          <button
            onClick={increment}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            <span>Increment</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCount(prev => prev + 10)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
          >
            +10
          </button>
          <button
            onClick={() => setCount(prev => prev + 100)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
          >
            +100
          </button>
          <button
            onClick={() => setCount(prev => prev - 10)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
          >
            -10
          </button>
          <button
            onClick={() => setCount(prev => prev - 100)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
          >
            -100
          </button>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Keyboard Shortcuts:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑</kbd>
              <span>Increment</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↓</kbd>
              <span>Decrement</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl+R</kbd>
              <span>Reset</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {count >= 0 ? '+' : ''}{count}
            </div>
            <div className="text-xs text-gray-500">Value</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {Math.abs(count)}
            </div>
            <div className="text-xs text-gray-500">Absolute</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {count % 2 === 0 ? 'Even' : 'Odd'}
            </div>
            <div className="text-xs text-gray-500">Parity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter; 