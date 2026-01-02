import React, { useState, useRef, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Zap, Volume2, VolumeX, Bell, BellOff, Wifi, WifiOff } from 'lucide-react';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  label?: string;
  description?: string;
  showIcons?: boolean;
  loading?: boolean;
  color?: string;
  name?: string;
  id?: string;
  className?: string;
}

interface ToggleSwitchDemoProps {}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  showIcons = false,
  loading = false,
  color,
  name,
  id,
  className = ''
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled || loading) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const sizeClasses = {
    sm: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6'
    },
    lg: {
      container: 'w-16 h-8',
      thumb: 'w-7 h-7',
      translate: 'translate-x-8'
    }
  };

  const variantClasses = {
    default: {
      off: 'bg-gray-200',
      on: 'bg-blue-500',
      thumb: 'bg-white'
    },
    success: {
      off: 'bg-gray-200',
      on: 'bg-green-500',
      thumb: 'bg-white'
    },
    warning: {
      off: 'bg-gray-200',
      on: 'bg-yellow-500',
      thumb: 'bg-white'
    },
    danger: {
      off: 'bg-gray-200',
      on: 'bg-red-500',
      thumb: 'bg-white'
    },
    info: {
      off: 'bg-gray-200',
      on: 'bg-cyan-500',
      thumb: 'bg-white'
    }
  };

  const currentSizeClasses = sizeClasses[size];
  const currentVariantClasses = variantClasses[variant];

  const containerBaseClasses = `
    relative inline-flex items-center rounded-full cursor-pointer 
    transition-all duration-300 ease-in-out transform
    ${currentSizeClasses.container}
    ${disabled || loading 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:scale-105 active:scale-95'
    }
    ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
  `;

  const backgroundClass = color 
    ? (isChecked ? `bg-[${color}]` : 'bg-gray-200')
    : (isChecked ? currentVariantClasses.on : currentVariantClasses.off);

  const thumbBaseClasses = `
    absolute top-0.5 left-0.5 rounded-full shadow-lg 
    transition-all duration-300 ease-in-out transform
    ${currentSizeClasses.thumb}
    ${currentVariantClasses.thumb}
    ${isChecked ? currentSizeClasses.translate : 'translate-x-0'}
    ${loading ? 'animate-pulse' : ''}
  `;

  const iconSize = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            name={name}
            id={id}
            className="sr-only"
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-describedby={description ? `${id}-description` : undefined}
          />
          
          <div 
            className={`${containerBaseClasses} ${backgroundClass}`}
            onClick={handleToggle}
            role="switch"
            aria-checked={isChecked}
            tabIndex={disabled || loading ? -1 : 0}
          >
            <div className={thumbBaseClasses}>
              {showIcons && (
                <div className={`flex items-center justify-center ${iconSize[size]}`}>
                  {loading ? (
                    <div className="animate-spin rounded-full border border-gray-400 border-t-transparent" />
                  ) : isChecked ? (
                    <div className="text-green-500">✓</div>
                  ) : (
                    <div className="text-gray-400">✕</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {label && (
          <div className="flex-1">
            <label 
              id={`${id}-label`}
              htmlFor={id}
              className={`
                block text-sm font-medium cursor-pointer
                ${disabled ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              {label}
            </label>
            {description && (
              <p 
                id={`${id}-description`}
                className={`
                  text-xs mt-1
                  ${disabled ? 'text-gray-300' : 'text-gray-500'}
                `}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const IconToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ checked, onChange, onIcon, offIcon, label, size = 'md', disabled = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-14 h-7',
    lg: 'w-18 h-9'
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const translateClasses = {
    sm: 'translate-x-5',
    md: 'translate-x-7',
    lg: 'translate-x-9'
  };

  return (
    <div className="flex items-center space-x-3">
      <div 
        className={`
          relative inline-flex items-center rounded-full cursor-pointer
          transition-all duration-300 ease-in-out
          ${sizeClasses[size]}
          ${checked ? 'bg-blue-500' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div className={`
          absolute flex items-center justify-center rounded-full bg-white shadow-lg
          transition-all duration-300 ease-in-out transform
          ${thumbSizeClasses[size]}
          ${checked ? translateClasses[size] : 'translate-x-0.5'}
        `}>
          {checked ? onIcon : offIcon}
        </div>
      </div>
      <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
        {label}
      </span>
    </div>
  );
};

const AnimatedToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  variant?: 'gradient' | 'neon' | 'minimal';
}> = ({ checked, onChange, label, variant = 'gradient' }) => {
  const variants = {
    gradient: {
      container: checked 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
        : 'bg-gray-300',
      thumb: 'bg-white shadow-lg',
      animation: 'hover:shadow-xl'
    },
    neon: {
      container: checked 
        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
        : 'bg-gray-700',
      thumb: 'bg-white shadow-lg',
      animation: 'hover:shadow-2xl'
    },
    minimal: {
      container: checked ? 'bg-black' : 'bg-gray-200',
      thumb: 'bg-white border-2 border-gray-300',
      animation: 'hover:scale-105'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className="flex items-center space-x-3">
      <div 
        className={`
          relative inline-flex items-center w-14 h-8 rounded-full cursor-pointer
          transition-all duration-500 ease-in-out transform
          ${currentVariant.container}
          ${currentVariant.animation}
        `}
        onClick={() => onChange(!checked)}
      >
        <div className={`
          absolute w-7 h-7 rounded-full transition-all duration-500 ease-in-out transform
          ${currentVariant.thumb}
          ${checked ? 'translate-x-6' : 'translate-x-0.5'}
        `} />
        
        {/* Background pattern for neon variant */}
        {variant === 'neon' && checked && (
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" />
        )}
      </div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
  );
};

const ToggleSwitchDemo: React.FC<ToggleSwitchDemoProps> = () => {
  // Basic toggle states
  const [basicToggle, setBasicToggle] = useState(false);
  const [disabledToggle, setDisabledToggle] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(false);

  // Size variants
  const [smallToggle, setSmallToggle] = useState(false);
  const [mediumToggle, setMediumToggle] = useState(true);
  const [largeToggle, setLargeToggle] = useState(false);

  // Color variants
  const [successToggle, setSuccessToggle] = useState(true);
  const [warningToggle, setWarningToggle] = useState(false);
  const [dangerToggle, setDangerToggle] = useState(true);
  const [infoToggle, setInfoToggle] = useState(false);

  // Feature toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Animated toggles
  const [gradientToggle, setGradientToggle] = useState(true);
  const [neonToggle, setNeonToggle] = useState(false);
  const [minimalToggle, setMinimalToggle] = useState(true);

  // Settings
  const [showIcons, setShowIcons] = useState(true);
  const [includeLabels, setIncludeLabels] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <ToggleLeft className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Toggle Switch</h1>
              <p className="text-gray-600">Interactive switches with multiple variants and animations</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Examples */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Examples</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Simple Toggle</h3>
                  <ToggleSwitch
                    checked={basicToggle}
                    onChange={setBasicToggle}
                    label={includeLabels ? "Enable feature" : undefined}
                    description={includeLabels ? "Toggle this feature on or off" : undefined}
                    showIcons={showIcons}
                    id="basic-toggle"
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Disabled State</h3>
                  <ToggleSwitch
                    checked={disabledToggle}
                    onChange={setDisabledToggle}
                    disabled={true}
                    label={includeLabels ? "Disabled toggle" : undefined}
                    description={includeLabels ? "This toggle is disabled" : undefined}
                    showIcons={showIcons}
                    id="disabled-toggle"
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Loading State</h3>
                  <div className="flex items-center space-x-4">
                    <ToggleSwitch
                      checked={loadingToggle}
                      onChange={setLoadingToggle}
                      loading={true}
                      label={includeLabels ? "Loading toggle" : undefined}
                      showIcons={showIcons}
                      id="loading-toggle"
                    />
                    <button
                      onClick={() => setLoadingToggle(!loadingToggle)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Size Variants</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Small</h3>
                  <ToggleSwitch
                    checked={smallToggle}
                    onChange={setSmallToggle}
                    size="sm"
                    label={includeLabels ? "Small toggle" : undefined}
                    showIcons={showIcons}
                    id="small-toggle"
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Medium (Default)</h3>
                  <ToggleSwitch
                    checked={mediumToggle}
                    onChange={setMediumToggle}
                    size="md"
                    label={includeLabels ? "Medium toggle" : undefined}
                    showIcons={showIcons}
                    id="medium-toggle"
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Large</h3>
                  <ToggleSwitch
                    checked={largeToggle}
                    onChange={setLargeToggle}
                    size="lg"
                    label={includeLabels ? "Large toggle" : undefined}
                    showIcons={showIcons}
                    id="large-toggle"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Variants */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Success</h3>
                <ToggleSwitch
                  checked={successToggle}
                  onChange={setSuccessToggle}
                  variant="success"
                  label={includeLabels ? "Success" : undefined}
                  showIcons={showIcons}
                  id="success-toggle"
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Warning</h3>
                <ToggleSwitch
                  checked={warningToggle}
                  onChange={setWarningToggle}
                  variant="warning"
                  label={includeLabels ? "Warning" : undefined}
                  showIcons={showIcons}
                  id="warning-toggle"
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Danger</h3>
                <ToggleSwitch
                  checked={dangerToggle}
                  onChange={setDangerToggle}
                  variant="danger"
                  label={includeLabels ? "Danger" : undefined}
                  showIcons={showIcons}
                  id="danger-toggle"
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Info</h3>
                <ToggleSwitch
                  checked={infoToggle}
                  onChange={setInfoToggle}
                  variant="info"
                  label={includeLabels ? "Info" : undefined}
                  showIcons={showIcons}
                  id="info-toggle"
                />
              </div>
            </div>
          </div>

          {/* Icon Toggles */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Icon Toggles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <IconToggleSwitch
                  checked={soundEnabled}
                  onChange={setSoundEnabled}
                  onIcon={<Volume2 className="h-4 w-4 text-blue-500" />}
                  offIcon={<VolumeX className="h-4 w-4 text-gray-400" />}
                  label="Sound Effects"
                />

                <IconToggleSwitch
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                  onIcon={<Bell className="h-4 w-4 text-green-500" />}
                  offIcon={<BellOff className="h-4 w-4 text-gray-400" />}
                  label="Notifications"
                />
              </div>

              <div className="space-y-4">
                <IconToggleSwitch
                  checked={wifiEnabled}
                  onChange={setWifiEnabled}
                  onIcon={<Wifi className="h-4 w-4 text-blue-500" />}
                  offIcon={<WifiOff className="h-4 w-4 text-gray-400" />}
                  label="WiFi Connection"
                />

                <IconToggleSwitch
                  checked={darkMode}
                  onChange={setDarkMode}
                  onIcon={<span className="text-yellow-500">☀️</span>}
                  offIcon={<span className="text-gray-600">🌙</span>}
                  label="Dark Mode"
                />
              </div>
            </div>
          </div>

          {/* Animated Variants */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Animated Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Gradient</h3>
                <AnimatedToggleSwitch
                  checked={gradientToggle}
                  onChange={setGradientToggle}
                  label="Gradient Style"
                  variant="gradient"
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Neon</h3>
                <AnimatedToggleSwitch
                  checked={neonToggle}
                  onChange={setNeonToggle}
                  label="Neon Style"
                  variant="neon"
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimal</h3>
                <AnimatedToggleSwitch
                  checked={minimalToggle}
                  onChange={setMinimalToggle}
                  label="Minimal Style"
                  variant="minimal"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Settings</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleSwitch
                  checked={showIcons}
                  onChange={setShowIcons}
                  label="Show Icons"
                  description="Display icons in toggle switches"
                  id="show-icons-toggle"
                />

                <ToggleSwitch
                  checked={includeLabels}
                  onChange={setIncludeLabels}
                  label="Include Labels"
                  description="Show labels and descriptions"
                  id="include-labels-toggle"
                />
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
                  <h3 className="text-sm font-medium text-gray-900">Multiple Sizes</h3>
                  <p className="text-sm text-gray-600">Small, medium, and large size variants</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color Variants</h3>
                  <p className="text-sm text-gray-600">Success, warning, danger, and info color schemes</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Smooth Animations</h3>
                  <p className="text-sm text-gray-600">CSS transitions for smooth state changes</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Accessibility</h3>
                  <p className="text-sm text-gray-600">Full keyboard support and screen reader compatibility</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Icon Support</h3>
                  <p className="text-sm text-gray-600">Optional icons for enhanced visual feedback</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Loading States</h3>
                  <p className="text-sm text-gray-600">Built-in loading indicators for async operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitchDemo; 