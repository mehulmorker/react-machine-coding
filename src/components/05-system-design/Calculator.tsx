import React, { useState, useEffect, useCallback } from 'react';
import { 
  Delete, 
  RotateCcw, 
  History, 
  Settings, 
  ChevronUp, 
  ChevronDown,
  Copy,
  Check
} from 'lucide-react';

type CalculatorMode = 'standard' | 'scientific' | 'programmer';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface MemoryEntry {
  value: number;
  timestamp: Date;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [copied, setCopied] = useState(false);

  const addToHistory = useCallback((expression: string, result: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep only last 50 entries
  }, []);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation?: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '=':
          result = inputValue;
          break;
        default:
          return;
      }

      const expression = `${currentValue} ${operation} ${inputValue}`;
      const resultString = String(result);
      
      addToHistory(expression, resultString);
      setDisplay(resultString);
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation || null);
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;
    let expression: string;

    switch (func) {
      case 'sin':
        result = Math.sin(angleUnit === 'deg' ? (inputValue * Math.PI) / 180 : inputValue);
        expression = `sin(${inputValue}${angleUnit === 'deg' ? '°' : ''})`;
        break;
      case 'cos':
        result = Math.cos(angleUnit === 'deg' ? (inputValue * Math.PI) / 180 : inputValue);
        expression = `cos(${inputValue}${angleUnit === 'deg' ? '°' : ''})`;
        break;
      case 'tan':
        result = Math.tan(angleUnit === 'deg' ? (inputValue * Math.PI) / 180 : inputValue);
        expression = `tan(${inputValue}${angleUnit === 'deg' ? '°' : ''})`;
        break;
      case 'log':
        result = Math.log10(inputValue);
        expression = `log(${inputValue})`;
        break;
      case 'ln':
        result = Math.log(inputValue);
        expression = `ln(${inputValue})`;
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        expression = `√(${inputValue})`;
        break;
      case 'square':
        result = inputValue * inputValue;
        expression = `(${inputValue})²`;
        break;
      case 'cube':
        result = inputValue * inputValue * inputValue;
        expression = `(${inputValue})³`;
        break;
      case 'factorial':
        result = inputValue >= 0 && inputValue <= 170 ? factorial(Math.floor(inputValue)) : 0;
        expression = `${Math.floor(inputValue)}!`;
        break;
      case 'reciprocal':
        result = inputValue !== 0 ? 1 / inputValue : 0;
        expression = `1/(${inputValue})`;
        break;
      case 'percentage':
        result = inputValue / 100;
        expression = `${inputValue}%`;
        break;
      default:
        return;
    }

    const resultString = String(result);
    addToHistory(expression, resultString);
    setDisplay(resultString);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const memoryStore = () => {
    const value = parseFloat(display);
    setMemory([{ value, timestamp: new Date() }]);
  };

  const memoryRecall = () => {
    if (memory.length > 0) {
      setDisplay(String(memory[0].value));
      setWaitingForOperand(true);
    }
  };

  const memoryClear = () => {
    setMemory([]);
  };

  const memoryAdd = () => {
    const value = parseFloat(display);
    if (memory.length > 0) {
      setMemory([{ value: memory[0].value + value, timestamp: new Date() }]);
    } else {
      memoryStore();
    }
  };

  const memorySubtract = () => {
    const value = parseFloat(display);
    if (memory.length > 0) {
      setMemory([{ value: memory[0].value - value, timestamp: new Date() }]);
    } else {
      setMemory([{ value: -value, timestamp: new Date() }]);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === '=' || key === 'Enter') {
        performOperation('=');
      } else if (key === 'Escape') {
        clear();
      } else if (key === 'Backspace') {
        deleteLast();
      } else if (key === '%') {
        performScientificOperation('percentage');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const standardButtons = [
    ['MC', 'MR', 'M+', 'M-', 'MS'],
    ['%', 'CE', 'C', '⌫'],
    ['1/x', 'x²', '√x', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['+/-', '0', '.', '=']
  ];

  const scientificButtons = [
    ['2nd', 'π', 'e', 'C', '⌫'],
    ['x²', '1/x', '|x|', 'exp', 'mod'],
    ['√x', '(', ')', 'n!', '÷'],
    ['xʸ', '7', '8', '9', '×'],
    ['log', '4', '5', '6', '-'],
    ['ln', '1', '2', '3', '+'],
    ['sin', 'cos', 'tan', '0', '='],
    [angleUnit, '.', 'Ans', '+/-']
  ];

  const buttonLayout = mode === 'scientific' ? scientificButtons : standardButtons;

  const handleButtonClick = (button: string) => {
    switch (button) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        inputNumber(button);
        break;
      case '.':
        inputDecimal();
        break;
      case '+': case '-': case '×': case '÷':
        performOperation(button);
        break;
      case '=':
        performOperation('=');
        break;
      case 'C':
        clear();
        break;
      case 'CE':
        clearEntry();
        break;
      case '⌫':
        deleteLast();
        break;
      case '%':
      case '1/x':
      case 'x²':
      case '√x':
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'n!':
        performScientificOperation(button === '1/x' ? 'reciprocal' : 
                                 button === 'x²' ? 'square' :
                                 button === '√x' ? 'sqrt' :
                                 button === 'n!' ? 'factorial' :
                                 button === '%' ? 'percentage' : button);
        break;
      case 'MC':
        memoryClear();
        break;
      case 'MR':
        memoryRecall();
        break;
      case 'MS':
        memoryStore();
        break;
      case 'M+':
        memoryAdd();
        break;
      case 'M-':
        memorySubtract();
        break;
      case '+/-':
        setDisplay(String(-parseFloat(display)));
        break;
      case 'π':
        setDisplay(String(Math.PI));
        setWaitingForOperand(true);
        break;
      case 'e':
        setDisplay(String(Math.E));
        setWaitingForOperand(true);
        break;
      case 'deg':
      case 'rad':
        setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg');
        break;
    }
  };

  const getButtonClass = (button: string) => {
    let baseClass = 'h-16 text-lg font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500';
    
    if (['='].includes(button)) {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white col-span-1`;
    } else if (['+', '-', '×', '÷'].includes(button)) {
      return `${baseClass} bg-orange-500 hover:bg-orange-600 text-white`;
    } else if (['C', 'CE', '⌫', 'MC', 'MR', 'M+', 'M-', 'MS'].includes(button)) {
      return `${baseClass} bg-gray-500 hover:bg-gray-600 text-white`;
    } else if (['%', '1/x', 'x²', '√x', 'sin', 'cos', 'tan', 'log', 'ln', 'n!', 'π', 'e', '+/-', 'deg', 'rad'].includes(button)) {
      return `${baseClass} bg-gray-300 hover:bg-gray-400 text-gray-900`;
    } else {
      return `${baseClass} bg-gray-100 hover:bg-gray-200 text-gray-900`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Calculator</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <History className="w-5 h-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('standard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setMode('scientific')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'scientific' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Scientific
              </button>
            </div>

            {/* Display */}
            <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
              <div className="text-right">
                <div className="text-sm text-gray-400 h-5">
                  {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
                </div>
                <div className="text-3xl font-mono break-all">
                  {display}
                </div>
              </div>
            </div>

            {/* Memory Indicator */}
            {memory.length > 0 && (
              <div className="text-sm text-gray-600 mb-2">
                Memory: {memory[0].value}
              </div>
            )}

            {/* Buttons */}
            <div className={`grid gap-2 ${mode === 'scientific' ? 'grid-cols-5' : 'grid-cols-4'}`}>
              {buttonLayout.flat().map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(button)}
                  className={getButtonClass(button)}
                >
                  {button}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">History</h3>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No calculations yet</p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setDisplay(entry.result);
                      setWaitingForOperand(true);
                    }}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                  >
                    <div className="text-sm text-gray-600">{entry.expression}</div>
                    <div className="font-mono text-lg">{entry.result}</div>
                    <div className="text-xs text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Memory */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory</h3>
            
            <div className="space-y-3">
              {memory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Memory is empty</p>
              ) : (
                memory.map((entry, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-mono text-lg">{entry.value}</div>
                    <div className="text-xs text-gray-500">
                      Stored: {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                <button
                  onClick={memoryClear}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  MC
                </button>
                <button
                  onClick={memoryRecall}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  MR
                </button>
                <button
                  onClick={memoryStore}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  MS
                </button>
                <button
                  onClick={memoryAdd}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  M+
                </button>
                <button
                  onClick={memorySubtract}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                >
                  M-
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Numbers:</span>
                <span className="font-mono">0-9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operations:</span>
                <span className="font-mono">+ - * /</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equals:</span>
                <span className="font-mono">Enter or =</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clear:</span>
                <span className="font-mono">Escape</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backspace:</span>
                <span className="font-mono">Backspace</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Decimal:</span>
                <span className="font-mono">.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 