import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Info, HelpCircle, Star, Settings, User, AlertCircle, CheckCircle, Heart, Share } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  showArrow?: boolean;
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Tooltip Component
 * 
 * Features:
 * - Multiple positions (top, bottom, left, right)
 * - Multiple triggers (hover, click, focus)
 * - Custom delay timing
 * - Arrow pointer support
 * - Custom styling and max width
 * - Accessibility support
 * - Auto-positioning when near viewport edges
 * - Rich content support (text, JSX)
 * - Keyboard navigation
 */
const TooltipDemo: React.FC = () => {
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [trigger, setTrigger] = useState<'hover' | 'click' | 'focus'>('hover');
  const [delay, setDelay] = useState(200);
  const [showArrow, setShowArrow] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const sampleContent = {
    simple: "This is a simple tooltip message",
    rich: (
      <div className="space-y-2">
        <div className="font-semibold text-white">Rich Tooltip Content</div>
        <div className="text-sm text-gray-200">
          Tooltips can contain complex content including:
        </div>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Multiple paragraphs</li>
          <li>• Lists and formatting</li>
          <li>• Icons and components</li>
        </ul>
      </div>
    ),
    withIcon: (
      <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-yellow-400" />
        <span>Starred item</span>
      </div>
    )
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Tooltip Component</h1>
          <p className="text-gray-600">
            Contextual tooltips with multiple positions, triggers, and rich content support
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Position:</span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Trigger:</span>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hover">Hover</option>
              <option value="click">Click</option>
              <option value="focus">Focus</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Delay:</span>
            <select
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>No delay</option>
              <option value={200}>200ms</option>
              <option value={500}>500ms</option>
              <option value={1000}>1s</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showArrow}
              onChange={(e) => setShowArrow(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Arrow</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Disabled</span>
          </label>
        </div>

        {/* Interactive Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Interactive Examples</h2>
          
          {/* Basic Tooltips */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Tooltips</h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <TooltipComponent
                content={sampleContent.simple}
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Info className="h-4 w-4" />
                  <span>Hover for info</span>
                </button>
              </TooltipComponent>

              <TooltipComponent
                content="Settings and preferences"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </TooltipComponent>

              <TooltipComponent
                content="View user profile"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-5 w-5" />
                </button>
              </TooltipComponent>
            </div>
          </div>

          {/* Rich Content Tooltips */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Rich Content Tooltips</h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <TooltipComponent
                content={sampleContent.rich}
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
                maxWidth="300px"
              >
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  <span>Rich Content</span>
                </button>
              </TooltipComponent>

              <TooltipComponent
                content={sampleContent.withIcon}
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Star className="h-5 w-5" />
                </button>
              </TooltipComponent>
            </div>
          </div>

          {/* All Positions Demo */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">All Positions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                <TooltipComponent
                  key={pos}
                  content={`Tooltip positioned at ${pos}`}
                  position={pos}
                  trigger={trigger}
                  delay={delay}
                  showArrow={showArrow}
                  disabled={disabled}
                >
                  <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors capitalize">
                    {pos}
                  </button>
                </TooltipComponent>
              ))}
            </div>
          </div>

          {/* Status Tooltips */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Status & Action Tooltips</h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <TooltipComponent
                content="Operation completed successfully"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                  <CheckCircle className="h-5 w-5" />
                </button>
              </TooltipComponent>

              <TooltipComponent
                content="Warning: Please review before proceeding"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors">
                  <AlertCircle className="h-5 w-5" />
                </button>
              </TooltipComponent>

              <TooltipComponent
                content="Add to favorites"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </TooltipComponent>

              <TooltipComponent
                content="Share with others"
                position={position}
                trigger={trigger}
                delay={delay}
                showArrow={showArrow}
                disabled={disabled}
              >
                <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  <Share className="h-5 w-5" />
                </button>
              </TooltipComponent>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Position:</span>
              <div className="font-medium capitalize">{position}</div>
            </div>
            <div>
              <span className="text-gray-600">Trigger:</span>
              <div className="font-medium capitalize">{trigger}</div>
            </div>
            <div>
              <span className="text-gray-600">Delay:</span>
              <div className="font-medium">{delay}ms</div>
            </div>
            <div>
              <span className="text-gray-600">Arrow:</span>
              <div className="font-medium">{showArrow ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-medium">{disabled ? 'Disabled' : 'Active'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TooltipComponent: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  disabled = false,
  showArrow = true,
  maxWidth = '200px',
  className = '',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsVisible(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  }, [disabled, trigger, isVisible]);

  const handleFocus = useCallback(() => {
    if (disabled) return;
    
    if (trigger === 'focus') {
      showTooltip();
    }
  }, [disabled, trigger, showTooltip]);

  const handleBlur = useCallback(() => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  }, [trigger, hideTooltip]);

  // Auto-position tooltip when near viewport edges
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newPosition = position;

      // Check if tooltip would overflow and adjust position
      switch (position) {
        case 'top':
          if (triggerRect.top - tooltipRect.height < 10) {
            newPosition = 'bottom';
          }
          break;
        case 'bottom':
          if (triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
            newPosition = 'top';
          }
          break;
        case 'left':
          if (triggerRect.left - tooltipRect.width < 10) {
            newPosition = 'right';
          }
          break;
        case 'right':
          if (triggerRect.right + tooltipRect.width > viewport.width - 10) {
            newPosition = 'left';
          }
          break;
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  // Click outside to close
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          tooltipRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !tooltipRef.current.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [trigger, isVisible, hideTooltip]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipStyles = () => {
    const baseStyles = "absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg transition-all duration-200";
    const visibilityStyles = isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none";
    
    let positionStyles = "";
    switch (actualPosition) {
      case 'top':
        positionStyles = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
        break;
      case 'bottom':
        positionStyles = "top-full left-1/2 transform -translate-x-1/2 mt-2";
        break;
      case 'left':
        positionStyles = "right-full top-1/2 transform -translate-y-1/2 mr-2";
        break;
      case 'right':
        positionStyles = "left-full top-1/2 transform -translate-y-1/2 ml-2";
        break;
    }

    return `${baseStyles} ${visibilityStyles} ${positionStyles} ${className}`;
  };

  const getArrowStyles = () => {
    if (!showArrow) return "hidden";
    
    const baseStyles = "absolute w-2 h-2 bg-gray-900 transform rotate-45";
    
    switch (actualPosition) {
      case 'top':
        return `${baseStyles} top-full left-1/2 -translate-x-1/2 -mt-1`;
      case 'bottom':
        return `${baseStyles} bottom-full left-1/2 -translate-x-1/2 -mb-1`;
      case 'left':
        return `${baseStyles} left-full top-1/2 -translate-y-1/2 -ml-1`;
      case 'right':
        return `${baseStyles} right-full top-1/2 -translate-y-1/2 -mr-1`;
      default:
        return "hidden";
    }
  };

  const triggerProps = {
    ref: triggerRef,
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip
    }),
    ...(trigger === 'click' && {
      onClick: handleClick
    }),
    ...(trigger === 'focus' && {
      onFocus: handleFocus,
      onBlur: handleBlur
    })
  };

  return (
    <div className="relative inline-block">
      <div {...triggerProps}>
        {children}
      </div>
      
      <div
        ref={tooltipRef}
        className={getTooltipStyles()}
        style={{ maxWidth }}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {content}
        <div className={getArrowStyles()} />
      </div>
    </div>
  );
};

export default TooltipDemo;