import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Search,
  User,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Star,
  Heart,
  Plus,
  Filter,
  SortAsc,
  Globe,
  Shield,
  Bell
} from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  children?: DropdownOption[];
  divider?: boolean;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  maxHeight?: string;
  className?: string;
}

/**
 * Dropdown Menu Component
 * 
 * Features:
 * - Single and multi-select support
 * - Multi-level/nested dropdowns
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Search/filter functionality
 * - Custom icons and descriptions
 * - Disabled states and dividers
 * - Multiple sizes and positions
 * - Mobile responsive
 * - Accessibility support
 * - Click outside to close
 */
const DropdownDemo: React.FC = () => {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [searchable, setSearchable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [position, setPosition] = useState<'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-left');

  // Sample data for different dropdown types
  const basicOptions: DropdownOption[] = [
    { id: '1', label: 'Option 1', value: 'opt1' },
    { id: '2', label: 'Option 2', value: 'opt2' },
    { id: '3', label: 'Option 3', value: 'opt3', disabled: true },
    { id: '4', label: 'Option 4', value: 'opt4' },
  ];

  const iconOptions: DropdownOption[] = [
    { id: '1', label: 'Profile', value: 'profile', icon: User, description: 'Manage your profile' },
    { id: '2', label: 'Settings', value: 'settings', icon: Settings, description: 'App preferences' },
    { id: 'div1', label: '', value: '', divider: true },
    { id: '3', label: 'Logout', value: 'logout', icon: LogOut, description: 'Sign out of account' },
  ];

  const nestedOptions: DropdownOption[] = [
    {
      id: '1',
      label: 'File',
      value: 'file',
      icon: Edit,
      children: [
        { id: '1-1', label: 'New File', value: 'new-file', icon: Plus },
        { id: '1-2', label: 'Open File', value: 'open-file', icon: Download },
        { id: '1-3', label: 'Save File', value: 'save-file', icon: Copy },
      ]
    },
    {
      id: '2',
      label: 'Edit',
      value: 'edit',
      icon: Edit,
      children: [
        { id: '2-1', label: 'Copy', value: 'copy', icon: Copy },
        { id: '2-2', label: 'Cut', value: 'cut', icon: Trash2 },
        { id: '2-3', label: 'Paste', value: 'paste', icon: Plus },
      ]
    },
    {
      id: '3',
      label: 'Share',
      value: 'share',
      icon: Share,
      children: [
        { id: '3-1', label: 'Copy Link', value: 'copy-link', icon: Copy },
        { id: '3-2', label: 'Email', value: 'email', icon: Share },
        { id: '3-3', label: 'Social Media', value: 'social', icon: Globe },
      ]
    },
  ];

  const countryOptions: DropdownOption[] = [
    { id: '1', label: 'United States', value: 'us', icon: Globe },
    { id: '2', label: 'United Kingdom', value: 'uk', icon: Globe },
    { id: '3', label: 'Canada', value: 'ca', icon: Globe },
    { id: '4', label: 'Australia', value: 'au', icon: Globe },
    { id: '5', label: 'Germany', value: 'de', icon: Globe },
    { id: '6', label: 'France', value: 'fr', icon: Globe },
    { id: '7', label: 'Japan', value: 'jp', icon: Globe },
    { id: '8', label: 'India', value: 'in', icon: Globe },
  ];

  const categoryOptions: DropdownOption[] = [
    { id: '1', label: 'Technology', value: 'tech', icon: Settings },
    { id: '2', label: 'Design', value: 'design', icon: Star },
    { id: '3', label: 'Marketing', value: 'marketing', icon: Share },
    { id: '4', label: 'Sales', value: 'sales', icon: Heart },
    { id: '5', label: 'Support', value: 'support', icon: Shield },
    { id: '6', label: 'Finance', value: 'finance', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Dropdown Menu Component</h1>
          <p className="text-gray-600">
            Versatile dropdown menus with search, multi-select, nested options, and keyboard navigation
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
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

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Position:</span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={searchable}
              onChange={(e) => setSearchable(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Searchable</span>
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

        {/* Dropdown Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Dropdown Examples</h2>
          
          {/* Basic Dropdowns */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Dropdowns</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Single Select
                </label>
                <DropdownComponent
                  options={basicOptions}
                  value={singleValue}
                  onChange={(value) => setSingleValue(value as string)}
                  placeholder="Choose an option..."
                  searchable={searchable}
                  disabled={disabled}
                  size={size}
                  position={position}
                />
                {singleValue && (
                  <p className="text-xs text-gray-600">Selected: {singleValue}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Multi Select
                </label>
                <DropdownComponent
                  options={basicOptions}
                  value={multiValue}
                  onChange={(value) => setMultiValue(value as string[])}
                  placeholder="Choose multiple options..."
                  searchable={searchable}
                  multiSelect
                  disabled={disabled}
                  size={size}
                  position={position}
                />
                {multiValue.length > 0 && (
                  <p className="text-xs text-gray-600">Selected: {multiValue.join(', ')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Icon & Description Dropdowns */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">With Icons & Descriptions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  User Menu
                </label>
                <DropdownComponent
                  options={iconOptions}
                  placeholder="Account options..."
                  searchable={searchable}
                  disabled={disabled}
                  size={size}
                  position={position}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <DropdownComponent
                  options={categoryOptions}
                  placeholder="Select category..."
                  searchable={searchable}
                  disabled={disabled}
                  size={size}
                  position={position}
                />
              </div>
            </div>
          </div>

          {/* Nested Dropdown */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Nested Dropdown</h3>
            <div className="max-w-md">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Context Menu
                </label>
                <DropdownComponent
                  options={nestedOptions}
                  placeholder="Choose action..."
                  searchable={false}
                  disabled={disabled}
                  size={size}
                  position={position}
                />
              </div>
            </div>
          </div>

          {/* Searchable Long List */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Searchable Long List</h3>
            <div className="max-w-md">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country Selection
                </label>
                <DropdownComponent
                  options={countryOptions}
                  placeholder="Search countries..."
                  searchable={true}
                  disabled={disabled}
                  size={size}
                  position={position}
                  maxHeight="200px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Size:</span>
              <div className="font-medium capitalize">{size}</div>
            </div>
            <div>
              <span className="text-gray-600">Position:</span>
              <div className="font-medium">{position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            </div>
            <div>
              <span className="text-gray-600">Searchable:</span>
              <div className="font-medium">{searchable ? 'Enabled' : 'Disabled'}</div>
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

const DropdownComponent: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  multiSelect = false,
  disabled = false,
  size = 'md',
  position = 'bottom-left',
  maxHeight = '300px',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.children && option.children.some(child => 
          child.label.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : options;

  const flattenedOptions = getFlattenedOptions(filteredOptions, expandedItems);

  function getFlattenedOptions(opts: DropdownOption[], expanded: Set<string>, depth = 0): (DropdownOption & { depth: number })[] {
    const result: (DropdownOption & { depth: number })[] = [];
    
    opts.forEach(option => {
      if (option.divider) {
        result.push({ ...option, depth });
        return;
      }
      
      result.push({ ...option, depth });
      
      if (option.children && expanded.has(option.id)) {
        result.push(...getFlattenedOptions(option.children, expanded, depth + 1));
      }
    });
    
    return result;
  }

  const getDisplayValue = () => {
    if (multiSelect && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = findOptionByValue(options, value[0]);
        return option?.label || value[0];
      }
      return `${value.length} items selected`;
    } else {
      const option = findOptionByValue(options, value as string);
      return option?.label || placeholder;
    }
  };

  function findOptionByValue(opts: DropdownOption[], val: string): DropdownOption | null {
    for (const option of opts) {
      if (option.value === val) return option;
      if (option.children) {
        const found = findOptionByValue(option.children, val);
        if (found) return found;
      }
    }
    return null;
  }

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled || option.divider) return;

    if (option.children) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(option.id)) {
        newExpanded.delete(option.id);
      } else {
        newExpanded.add(option.id);
      }
      setExpandedItems(newExpanded);
      return;
    }

    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          const option = flattenedOptions[focusedIndex];
          if (option) handleOptionClick(option);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const nextIndex = focusedIndex < flattenedOptions.length - 1 ? focusedIndex + 1 : 0;
          setFocusedIndex(nextIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : flattenedOptions.length - 1;
          setFocusedIndex(prevIndex);
        }
        break;
    }
  };

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'top-full right-0 mt-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      default:
        return 'top-full left-0 mt-1';
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
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
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`
            absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg
            ${getPositionClasses()}
          `}
          style={{ maxHeight }}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - ${searchable ? '60px' : '0px'})` }}>
            {flattenedOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            ) : (
              flattenedOptions.map((option, index) => {
                if (option.divider) {
                  return <div key={option.id} className="border-t border-gray-200 my-1" />;
                }

                const isSelected = multiSelect 
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                const isFocused = index === focusedIndex;
                const hasChildren = option.children && option.children.length > 0;
                const isExpanded = expandedItems.has(option.id);

                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className={`
                      flex items-center px-3 py-2 cursor-pointer text-sm
                      ${option.depth > 0 ? `pl-${3 + option.depth * 4}` : ''}
                      ${option.disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : isFocused 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.icon && (
                      <option.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option.label}</span>
                        <div className="flex items-center space-x-2">
                          {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                          {hasChildren && (
                            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          )}
                        </div>
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownDemo; 