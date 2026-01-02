import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X,
  AlertCircle,
  ChevronRight,
  Download,
  Upload,
  Loader2,
  Clock,
  Zap
} from 'lucide-react';

interface ProgressIndicatorProps {
  value?: number;
  max?: number;
  variant?: 'linear' | 'circular' | 'steps';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  animated?: boolean;
  striped?: boolean;
  showLabel?: boolean;
  label?: string;
  steps?: string[];
  currentStep?: number;
  className?: string;
}

/**
 * Progress Indicator Component
 * 
 * Features:
 * - Linear, circular, and step-based progress bars
 * - Multiple sizes and colors
 * - Animated and striped variants
 * - Custom labels and formatting
 * - Step indicators with status
 * - Real-time progress simulation
 * - Completion states
 * - Responsive design
 * - Accessibility support
 */
const ProgressIndicatorDemo: React.FC = () => {
  const [linearProgress, setLinearProgress] = useState(45);
  const [circularProgress, setCircularProgress] = useState(75);
  const [stepProgress, setStepProgress] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [variant, setVariant] = useState<'linear' | 'circular' | 'steps'>('linear');
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [color, setColor] = useState<'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo'>('blue');
  const [animated, setAnimated] = useState(true);
  const [striped, setStriped] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  const steps = [
    'Initialize Project',
    'Install Dependencies',
    'Configure Settings',
    'Build Application',
    'Run Tests',
    'Deploy to Production'
  ];

  const simulateProgress = () => {
    setIsAnimating(true);
    setLinearProgress(0);
    setCircularProgress(0);
    setStepProgress(0);

    const interval = setInterval(() => {
      setLinearProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnimating(false);
          return 100;
        }
        return prev + 2;
      });

      setCircularProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });

      setStepProgress(prev => {
        const newStep = Math.floor((linearProgress / 100) * steps.length);
        return Math.min(newStep, steps.length - 1);
      });
    }, 100);

    return () => clearInterval(interval);
  };

  const resetProgress = () => {
    setLinearProgress(45);
    setCircularProgress(75);
    setStepProgress(2);
    setIsAnimating(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Progress Indicator Component</h1>
          <p className="text-gray-600">
            Flexible progress bars with linear, circular, and step-based variants
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Variant:</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linear">Linear</option>
              <option value="circular">Circular</option>
              <option value="steps">Steps</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="purple">Purple</option>
              <option value="indigo">Indigo</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={animated}
              onChange={(e) => setAnimated(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Animated</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={striped}
              onChange={(e) => setStriped(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Striped</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showLabel}
              onChange={(e) => setShowLabel(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Label</span>
          </label>

          <div className="flex items-center space-x-2">
            <button
              onClick={simulateProgress}
              disabled={isAnimating}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <Play className="h-3 w-3" />
              <span>Simulate</span>
            </button>
            <button
              onClick={resetProgress}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Progress Indicators</h2>
          
          {/* Linear Progress */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Linear Progress Bars</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Basic Progress Bar
                  </label>
                  <ProgressIndicatorComponent
                    value={linearProgress}
                    max={100}
                    variant="linear"
                    size={size}
                    color={color}
                    animated={animated}
                    striped={striped}
                    showLabel={showLabel}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Download Progress
                  </label>
                  <ProgressIndicatorComponent
                    value={linearProgress * 0.8}
                    max={100}
                    variant="linear"
                    size="sm"
                    color="green"
                    animated={true}
                    showLabel={true}
                    label="Downloading..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Progress
                  </label>
                  <ProgressIndicatorComponent
                    value={linearProgress * 1.2}
                    max={100}
                    variant="linear"
                    size="lg"
                    color="purple"
                    animated={true}
                    striped={true}
                    showLabel={true}
                    label="Uploading files..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Error State
                  </label>
                  <ProgressIndicatorComponent
                    value={30}
                    max={100}
                    variant="linear"
                    size="md"
                    color="red"
                    showLabel={true}
                    label="Upload failed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Warning State
                  </label>
                  <ProgressIndicatorComponent
                    value={85}
                    max={100}
                    variant="linear"
                    size="md"
                    color="yellow"
                    showLabel={true}
                    label="Nearing limit"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Completed
                  </label>
                  <ProgressIndicatorComponent
                    value={100}
                    max={100}
                    variant="linear"
                    size="md"
                    color="green"
                    showLabel={true}
                    label="Complete!"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Circular Progress Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <ProgressIndicatorComponent
                  value={circularProgress}
                  max={100}
                  variant="circular"
                  size="lg"
                  color={color}
                  animated={animated}
                  showLabel={showLabel}
                />
                <p className="text-sm text-gray-600">Main Progress</p>
              </div>

              <div className="text-center space-y-2">
                <ProgressIndicatorComponent
                  value={circularProgress * 0.7}
                  max={100}
                  variant="circular"
                  size="md"
                  color="green"
                  animated={true}
                  showLabel={true}
                />
                <p className="text-sm text-gray-600">Download</p>
              </div>

              <div className="text-center space-y-2">
                <ProgressIndicatorComponent
                  value={circularProgress * 1.1}
                  max={100}
                  variant="circular"
                  size="md"
                  color="purple"
                  animated={true}
                  showLabel={true}
                />
                <p className="text-sm text-gray-600">Processing</p>
              </div>

              <div className="text-center space-y-2">
                <ProgressIndicatorComponent
                  value={100}
                  max={100}
                  variant="circular"
                  size="md"
                  color="green"
                  showLabel={true}
                />
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Step Progress Indicator</h3>
            <div className="max-w-4xl mx-auto">
              <ProgressIndicatorComponent
                variant="steps"
                steps={steps}
                currentStep={stepProgress}
                size={size}
                color={color}
                animated={animated}
                showLabel={showLabel}
              />
            </div>
          </div>

          {/* Real-world Examples */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Real-world Examples</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">File Downloads</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>document.pdf</span>
                        <span>80%</span>
                      </div>
                      <ProgressIndicatorComponent
                        value={80}
                        max={100}
                        variant="linear"
                        size="sm"
                        color="blue"
                        animated={true}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>image.jpg</span>
                        <span>100%</span>
                      </div>
                      <ProgressIndicatorComponent
                        value={100}
                        max={100}
                        variant="linear"
                        size="sm"
                        color="green"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>video.mp4</span>
                        <span>45%</span>
                      </div>
                      <ProgressIndicatorComponent
                        value={45}
                        max={100}
                        variant="linear"
                        size="sm"
                        color="purple"
                        animated={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-gray-900">System Status</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <ProgressIndicatorComponent
                        value={85}
                        max={100}
                        variant="circular"
                        size="md"
                        color="green"
                        showLabel={true}
                      />
                      <p className="text-xs text-gray-600 mt-1">CPU Usage</p>
                    </div>
                    <div className="text-center">
                      <ProgressIndicatorComponent
                        value={60}
                        max={100}
                        variant="circular"
                        size="md"
                        color="blue"
                        showLabel={true}
                      />
                      <p className="text-xs text-gray-600 mt-1">Memory</p>
                    </div>
                    <div className="text-center">
                      <ProgressIndicatorComponent
                        value={90}
                        max={100}
                        variant="circular"
                        size="md"
                        color="yellow"
                        showLabel={true}
                      />
                      <p className="text-xs text-gray-600 mt-1">Disk Usage</p>
                    </div>
                    <div className="text-center">
                      <ProgressIndicatorComponent
                        value={40}
                        max={100}
                        variant="circular"
                        size="md"
                        color="purple"
                        showLabel={true}
                      />
                      <p className="text-xs text-gray-600 mt-1">Network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Variant:</span>
              <div className="font-medium capitalize">{variant}</div>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <div className="font-medium capitalize">{size}</div>
            </div>
            <div>
              <span className="text-gray-600">Color:</span>
              <div className="font-medium capitalize">{color}</div>
            </div>
            <div>
              <span className="text-gray-600">Animated:</span>
              <div className="font-medium">{animated ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="text-gray-600">Striped:</span>
              <div className="font-medium">{striped ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="text-gray-600">Labels:</span>
              <div className="font-medium">{showLabel ? 'Shown' : 'Hidden'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressIndicatorComponent: React.FC<ProgressIndicatorProps> = ({
  value = 0,
  max = 100,
  variant = 'linear',
  size = 'md',
  color = 'blue',
  animated = false,
  striped = false,
  showLabel = false,
  label,
  steps = [],
  currentStep = 0,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getColorClasses = (colorName: string) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-600',
      purple: 'bg-purple-600',
      indigo: 'bg-indigo-600'
    };
    return colors[colorName as keyof typeof colors] || colors.blue;
  };

  const getSizeClasses = () => {
    if (variant === 'circular') {
      switch (size) {
        case 'sm': return 'w-12 h-12';
        case 'lg': return 'w-20 h-20';
        case 'xl': return 'w-24 h-24';
        default: return 'w-16 h-16';
      }
    } else {
      switch (size) {
        case 'sm': return 'h-1';
        case 'lg': return 'h-4';
        case 'xl': return 'h-6';
        default: return 'h-2';
      }
    }
  };

  if (variant === 'circular') {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative ${getSizeClasses()} ${className}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
          {/* Background circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getColorClasses(color).replace('bg-', 'text-')} ${animated ? 'transition-all duration-300 ease-in-out' : ''}`}
            strokeLinecap="round"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {label || `${Math.round(percentage)}%`}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'steps') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? `${getColorClasses(color)} text-white` 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {showLabel && (
                  <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
                    {step}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${index < currentStep ? getColorClasses(color) : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && (label || percentage > 0) && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">{label || 'Progress'}</span>
          <span className="text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getSizeClasses()}`}>
        <div
          className={`
            ${getSizeClasses()} rounded-full transition-all duration-300 ease-out
            ${getColorClasses(color)}
            ${striped ? 'bg-opacity-75 bg-gradient-to-r from-transparent via-white to-transparent bg-[length:1rem_1rem]' : ''}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicatorDemo; 