import React, { useState } from 'react';
import { 
  Code,
  Zap,
  MousePointer,
  RefreshCw
} from 'lucide-react';

// Mouse Position Render Prop Component
interface MousePositionProps {
  render: (state: { x: number; y: number }) => React.ReactNode;
}

const MousePosition: React.FC<MousePositionProps> = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} className="h-64 border-2 border-dashed border-gray-300 rounded-lg">
      {render(position)}
    </div>
  );
};

// Counter Render Prop Component
interface CounterProps {
  render: (state: { count: number; increment: () => void; decrement: () => void }) => React.ReactNode;
}

const Counter: React.FC<CounterProps> = ({ render }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);

  return <>{render({ count, increment, decrement })}</>;
};

// Toggle Render Prop Component
interface ToggleProps {
  render: (state: { isOn: boolean; toggle: () => void }) => React.ReactNode;
}

const Toggle: React.FC<ToggleProps> = ({ render }) => {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn(prev => !prev);

  return <>{render({ isOn, toggle })}</>;
};

const RenderPropsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Render Props Pattern Demo</h1>
          <p className="text-lg text-gray-600">
            Explore the Render Props pattern for component composition and code reuse
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mouse Position Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MousePointer className="w-5 h-5 mr-2 text-blue-500" />
            Mouse Position Render Prop
          </h2>
          <MousePosition
            render={({ x, y }) => (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Move your mouse around</p>
                  <p className="text-2xl font-mono">
                    X: {x}, Y: {y}
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Counter Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-green-500" />
            Counter Render Prop
          </h2>
          <Counter
            render={({ count, increment, decrement }) => (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={decrement}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
                <button
                  onClick={increment}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            )}
          />
        </div>

        {/* Toggle Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Toggle Render Prop
          </h2>
          <Toggle
            render={({ isOn, toggle }) => (
              <div className="flex items-center justify-center">
                <button
                  onClick={toggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOn ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-gray-700">
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </div>
            )}
          />
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Render Props Pattern Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are Render Props?</h3>
            <p className="text-gray-600 mb-4">
              The term "render prop" refers to a technique for sharing code between React components using a prop whose value is a function. A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Code reuse between components</li>
              <li>Separation of concerns</li>
              <li>Flexible component composition</li>
              <li>Access to component state and methods</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use TypeScript for better type safety</li>
              <li>Keep render props focused and single-purpose</li>
              <li>Consider performance implications</li>
              <li>Document the expected render prop interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderPropsDemo; 