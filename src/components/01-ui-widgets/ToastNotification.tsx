import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  XCircle,
  Bell,
  Mail,
  Download,
  Upload,
  Settings,
  User
} from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Toast Notification System
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Configurable positions (6 positions)
 * - Auto-dismiss with custom duration
 * - Persistent toasts (no auto-dismiss)
 * - Action buttons
 * - Queue management
 * - Smooth animations
 * - Accessibility support
 * - Progressive enhancement
 * - Mobile responsive
 */
const ToastNotificationDemo: React.FC = () => {
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [defaultDuration, setDefaultDuration] = useState(4000);

  return (
    <ToastProvider>
      <ToastContainer position={position} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Toast Notification System</h1>
            <p className="text-gray-600">
              Non-blocking notifications with multiple types, positions, and interactive features
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Position:</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as ToastPosition)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Duration:</span>
              <select
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2000}>2 seconds</option>
                <option value={4000}>4 seconds</option>
                <option value={6000}>6 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
            </div>

            <ToastActions defaultDuration={defaultDuration} />
          </div>

          {/* Toast Examples */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 text-center">Toast Examples</h2>
            
            {/* Basic Toasts */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Basic Toast Types</h3>
              <BasicToastExamples defaultDuration={defaultDuration} />
            </div>

            {/* Action Toasts */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Toasts with Actions</h3>
              <ActionToastExamples defaultDuration={defaultDuration} />
            </div>

            {/* System Toasts */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Notifications</h3>
              <SystemToastExamples defaultDuration={defaultDuration} />
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Position:</span>
                <div className="font-medium">{position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              </div>
              <div>
                <span className="text-gray-600">Default Duration:</span>
                <div className="font-medium">{defaultDuration / 1000}s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

const ToastActions: React.FC<{ defaultDuration: number }> = ({ defaultDuration }) => {
  const { clearAllToasts } = useToast();

  return (
    <button
      onClick={clearAllToasts}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
    >
      Clear All Toasts
    </button>
  );
};

const BasicToastExamples: React.FC<{ defaultDuration: number }> = ({ defaultDuration }) => {
  const { addToast } = useToast();

  const toastExamples = [
    {
      type: 'success' as ToastType,
      title: 'Success!',
      message: 'Your operation completed successfully.',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      type: 'error' as ToastType,
      title: 'Error!',
      message: 'Something went wrong. Please try again.',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      type: 'warning' as ToastType,
      title: 'Warning!',
      message: 'Please review your settings before proceeding.',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600'
    },
    {
      type: 'info' as ToastType,
      title: 'Info',
      message: 'Here\'s some important information for you.',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {toastExamples.map((example) => (
        <button
          key={example.type}
          onClick={() => addToast({
            type: example.type,
            title: example.title,
            message: example.message,
            duration: defaultDuration
          })}
          className={`px-4 py-3 ${example.color} text-white rounded-lg ${example.hoverColor} transition-colors text-center`}
        >
          <div className="font-medium capitalize">{example.type}</div>
          <div className="text-sm opacity-90">Show Toast</div>
        </button>
      ))}
    </div>
  );
};

const ActionToastExamples: React.FC<{ defaultDuration: number }> = ({ defaultDuration }) => {
  const { addToast } = useToast();

  const handleUndo = () => {
    addToast({
      type: 'info',
      title: 'Action undone',
      message: 'The previous action has been reverted.',
      duration: 3000
    });
  };

  const handleRetry = () => {
    addToast({
      type: 'info',
      title: 'Retrying...',
      message: 'Attempting to perform the action again.',
      duration: 3000
    });
  };

  const actionExamples = [
    {
      label: 'Delete with Undo',
      onClick: () => addToast({
        type: 'success',
        title: 'Item deleted',
        message: 'The item has been removed from your list.',
        duration: defaultDuration,
        action: {
          label: 'Undo',
          onClick: handleUndo
        }
      })
    },
    {
      label: 'Failed with Retry',
      onClick: () => addToast({
        type: 'error',
        title: 'Upload failed',
        message: 'Could not upload the file. Check your connection.',
        persistent: true,
        action: {
          label: 'Retry',
          onClick: handleRetry
        }
      })
    },
    {
      label: 'Persistent Warning',
      onClick: () => addToast({
        type: 'warning',
        title: 'Storage almost full',
        message: 'You\'re running out of storage space.',
        persistent: true,
        action: {
          label: 'Upgrade',
          onClick: () => addToast({
            type: 'info',
            title: 'Redirecting...',
            message: 'Taking you to the upgrade page.',
            duration: 2000
          })
        }
      })
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actionExamples.map((example, index) => (
        <button
          key={index}
          onClick={example.onClick}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          {example.label}
        </button>
      ))}
    </div>
  );
};

const SystemToastExamples: React.FC<{ defaultDuration: number }> = ({ defaultDuration }) => {
  const { addToast } = useToast();

  const systemExamples = [
    {
      icon: Mail,
      label: 'New Message',
      onClick: () => addToast({
        type: 'info',
        title: 'New message received',
        message: 'You have a new message from John Doe.',
        duration: defaultDuration
      })
    },
    {
      icon: Download,
      label: 'Download Complete',
      onClick: () => addToast({
        type: 'success',
        title: 'Download completed',
        message: 'Your file has been downloaded successfully.',
        duration: defaultDuration
      })
    },
    {
      icon: Upload,
      label: 'Upload Progress',
      onClick: () => addToast({
        type: 'info',
        title: 'Uploading...',
        message: 'Your files are being uploaded. Please wait.',
        persistent: true
      })
    },
    {
      icon: Settings,
      label: 'Settings Saved',
      onClick: () => addToast({
        type: 'success',
        title: 'Settings saved',
        message: 'Your preferences have been updated.',
        duration: defaultDuration
      })
    },
    {
      icon: User,
      label: 'Profile Updated',
      onClick: () => addToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile information has been saved.',
        duration: defaultDuration
      })
    },
    {
      icon: Bell,
      label: 'Reminder',
      onClick: () => addToast({
        type: 'warning',
        title: 'Meeting reminder',
        message: 'Your meeting starts in 5 minutes.',
        duration: defaultDuration
      })
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {systemExamples.map((example, index) => {
        const IconComponent = example.icon;
        return (
          <button
            key={index}
            onClick={example.onClick}
            className="flex flex-col items-center space-y-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <IconComponent className="h-6 w-6 text-gray-600" />
            <span className="text-xs text-center text-gray-700">{example.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Toast Provider and Context
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration (unless persistent)
    if (!toast.persistent && toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer: React.FC<{ position: ToastPosition }> = ({ position }) => {
  const { toasts } = useToast();

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm w-full`}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: XCircle,
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: AlertCircle,
          iconColor: 'text-yellow-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-500',
          icon: Info,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-500',
          icon: Info,
          iconColor: 'text-gray-600'
        };
    }
  };

  const { icon: IconComponent, iconColor } = getTypeStyles();

  return (
    <div className={`
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
    `}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-0 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">{toast.title}</div>
            {toast.message && (
              <div className="text-sm text-gray-600 mt-1">{toast.message}</div>
            )}
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    handleRemove();
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotificationDemo; 