import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle, 
  Settings, 
  BarChart3, 
  Zap, 
  Info,
  TrendingUp,
  Timer,
  Activity
} from 'lucide-react';

interface SortingBar {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  isPivot: boolean;
}

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'radix';

interface SortingStats {
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
  isStable: boolean;
  description: string;
}

const SortingVisualizer: React.FC = () => {
  const [bars, setBars] = useState<SortingBar[]>([]);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [arraySize, setArraySize] = useState(50);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef<(() => Promise<void>)[]>([]);
  const stepIndexRef = useRef(0);

  // Algorithm information
  const algorithmInfo: Record<SortingAlgorithm, SortingStats> = {
    bubble: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      isStable: true,
      description: 'Compares adjacent elements and swaps them if they are in wrong order'
    },
    selection: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      isStable: false,
      description: 'Finds minimum element and places it at the beginning'
    },
    insertion: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      isStable: true,
      description: 'Builds the final sorted array one item at a time'
    },
    merge: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      isStable: true,
      description: 'Divides array into halves and merges them in sorted order'
    },
    quick: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      isStable: false,
      description: 'Picks a pivot and partitions array around it'
    },
    heap: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      isStable: false,
      description: 'Uses heap data structure to find maximum element'
    },
    radix: {
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(d × (n + k))',
      spaceComplexity: 'O(n + k)',
      isStable: true,
      description: 'Sorts by processing individual digits'
    }
  };

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const newBars: SortingBar[] = [];
    for (let i = 0; i < arraySize; i++) {
      newBars.push({
        value: Math.floor(Math.random() * 400) + 10,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
        isPivot: false
      });
    }
    setBars(newBars);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setElapsedTime(0);
    stepsRef.current = [];
    stepIndexRef.current = 0;
  }, [arraySize]);

  // Helper function to create animation step
  const createStep = (
    indices: number[],
    type: 'compare' | 'swap' | 'pivot' | 'sorted' | 'reset',
    values?: number[]
  ) => {
    return () => new Promise<void>((resolve) => {
      setBars(prevBars => {
        const newBars = [...prevBars];
        
        // Reset all states first if needed
        if (type === 'reset') {
          newBars.forEach(bar => {
            bar.isComparing = false;
            bar.isSwapping = false;
            bar.isPivot = false;
          });
        }
        
        // Apply new states
        indices.forEach((index, i) => {
          if (index >= 0 && index < newBars.length) {
            switch (type) {
              case 'compare':
                newBars[index].isComparing = true;
                break;
              case 'swap':
                newBars[index].isSwapping = true;
                if (values && values[i] !== undefined) {
                  newBars[index].value = values[i];
                }
                break;
              case 'pivot':
                newBars[index].isPivot = true;
                break;
              case 'sorted':
                newBars[index].isSorted = true;
                break;
            }
          }
        });
        
        return newBars;
      });
      
      // Update counters
      if (type === 'compare') {
        setComparisons(prev => prev + 1);
      } else if (type === 'swap') {
        setSwaps(prev => prev + 1);
      }
      
      setTimeout(resolve, animationSpeed);
    });
  };

  // Bubble Sort
  const bubbleSort = (arr: SortingBar[]) => {
    const steps: (() => Promise<void>)[] = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        steps.push(createStep([j, j + 1], 'compare'));
        
        if (arr[j].value > arr[j + 1].value) {
          // Swap elements
          steps.push(createStep([j, j + 1], 'swap', [arr[j + 1].value, arr[j].value]));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
        
        // Reset comparison
        steps.push(createStep([j, j + 1], 'reset'));
      }
      // Mark as sorted
      steps.push(createStep([n - i - 1], 'sorted'));
    }
    
    // Mark first element as sorted
    steps.push(createStep([0], 'sorted'));
    
    return steps;
  };

  // Selection Sort
  const selectionSort = (arr: SortingBar[]) => {
    const steps: (() => Promise<void>)[] = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      steps.push(createStep([minIndex], 'pivot'));
      
      for (let j = i + 1; j < n; j++) {
        steps.push(createStep([j, minIndex], 'compare'));
        
        if (arr[j].value < arr[minIndex].value) {
          steps.push(createStep([minIndex], 'reset'));
          minIndex = j;
          steps.push(createStep([minIndex], 'pivot'));
        }
        
        steps.push(createStep([j], 'reset'));
      }
      
      if (minIndex !== i) {
        steps.push(createStep([i, minIndex], 'swap', [arr[minIndex].value, arr[i].value]));
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
      
      steps.push(createStep([minIndex, i], 'reset'));
      steps.push(createStep([i], 'sorted'));
    }
    
    steps.push(createStep([n - 1], 'sorted'));
    return steps;
  };

  // Insertion Sort
  const insertionSort = (arr: SortingBar[]) => {
    const steps: (() => Promise<void>)[] = [];
    const n = arr.length;
    
    steps.push(createStep([0], 'sorted'));
    
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      
      steps.push(createStep([i], 'pivot'));
      
      while (j >= 0) {
        steps.push(createStep([j, j + 1], 'compare'));
        
        if (arr[j].value <= key.value) break;
        
        steps.push(createStep([j + 1], 'swap', [arr[j].value]));
        arr[j + 1] = arr[j];
        j--;
      }
      
      steps.push(createStep([j + 1], 'swap', [key.value]));
      arr[j + 1] = key;
      
      steps.push(createStep([i], 'reset'));
      steps.push(createStep([j + 1], 'sorted'));
    }
    
    return steps;
  };

  // Quick Sort
  const quickSort = (arr: SortingBar[], low = 0, high = arr.length - 1, steps: (() => Promise<void>)[] = []) => {
    if (low < high) {
      const pi = partition(arr, low, high, steps);
      quickSort(arr, low, pi - 1, steps);
      quickSort(arr, pi + 1, high, steps);
    }
    return steps;
  };

  const partition = (arr: SortingBar[], low: number, high: number, steps: (() => Promise<void>)[]) => {
    const pivot = arr[high];
    steps.push(createStep([high], 'pivot'));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      steps.push(createStep([j, high], 'compare'));
      
      if (arr[j].value < pivot.value) {
        i++;
        if (i !== j) {
          steps.push(createStep([i, j], 'swap', [arr[j].value, arr[i].value]));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      
      steps.push(createStep([j], 'reset'));
    }
    
    steps.push(createStep([i + 1, high], 'swap', [arr[high].value, arr[i + 1].value]));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    steps.push(createStep([high], 'reset'));
    steps.push(createStep([i + 1], 'sorted'));
    
    return i + 1;
  };

  // Merge Sort
  const mergeSort = (arr: SortingBar[], left = 0, right = arr.length - 1, steps: (() => Promise<void>)[] = []) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(arr, left, mid, steps);
      mergeSort(arr, mid + 1, right, steps);
      merge(arr, left, mid, right, steps);
    }
    return steps;
  };

  const merge = (arr: SortingBar[], left: number, mid: number, right: number, steps: (() => Promise<void>)[]) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      steps.push(createStep([left + i, mid + 1 + j], 'compare'));
      
      if (leftArr[i].value <= rightArr[j].value) {
        steps.push(createStep([k], 'swap', [leftArr[i].value]));
        arr[k] = leftArr[i];
        i++;
      } else {
        steps.push(createStep([k], 'swap', [rightArr[j].value]));
        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArr.length) {
      steps.push(createStep([k], 'swap', [leftArr[i].value]));
      arr[k] = leftArr[i];
      i++;
      k++;
    }
    
    while (j < rightArr.length) {
      steps.push(createStep([k], 'swap', [rightArr[j].value]));
      arr[k] = rightArr[j];
      j++;
      k++;
    }
    
    // Mark sorted
    for (let idx = left; idx <= right; idx++) {
      steps.push(createStep([idx], 'sorted'));
    }
  };

  // Execute sorting algorithm
  const startSorting = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setStartTime(Date.now());
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    
    const arrCopy = [...bars];
    let steps: (() => Promise<void>)[] = [];
    
    switch (algorithm) {
      case 'bubble':
        steps = bubbleSort(arrCopy);
        break;
      case 'selection':
        steps = selectionSort(arrCopy);
        break;
      case 'insertion':
        steps = insertionSort(arrCopy);
        break;
      case 'merge':
        steps = mergeSort(arrCopy);
        break;
      case 'quick':
        steps = quickSort(arrCopy);
        break;
      default:
        steps = bubbleSort(arrCopy);
    }
    
    stepsRef.current = steps;
    setTotalSteps(steps.length);
    stepIndexRef.current = 0;
    
    executeSteps();
  };

  const executeSteps = async () => {
    while (stepIndexRef.current < stepsRef.current.length && isRunning && !isPaused) {
      await stepsRef.current[stepIndexRef.current]();
      setCurrentStep(stepIndexRef.current + 1);
      stepIndexRef.current++;
    }
    
    if (stepIndexRef.current >= stepsRef.current.length) {
      setIsRunning(false);
      setElapsedTime(Date.now() - (startTime || 0));
    }
  };

  const pauseResume = () => {
    setIsPaused(!isPaused);
  };

  const stopSorting = () => {
    setIsRunning(false);
    setIsPaused(false);
    generateRandomArray();
  };

  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Continue execution when resumed
  useEffect(() => {
    if (isRunning && !isPaused && stepIndexRef.current < stepsRef.current.length) {
      executeSteps();
    }
  }, [isPaused, isRunning]);

  // Initialize array
  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const getBarColor = (bar: SortingBar) => {
    if (bar.isSorted) return 'bg-green-500';
    if (bar.isPivot) return 'bg-orange-500';
    if (bar.isSwapping) return 'bg-red-500';
    if (bar.isComparing) return 'bg-yellow-500';
    return 'bg-blue-400';
  };

  const getAlgorithmColor = (algo: SortingAlgorithm) => {
    const colors = {
      bubble: 'bg-red-500',
      selection: 'bg-orange-500',
      insertion: 'bg-yellow-500',
      merge: 'bg-green-500',
      quick: 'bg-blue-500',
      heap: 'bg-purple-500',
      radix: 'bg-pink-500'
    };
    return colors[algo];
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sorting Visualizer</h1>
              <p className="text-purple-100">Watch sorting algorithms in action</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-bold">{comparisons}</div>
                <div className="text-sm text-purple-100">Comparisons</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{swaps}</div>
                <div className="text-sm text-purple-100">Swaps</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(elapsedTime / 1000)}s</div>
                <div className="text-sm text-purple-100">Time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Algorithm Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Algorithm:</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  disabled={isRunning}
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                </select>
              </div>

              {/* Array Size */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Size:</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-20"
                  disabled={isRunning}
                />
                <span className="text-sm text-gray-600">{arraySize}</span>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{animationSpeed}ms</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Action Buttons */}
              <button
                onClick={startSorting}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Sorting
              </button>

              <button
                onClick={pauseResume}
                disabled={!isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={stopSorting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={generateRandomArray}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {currentStep}/{totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort</h3>
              <span className={`px-2 py-1 rounded-full text-xs text-white ${getAlgorithmColor(algorithm)}`}>
                {algorithmInfo[algorithm].timeComplexity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{algorithmInfo[algorithm].description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Time:</span>
                <span className="ml-2 font-medium">{algorithmInfo[algorithm].timeComplexity}</span>
              </div>
              <div>
                <span className="text-gray-500">Space:</span>
                <span className="ml-2 font-medium">{algorithmInfo[algorithm].spaceComplexity}</span>
              </div>
              <div>
                <span className="text-gray-500">Stable:</span>
                <span className={`ml-2 font-medium ${algorithmInfo[algorithm].isStable ? 'text-green-600' : 'text-red-600'}`}>
                  {algorithmInfo[algorithm].isStable ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">In-place:</span>
                <span className="ml-2 font-medium text-green-600">
                  {['bubble', 'selection', 'insertion', 'heap'].includes(algorithm) ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-end justify-center">
              <div className="flex items-end gap-1" style={{ width: `${arraySize * 8}px` }}>
                {bars.map((bar, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-200 ${getBarColor(bar)} rounded-t-sm`}
                    style={{
                      height: `${bar.value}px`,
                      width: `${Math.max(800 / arraySize - 1, 3)}px`,
                      minWidth: '2px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Legend and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                Color Legend
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Pivot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Sorted</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                Performance Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Array Size:</span>
                  <span className="font-semibold">{arraySize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comparisons:</span>
                  <span className="font-semibold text-blue-600">{comparisons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Swaps:</span>
                  <span className="font-semibold text-red-600">{swaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Elapsed:</span>
                  <span className="font-semibold text-green-600">{Math.round(elapsedTime / 1000)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    isRunning ? (isPaused ? 'text-yellow-600' : 'text-blue-600') : 'text-gray-600'
                  }`}>
                    {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              Algorithm Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Algorithm</th>
                    <th className="text-left py-2">Best Case</th>
                    <th className="text-left py-2">Average Case</th>
                    <th className="text-left py-2">Worst Case</th>
                    <th className="text-left py-2">Space</th>
                    <th className="text-left py-2">Stable</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bubble Sort</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Selection Sort</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2 text-red-600">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Insertion Sort</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Merge Sort</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2 text-green-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Quick Sort</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(log n)</td>
                    <td className="py-2 text-red-600">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer; 