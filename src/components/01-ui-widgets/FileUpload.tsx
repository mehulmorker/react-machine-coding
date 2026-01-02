import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Plus,
  Folder
} from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  className?: string;
}

/**
 * File Upload Component
 * 
 * Features:
 * - Drag and drop support
 * - Multiple file selection
 * - File type validation
 * - File size validation
 * - Upload progress tracking
 * - Image preview generation
 * - File management (remove, retry)
 * - Different upload modes
 * - Responsive design
 * - Accessibility support
 */
const FileUploadDemo: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [accept, setAccept] = useState('');
  const [multiple, setMultiple] = useState(true);
  const [maxSize, setMaxSize] = useState(10);
  const [maxFiles, setMaxFiles] = useState(5);
  const [disabled, setDisabled] = useState(false);
  const [dragAndDrop, setDragAndDrop] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const handleUpload = async (files: File[]) => {
    // Simulate upload process
    for (const file of files) {
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      // Generate preview for images
      if (file.type.startsWith('image/') && showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileItem.preview = e.target?.result as string;
          setUploadedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, preview: fileItem.preview } : f));
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, fileItem]);

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileItem.id ? { ...f, progress } : f)
        );
      }

      // Simulate random success/failure
      const success = Math.random() > 0.2;
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileItem.id ? {
          ...f,
          status: success ? 'completed' : 'error',
          error: success ? undefined : 'Upload failed. Please try again.'
        } : f)
      );
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = async (id: string) => {
    const fileItem = uploadedFiles.find(f => f.id === id);
    if (!fileItem) return;

    setUploadedFiles(prev => 
      prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 0, error: undefined } : f)
    );

    // Simulate retry upload
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setUploadedFiles(prev => 
        prev.map(f => f.id === id ? { ...f, progress } : f)
      );
    }

    setUploadedFiles(prev => 
      prev.map(f => f.id === id ? { ...f, status: 'completed' } : f)
    );
  };

  const clearAll = () => {
    setUploadedFiles([]);
  };

  const getAcceptOptions = () => {
    const options = [
      { value: '', label: 'All Files' },
      { value: 'image/*', label: 'Images Only' },
      { value: 'video/*', label: 'Videos Only' },
      { value: 'audio/*', label: 'Audio Only' },
      { value: '.pdf,.doc,.docx', label: 'Documents' },
      { value: '.jpg,.jpeg,.png,.gif', label: 'Common Images' },
    ];
    return options;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">File Upload Component</h1>
          <p className="text-gray-600">
            Flexible file upload with drag & drop, progress tracking, and validation
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Accept:</span>
            <select
              value={accept}
              onChange={(e) => setAccept(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getAcceptOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Max Size:</span>
            <select
              value={maxSize}
              onChange={(e) => setMaxSize(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 MB</option>
              <option value={5}>5 MB</option>
              <option value={10}>10 MB</option>
              <option value={50}>50 MB</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Max Files:</span>
            <select
              value={maxFiles}
              onChange={(e) => setMaxFiles(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Multiple</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dragAndDrop}
              onChange={(e) => setDragAndDrop(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Drag & Drop</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Preview</span>
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

        {/* File Upload Examples */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center">File Upload Examples</h2>
          
          {/* Basic Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">File Upload Area</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FileUploadComponent
                  accept={accept}
                  multiple={multiple}
                  maxSize={maxSize}
                  maxFiles={maxFiles}
                  disabled={disabled}
                  onUpload={handleUpload}
                  dragAndDrop={dragAndDrop}
                  showPreview={showPreview}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Uploaded Files ({uploadedFiles.length})
                  </h4>
                  {uploadedFiles.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Folder className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No files uploaded yet</p>
                    </div>
                  ) : (
                    uploadedFiles.map((fileItem) => (
                      <FileItemComponent
                        key={fileItem.id}
                        fileItem={fileItem}
                        onRemove={removeFile}
                        onRetry={retryUpload}
                        showPreview={showPreview}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Accept:</span>
              <div className="font-medium">{accept || 'All Files'}</div>
            </div>
            <div>
              <span className="text-gray-600">Max Size:</span>
              <div className="font-medium">{maxSize} MB</div>
            </div>
            <div>
              <span className="text-gray-600">Max Files:</span>
              <div className="font-medium">{maxFiles}</div>
            </div>
            <div>
              <span className="text-gray-600">Multiple:</span>
              <div className="font-medium">{multiple ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <span className="text-gray-600">Drag & Drop:</span>
              <div className="font-medium">{dragAndDrop ? 'Enabled' : 'Disabled'}</div>
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

const FileUploadComponent: React.FC<FileUploadProps> = ({
  accept = '',
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  disabled = false,
  onUpload,
  dragAndDrop = true,
  showPreview = true,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.includes('/*')) {
          const mimeType = type.replace('/*', '');
          return file.type.startsWith(mimeType);
        } else {
          return file.type === type;
        }
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = (files: FileList) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    
    // Check max files limit
    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('File validation errors:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onUpload?.(validFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, maxSize, maxFiles, accept, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && dragAndDrop) {
      setIsDragOver(true);
    }
  }, [disabled, dragAndDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow same file selection
    e.target.value = '';
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={openFileDialog}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 ${disabled ? 'text-gray-300' : isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {dragAndDrop ? 'Drop files here or click to upload' : 'Click to upload files'}
            </p>
            <p className={`text-sm mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              {accept 
                ? `Accepted: ${accept.replace(/\*/g, 'any')}` 
                : 'All file types accepted'
              }
            </p>
            <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              Max size: {maxSize}MB, Max files: {maxFiles}
            </p>
          </div>

          {!disabled && (
            <div className="flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Choose Files</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileItemComponent: React.FC<{
  fileItem: FileItem;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  showPreview: boolean;
}> = ({ fileItem, onRemove, onRetry, showPreview }) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileIcon = getFileIcon(fileItem.type);

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
      {/* File Icon/Preview */}
      <div className="flex-shrink-0">
        {showPreview && fileItem.preview ? (
          <img
            src={fileItem.preview}
            alt={fileItem.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <FileIcon className="h-5 w-5 text-gray-500" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">{fileItem.name}</p>
          <div className="flex items-center space-x-2">
            {fileItem.status === 'completed' && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            {fileItem.status === 'error' && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {fileItem.status === 'uploading' && (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{formatFileSize(fileItem.size)}</p>
          <p className="text-xs text-gray-500">
            {fileItem.status === 'uploading' ? `${fileItem.progress}%` : fileItem.status}
          </p>
        </div>

        {/* Progress Bar */}
        {fileItem.status === 'uploading' && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all"
              style={{ width: `${fileItem.progress}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {fileItem.status === 'error' && fileItem.error && (
          <p className="text-xs text-red-500 mt-1">{fileItem.error}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {fileItem.status === 'error' && (
          <button
            onClick={() => onRetry(fileItem.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Retry upload"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        
        <button
          onClick={() => onRemove(fileItem.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FileUploadDemo; 