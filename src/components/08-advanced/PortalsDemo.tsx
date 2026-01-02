import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Code,
  Maximize2,
  Minimize2,
  X,
  Info,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Bell
} from 'lucide-react';

// Modal Portal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Toast Portal Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(onClose, 3000);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, [onClose]);

  if (!mounted) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${styles[type]} shadow-lg`}>
        {icons[type]}
        <p>{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

// Tooltip Portal Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleMouseEnter = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    });
    setShow(true);
  };

  if (!mounted || !show) return <>{children}</>;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {createPortal(
        <div
          className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

const PortalsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">React Portals Demo</h1>
          <p className="text-lg text-gray-600">
            Explore React Portals for rendering content outside the normal DOM hierarchy
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modal Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Maximize2 className="w-5 h-5 mr-2 text-blue-500" />
            Modal Portal
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open Modal
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Modal Portal Example"
          >
            <div className="mt-2">
              <p className="text-gray-600">
                This modal is rendered using a Portal, which means it's rendered outside the normal DOM hierarchy.
                This is useful for modals, tooltips, and other overlays that need to break out of their container.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </Modal>
        </div>

        {/* Toast Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-500" />
            Toast Portal
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => setToast({ message: 'Operation successful!', type: 'success' })}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Show Success Toast
            </button>
            <button
              onClick={() => setToast({ message: 'Something went wrong!', type: 'error' })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Show Error Toast
            </button>
            <button
              onClick={() => setToast({ message: 'Here\'s some information.', type: 'info' })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Show Info Toast
            </button>
          </div>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>

        {/* Tooltip Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
            Tooltip Portal
          </h2>
          <div className="space-y-4">
            <Tooltip content="This is a tooltip rendered using a Portal">
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Hover me for tooltip
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-500" />
            Portals Documentation
          </h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are Portals?</h3>
            <p className="text-gray-600 mb-4">
              Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. This is particularly useful for modals, tooltips, and other overlays.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Render content outside parent DOM hierarchy</li>
              <li>Maintain event bubbling through React tree</li>
              <li>Better accessibility for modals and overlays</li>
              <li>Cleaner DOM structure</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Modal dialogs</li>
              <li>Tooltips and popovers</li>
              <li>Toast notifications</li>
              <li>Loading overlays</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Portals maintain React's event bubbling</li>
                    <li>• Portals can be nested</li>
                    <li>• Portals work with server-side rendering</li>
                    <li>• Portals preserve context</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalsDemo; 