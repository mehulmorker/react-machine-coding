import React, { useState, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowHalf?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  color?: string;
  emptyColor?: string;
  hoverColor?: string;
  onChange?: (rating: number) => void;
  onHover?: (rating: number) => void;
  className?: string;
}

/**
 * Star Rating Component
 * 
 * Features:
 * - Full and half-star ratings
 * - Hover effects with preview
 * - Multiple sizes (sm, md, lg, xl)
 * - Read-only and disabled states
 * - Customizable colors
 * - Keyboard navigation
 * - Touch/click support
 * - Rating statistics display
 * - Clear rating functionality
 */
const StarRatingDemo: React.FC = () => {
  const [interactiveRating, setInteractiveRating] = useState(3.5);
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [allowHalf, setAllowHalf] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showValue, setShowValue] = useState(true);
  const [color, setColor] = useState('#fbbf24'); // yellow-400
  const [reviews] = useState([
    { rating: 5, count: 42, percentage: 60 },
    { rating: 4, count: 18, percentage: 26 },
    { rating: 3, count: 7, percentage: 10 },
    { rating: 2, count: 2, percentage: 3 },
    { rating: 1, count: 1, percentage: 1 }
  ]);

  const totalReviews = reviews.reduce((sum, review) => sum + review.count, 0);
  const averageRating = reviews.reduce((sum, review) => sum + (review.rating * review.count), 0) / totalReviews;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Star Rating Component</h1>
          <p className="text-gray-600">
            Interactive star rating with half-star support and hover effects
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
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
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowHalf}
              onChange={(e) => setAllowHalf(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Half Stars</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={readonly}
              onChange={(e) => setReadonly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Read Only</span>
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

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showValue}
              onChange={(e) => setShowValue(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Value</span>
          </label>
        </div>

        {/* Interactive Rating */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Interactive Rating</h2>
          <div className="flex items-center justify-center space-x-4">
            <StarRatingComponent
              value={interactiveRating}
              size={size}
              allowHalf={allowHalf}
              readonly={readonly}
              disabled={disabled}
              showValue={showValue}
              color={color}
              onChange={setInteractiveRating}
            />
          </div>
          <button
            onClick={() => setInteractiveRating(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Clear Rating
          </button>
        </div>

        {/* Rating Examples */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Rating Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Different Values */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Different Values</h3>
              <div className="space-y-2">
                {[1, 2.5, 3.7, 4.2, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <StarRatingComponent
                      value={rating}
                      readonly
                      allowHalf
                      size="sm"
                      color={color}
                    />
                    <span className="text-sm text-gray-600">{rating}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Different Sizes */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Different Sizes</h3>
              <div className="space-y-3">
                {(['sm', 'md', 'lg', 'xl'] as const).map((sizeVariant) => (
                  <div key={sizeVariant} className="flex items-center space-x-3">
                    <StarRatingComponent
                      value={4}
                      readonly
                      size={sizeVariant}
                      color={color}
                    />
                    <span className="text-sm text-gray-600 capitalize">{sizeVariant}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Different Colors */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Different Colors</h3>
              <div className="space-y-2">
                {[
                  { color: '#fbbf24', name: 'Yellow' },
                  { color: '#f59e0b', name: 'Amber' },
                  { color: '#ef4444', name: 'Red' },
                  { color: '#10b981', name: 'Green' },
                  { color: '#8b5cf6', name: 'Purple' }
                ].map(({ color: colorValue, name }) => (
                  <div key={name} className="flex items-center space-x-3">
                    <StarRatingComponent
                      value={4}
                      readonly
                      size="sm"
                      color={colorValue}
                    />
                    <span className="text-sm text-gray-600">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Rating Distribution</h2>
          
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Overall Rating */}
            <div className="flex-shrink-0 text-center">
              <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <StarRatingComponent
                value={averageRating}
                readonly
                allowHalf
                size="lg"
                color={color}
              />
              <div className="text-sm text-gray-600 mt-2">{totalReviews} reviews</div>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              {reviews.map((review) => (
                <div key={review.rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm text-gray-600">{review.rating}</span>
                    <Star className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${review.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {review.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{interactiveRating}</div>
            <div className="text-xs text-gray-500">Current Rating</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{averageRating.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Average Rating</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{totalReviews}</div>
            <div className="text-xs text-gray-500">Total Reviews</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">5</div>
            <div className="text-xs text-gray-500">Max Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarRatingComponent: React.FC<StarRatingProps> = ({
  value = 0,
  maxRating = 5,
  size = 'md',
  allowHalf = false,
  readonly = false,
  disabled = false,
  showValue = false,
  color = '#fbbf24',
  emptyColor = '#e5e7eb',
  hoverColor,
  onChange,
  onHover,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleMouseEnter = useCallback((starIndex: number, isHalf: boolean = false) => {
    if (readonly || disabled) return;
    
    const newValue = isHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverValue(newValue);
    onHover?.(newValue);
  }, [readonly, disabled, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (readonly || disabled) return;
    
    setHoverValue(null);
    onHover?.(value);
  }, [readonly, disabled, onHover, value]);

  const handleClick = useCallback((starIndex: number, isHalf: boolean = false) => {
    if (readonly || disabled) return;
    
    const newValue = isHalf ? starIndex + 0.5 : starIndex + 1;
    onChange?.(newValue);
  }, [readonly, disabled, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (readonly || disabled) return;

    let newValue = value;
    const step = allowHalf ? 0.5 : 1;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(0, value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(maxRating, value + step);
        break;
      case 'Home':
        event.preventDefault();
        newValue = 0;
        break;
      case 'End':
        event.preventDefault();
        newValue = maxRating;
        break;
      default:
        return;
    }

    onChange?.(newValue);
  }, [readonly, disabled, value, allowHalf, maxRating, onChange]);

  const stars = useMemo(() => {
    return Array.from({ length: maxRating }, (_, index) => {
      const starValue = index + 1;
      const isFilled = displayValue >= starValue;
      const isHalfFilled = allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;
      
      return {
        index,
        isFilled,
        isHalfFilled,
        fillPercentage: isHalfFilled ? 50 : isFilled ? 100 : 0
      };
    });
  }, [maxRating, displayValue, allowHalf]);

  const containerClass = `
    inline-flex items-center space-x-1
    ${!readonly && !disabled ? 'cursor-pointer' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={containerClass}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={readonly || disabled ? -1 : 0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={maxRating}
        aria-valuenow={value}
        aria-label={`Rating: ${value} out of ${maxRating} stars`}
      >
        {stars.map(({ index, isFilled, isHalfFilled, fillPercentage }) => (
          <div key={index} className="relative">
            {/* Background Star */}
            <Star
              className={`${sizeClasses[size]} transition-colors duration-150`}
              style={{ color: emptyColor }}
              fill={emptyColor}
            />

            {/* Filled Star */}
            {fillPercentage > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fillPercentage}%`
                }}
              >
                <Star
                  className={`${sizeClasses[size]} transition-colors duration-150`}
                  style={{ 
                    color: hoverValue !== null && hoverColor ? hoverColor : color 
                  }}
                  fill={hoverValue !== null && hoverColor ? hoverColor : color}
                />
              </div>
            )}

            {/* Interactive Overlays */}
            {!readonly && !disabled && (
              <>
                {allowHalf && (
                  <div
                    className="absolute inset-0 w-1/2 cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(index, true)}
                    onClick={() => handleClick(index, true)}
                  />
                )}
                <div
                  className={`absolute inset-0 cursor-pointer ${allowHalf ? 'ml-1/2' : ''}`}
                  onMouseEnter={() => handleMouseEnter(index, false)}
                  onClick={() => handleClick(index, false)}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
          {displayValue.toFixed(allowHalf ? 1 : 0)}
        </span>
      )}
    </div>
  );
};

export default StarRatingDemo; 