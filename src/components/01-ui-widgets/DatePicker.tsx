import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  X,
  CalendarDays,
  CalendarRange,
  Settings
} from 'lucide-react';

interface DatePickerProps {
  value?: Date | Date[];
  onChange?: (date: Date | Date[] | undefined) => void;
  placeholder?: string;
  format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MMM DD, YYYY';
  mode?: 'single' | 'range' | 'multiple';
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
  className?: string;
}

/**
 * Date Picker Component
 * 
 * Features:
 * - Single, range, and multiple date selection
 * - Calendar view with month/year navigation
 * - Multiple date formats
 * - Time selection option
 * - Min/max date restrictions
 * - Keyboard navigation
 * - Today button and clear functionality
 * - Responsive design
 * - Accessibility support
 */
const DatePickerDemo: React.FC = () => {
  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
  const [rangeDate, setRangeDate] = useState<Date[] | undefined>(undefined);
  const [multipleDate, setMultipleDate] = useState<Date[] | undefined>(undefined);
  const [format, setFormat] = useState<'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MMM DD, YYYY'>('MM/DD/YYYY');
  const [showTime, setShowTime] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Date Picker Component</h1>
          <p className="text-gray-600">
            Flexible date selection with calendar view, range selection, and multiple formats
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Format:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY</option>
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
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Time</span>
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

        {/* Date Picker Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Date Picker Examples</h2>
          
          {/* Single Date Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Single Date Selection</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Basic Date Picker
                </label>
                <DatePickerComponent
                  value={singleDate}
                  onChange={(date) => setSingleDate(date as Date | undefined)}
                  placeholder="Select a date..."
                  format={format}
                  showTime={showTime}
                  disabled={disabled}
                  size={size}
                />
                {singleDate && (
                  <p className="text-xs text-gray-600">
                    Selected: {formatDate(singleDate, format, showTime)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  With Date Restrictions
                </label>
                <DatePickerComponent
                  value={singleDate}
                  onChange={(date) => setSingleDate(date as Date | undefined)}
                  placeholder="Select future date..."
                  format={format}
                  showTime={showTime}
                  disabled={disabled}
                  size={size}
                  minDate={today}
                  maxDate={nextMonth}
                />
                <p className="text-xs text-gray-500">
                  Restricted to dates between today and next month
                </p>
              </div>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Date Range Selection</h3>
            <div className="max-w-md">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range Picker
                </label>
                <DatePickerComponent
                  value={rangeDate}
                  onChange={(dates) => setRangeDate(dates as Date[] | undefined)}
                  placeholder="Select date range..."
                  format={format}
                  mode="range"
                  showTime={showTime}
                  disabled={disabled}
                  size={size}
                />
                {rangeDate && rangeDate.length === 2 && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Start: {formatDate(rangeDate[0], format, showTime)}</p>
                    <p>End: {formatDate(rangeDate[1], format, showTime)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Multiple Date Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Multiple Date Selection</h3>
            <div className="max-w-md">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Multiple Dates Picker
                </label>
                <DatePickerComponent
                  value={multipleDate}
                  onChange={(dates) => setMultipleDate(dates as Date[] | undefined)}
                  placeholder="Select multiple dates..."
                  format={format}
                  mode="multiple"
                  showTime={showTime}
                  disabled={disabled}
                  size={size}
                />
                {multipleDate && multipleDate.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <p>Selected {multipleDate.length} dates:</p>
                    <div className="space-y-1 mt-1">
                      {multipleDate.map((date, index) => (
                        <p key={index}>• {formatDate(date, format, showTime)}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Format:</span>
              <div className="font-medium">{format}</div>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <div className="font-medium capitalize">{size}</div>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <div className="font-medium">{showTime ? 'Enabled' : 'Disabled'}</div>
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

const DatePickerComponent: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date...',
  format = 'MM/DD/YYYY',
  mode = 'single',
  minDate,
  maxDate,
  disabled = false,
  size = 'md',
  showTime = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-3 text-lg';
      default:
        return 'px-3 py-2 text-base';
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (mode === 'range' && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return `${formatDate(value[0], format, showTime)} - ...`;
      return `${formatDate(value[0], format, showTime)} - ${formatDate(value[1], format, showTime)}`;
    } else if (mode === 'multiple' && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return formatDate(value[0], format, showTime);
      return `${value.length} dates selected`;
    } else if (mode === 'single' && value instanceof Date) {
      return formatDate(value, format, showTime);
    }
    
    return placeholder;
  };

  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    const newDate = showTime ? new Date(date.getTime()) : date;
    if (showTime && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes));
    }

    if (mode === 'single') {
      onChange?.(newDate);
      setIsOpen(false);
    } else if (mode === 'range') {
      const currentDates = Array.isArray(value) ? value : [];
      if (currentDates.length === 0 || currentDates.length === 2) {
        onChange?.([newDate]);
      } else if (currentDates.length === 1) {
        const startDate = currentDates[0];
        const endDate = newDate;
        onChange?.([startDate, endDate].sort((a, b) => a.getTime() - b.getTime()));
        setIsOpen(false);
      }
    } else if (mode === 'multiple') {
      const currentDates = Array.isArray(value) ? value : [];
      const dateExists = currentDates.some(d => isSameDay(d, newDate));
      
      if (dateExists) {
        onChange?.(currentDates.filter(d => !isSameDay(d, newDate)));
      } else {
        onChange?.([...currentDates, newDate]);
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    
    if (mode === 'single' && value instanceof Date) {
      return isSameDay(value, date);
    } else if (Array.isArray(value)) {
      return value.some(d => isSameDay(d, date));
    }
    
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (mode !== 'range' || !Array.isArray(value) || value.length !== 2) return false;
    
    const [start, end] = value;
    return date >= start && date <= end;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateClick(today);
  };

  const clearSelection = () => {
    onChange?.(mode === 'single' ? undefined : []);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between border border-gray-300 rounded-lg
          ${getSizeClasses()}
          ${disabled 
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <span className={getDisplayValue() === placeholder ? 'text-gray-500' : 'text-gray-900'}>
          {getDisplayValue()}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isSelected = isDateSelected(date);
              const isInRange = isDateInRange(date);
              const isDisabled = isDateDisabled(date);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    p-2 text-sm rounded hover:bg-blue-50 transition-colors
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${isInRange && !isSelected ? 'bg-blue-100' : ''}
                    ${isToday && !isSelected ? 'bg-gray-100 font-semibold' : ''}
                    ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time Picker */}
          {showTime && (
            <div className="border-t border-gray-200 pt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Today
            </button>
            
            <div className="flex items-center space-x-2">
              {value && (
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center space-x-1"
                >
                  <X className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function formatDate(date: Date, format: string, showTime: boolean): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let formattedDate = '';
  switch (format) {
    case 'DD/MM/YYYY':
      formattedDate = `${day}/${month}/${year}`;
      break;
    case 'YYYY-MM-DD':
      formattedDate = `${year}-${month}-${day}`;
      break;
    case 'MMM DD, YYYY':
      formattedDate = `${monthNames[date.getMonth()]} ${day}, ${year}`;
      break;
    default:
      formattedDate = `${month}/${day}/${year}`;
  }
  
  if (showTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    formattedDate += ` ${hours}:${minutes}`;
  }
  
  return formattedDate;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export default DatePickerDemo; 