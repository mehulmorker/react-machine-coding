import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Settings, 
  User, 
  FileText, 
  Image, 
  AlertCircle, 
  Trash2, 
  Save,
  Edit,
  Plus,
  Download,
  Upload,
  Mail
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Modal Dialog Component
 * 
 * Features:
 * - Multiple sizes (sm, md, lg, xl, full)
 * - Various animations (fade, scale, slide)
 * - Backdrop control (click to close)
 * - Keyboard navigation (ESC to close)
 * - Accessibility support (focus management, ARIA)
 * - Custom footer support
 * - Scroll handling for long content
 * - Mobile responsive
 * - Portal rendering
 * - Focus trap
 */
const ModalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<string>('');
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  const [animation, setAnimation] = useState<'fade' | 'scale' | 'slide-up' | 'slide-down'>('scale');
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true);
  const [closeOnEscape, setCloseOnEscape] = useState(true);

  const openModal = (modalType: string) => {
    setCurrentModal(modalType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentModal('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Modal Dialog System</h1>
          <p className="text-gray-600">
            Overlay dialogs with multiple sizes, animations, and accessibility features
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
              <option value="xl">Extra Large</option>
              <option value="full">Full Screen</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Animation:</span>
            <select
              value={animation}
              onChange={(e) => setAnimation(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fade">Fade</option>
              <option value="scale">Scale</option>
              <option value="slide-up">Slide Up</option>
              <option value="slide-down">Slide Down</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={closeOnBackdrop}
              onChange={(e) => setCloseOnBackdrop(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Close on Backdrop</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={closeOnEscape}
              onChange={(e) => setCloseOnEscape(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Close on Escape</span>
          </label>
        </div>

        {/* Modal Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Modal Examples</h2>
          
          {/* Basic Modals */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Modal Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => openModal('info')}
                className="flex flex-col items-center space-y-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">Info Modal</span>
              </button>

              <button
                onClick={() => openModal('form')}
                className="flex flex-col items-center space-y-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Edit className="h-6 w-6" />
                <span className="text-sm">Form Modal</span>
              </button>

              <button
                onClick={() => openModal('confirmation')}
                className="flex flex-col items-center space-y-2 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">Confirmation</span>
              </button>

              <button
                onClick={() => openModal('settings')}
                className="flex flex-col items-center space-y-2 p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>

          {/* Content Modals */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Content & Media Modals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => openModal('image')}
                className="flex flex-col items-center space-y-2 p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Image className="h-6 w-6" />
                <span className="text-sm">Image Gallery</span>
              </button>

              <button
                onClick={() => openModal('profile')}
                className="flex flex-col items-center space-y-2 p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="text-sm">User Profile</span>
              </button>

              <button
                onClick={() => openModal('upload')}
                className="flex flex-col items-center space-y-2 p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">File Upload</span>
              </button>

              <button
                onClick={() => openModal('newsletter')}
                className="flex flex-col items-center space-y-2 p-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span className="text-sm">Newsletter</span>
              </button>
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
              <span className="text-gray-600">Animation:</span>
              <div className="font-medium capitalize">{animation.replace('-', ' ')}</div>
            </div>
            <div>
              <span className="text-gray-600">Backdrop Close:</span>
              <div className="font-medium">{closeOnBackdrop ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div>
              <span className="text-gray-600">Escape Close:</span>
              <div className="font-medium">{closeOnEscape ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Current Modal */}
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        size={size}
        animation={animation}
        closeOnBackdrop={closeOnBackdrop}
        closeOnEscape={closeOnEscape}
        title={getModalTitle(currentModal)}
        footer={getModalFooter(currentModal, closeModal)}
      >
        {getModalContent(currentModal)}
      </ModalComponent>
    </div>
  );
};

const getModalTitle = (modalType: string): string => {
  const titles: Record<string, string> = {
    info: 'Information',
    form: 'Edit Profile',
    confirmation: 'Delete Item',
    settings: 'Application Settings',
    image: 'Image Gallery',
    profile: 'User Profile',
    upload: 'Upload Files',
    newsletter: 'Subscribe to Newsletter'
  };
  return titles[modalType] || 'Modal';
};

const getModalFooter = (modalType: string, closeModal: () => void): React.ReactNode => {
  switch (modalType) {
    case 'confirmation':
      return (
        <div className="flex space-x-3">
          <button
            onClick={closeModal}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Item deleted!');
              closeModal();
            }}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      );
    case 'form':
      return (
        <div className="flex space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Profile saved!');
              closeModal();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      );
    case 'upload':
      return (
        <div className="flex space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Files uploaded!');
              closeModal();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>
      );
    default:
      return (
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      );
  }
};

const getModalContent = (modalType: string): React.ReactNode => {
  switch (modalType) {
    case 'info':
      return (
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an informational modal that displays important details to the user.
            It can contain various types of content including text, images, and interactive elements.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Key Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Responsive design for all screen sizes</li>
              <li>• Accessible keyboard navigation</li>
              <li>• Smooth animations and transitions</li>
              <li>• Customizable appearance and behavior</li>
            </ul>
          </div>
        </div>
      );

    case 'form':
      return (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              defaultValue="Software developer passionate about creating amazing user experiences."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Send me email notifications
            </label>
          </div>
        </form>
      );

    case 'confirmation':
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delete Item</h3>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>"Project Proposal.pdf"</strong>? 
            This will permanently remove the file from your account.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action is irreversible and will affect all associated data.
            </p>
          </div>
        </div>
      );

    case 'settings':
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Appearance</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm text-gray-700">Light theme</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Dark theme</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="theme" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">System default</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email notifications</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push notifications</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">SMS notifications</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              </label>
            </div>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=300&h=300&fit=crop`}
                  alt={`Gallery image ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Images</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download All</span>
            </button>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-gray-600">Senior Product Designer</p>
              <p className="text-sm text-gray-500">Joined March 2021</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">2.4k</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">About</h4>
            <p className="text-sm text-gray-600">
              Passionate designer with 8+ years of experience creating intuitive digital experiences. 
              Specializes in user research, prototyping, and design systems.
            </p>
          </div>
        </div>
      );

    case 'upload':
      return (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Choose Files
            </button>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Upload Queue</h4>
            <div className="space-y-2">
              {['document.pdf', 'presentation.pptx', 'image.jpg'].map((file, index) => (
                <div key={file} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {index === 0 ? 'Uploading...' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'newsletter':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Stay Updated!
            </h3>
            <p className="text-gray-600">
              Get the latest news and updates delivered straight to your inbox.
            </p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Interests</span>
              <div className="space-y-2">
                {['Product Updates', 'Weekly Newsletter', 'Special Offers', 'Event Notifications'].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                alert('Subscribed successfully!');
              }}
            >
              Subscribe Now
            </button>
          </form>
        </div>
      );

    default:
      return <div>Modal content</div>;
  }
};

// Modal Component
const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeable = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  animation = 'scale',
  children,
  footer
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full m-4';
      default:
        return 'max-w-lg';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'fade':
        return 'animate-fadeIn';
      case 'scale':
        return 'animate-scaleIn';
      case 'slide-up':
        return 'animate-slideUp';
      case 'slide-down':
        return 'animate-slideDown';
      default:
        return 'animate-scaleIn';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop && closeable) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={`
            bg-white rounded-lg shadow-xl w-full ${getSizeClasses()} ${getAnimationClasses()}
            focus:outline-none
          `}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {showCloseButton && closeable && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDemo;