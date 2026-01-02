import React, { useState, useCallback, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  Home, 
  ArrowLeft, 
  Grid3X3, 
  List, 
  Search, 
  SortAsc, 
  SortDesc, 
  Upload, 
  Download, 
  Trash2, 
  Copy, 
  Scissors, 
  Plus, 
  MoreVertical,
  Image,
  Video,
  Music,
  Archive,
  Code,
  FileText,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Share
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  parent: string | null;
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive' | 'other';
  path: string;
  children?: string[];
}

interface FileSystemState {
  files: { [id: string]: FileItem };
  currentPath: string;
  selectedItems: string[];
  clipboard: { items: string[]; operation: 'copy' | 'cut' } | null;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'size' | 'modified' | 'type';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  showHidden: boolean;
}

const FileExplorer: React.FC = () => {
  // Sample file system data
  const initialFiles: { [id: string]: FileItem } = {
    'root': {
      id: 'root',
      name: 'Home',
      type: 'folder',
      modified: '2024-01-01',
      parent: null,
      path: '/',
      children: ['documents', 'pictures', 'videos', 'downloads']
    },
    'documents': {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      modified: '2024-01-15',
      parent: 'root',
      path: '/Documents',
      children: ['doc1', 'doc2', 'spreadsheet1', 'presentation1']
    },
    'pictures': {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      modified: '2024-01-12',
      parent: 'root',
      path: '/Pictures',
      children: ['photo1', 'photo2', 'photo3']
    },
    'videos': {
      id: 'videos',
      name: 'Videos',
      type: 'folder',
      modified: '2024-01-10',
      parent: 'root',
      path: '/Videos',
      children: ['video1', 'video2']
    },
    'downloads': {
      id: 'downloads',
      name: 'Downloads',
      type: 'folder',
      modified: '2024-01-08',
      parent: 'root',
      path: '/Downloads',
      children: ['installer1', 'archive1', 'pdf1']
    },
    'doc1': {
      id: 'doc1',
      name: 'Report.docx',
      type: 'file',
      size: 2048576,
      modified: '2024-01-15',
      parent: 'documents',
      fileType: 'document',
      path: '/Documents/Report.docx'
    },
    'doc2': {
      id: 'doc2',
      name: 'Notes.txt',
      type: 'file',
      size: 1024,
      modified: '2024-01-14',
      parent: 'documents',
      fileType: 'document',
      path: '/Documents/Notes.txt'
    },
    'spreadsheet1': {
      id: 'spreadsheet1',
      name: 'Budget.xlsx',
      type: 'file',
      size: 1536000,
      modified: '2024-01-13',
      parent: 'documents',
      fileType: 'document',
      path: '/Documents/Budget.xlsx'
    },
    'presentation1': {
      id: 'presentation1',
      name: 'Slides.pptx',
      type: 'file',
      size: 3072000,
      modified: '2024-01-12',
      parent: 'documents',
      fileType: 'document',
      path: '/Documents/Slides.pptx'
    },
    'photo1': {
      id: 'photo1',
      name: 'Vacation.jpg',
      type: 'file',
      size: 4194304,
      modified: '2024-01-11',
      parent: 'pictures',
      fileType: 'image',
      path: '/Pictures/Vacation.jpg'
    },
    'photo2': {
      id: 'photo2',
      name: 'Portrait.png',
      type: 'file',
      size: 2097152,
      modified: '2024-01-10',
      parent: 'pictures',
      fileType: 'image',
      path: '/Pictures/Portrait.png'
    },
    'photo3': {
      id: 'photo3',
      name: 'Landscape.raw',
      type: 'file',
      size: 20971520,
      modified: '2024-01-09',
      parent: 'pictures',
      fileType: 'image',
      path: '/Pictures/Landscape.raw'
    },
    'video1': {
      id: 'video1',
      name: 'Movie.mp4',
      type: 'file',
      size: 1073741824,
      modified: '2024-01-08',
      parent: 'videos',
      fileType: 'video',
      path: '/Videos/Movie.mp4'
    },
    'video2': {
      id: 'video2',
      name: 'Tutorial.avi',
      type: 'file',
      size: 536870912,
      modified: '2024-01-07',
      parent: 'videos',
      fileType: 'video',
      path: '/Videos/Tutorial.avi'
    },
    'installer1': {
      id: 'installer1',
      name: 'Setup.exe',
      type: 'file',
      size: 104857600,
      modified: '2024-01-06',
      parent: 'downloads',
      fileType: 'other',
      path: '/Downloads/Setup.exe'
    },
    'archive1': {
      id: 'archive1',
      name: 'Backup.zip',
      type: 'file',
      size: 52428800,
      modified: '2024-01-05',
      parent: 'downloads',
      fileType: 'archive',
      path: '/Downloads/Backup.zip'
    },
    'pdf1': {
      id: 'pdf1',
      name: 'Manual.pdf',
      type: 'file',
      size: 5242880,
      modified: '2024-01-04',
      parent: 'downloads',
      fileType: 'document',
      path: '/Downloads/Manual.pdf'
    }
  };

  // State management
  const [fileSystem, setFileSystem] = useState<FileSystemState>({
    files: initialFiles,
    currentPath: 'root',
    selectedItems: [],
    clipboard: null,
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    searchTerm: '',
    showHidden: false
  });

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    itemId: null
  });

  // Get file icon based on type
  const getFileIcon = useCallback((item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-500" />;
    }

    switch (item.fileType) {
      case 'image':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-pink-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-orange-500" />;
      case 'code':
        return <Code className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes?: number) => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }, []);

  // Get current directory items
  const currentItems = useMemo(() => {
    const currentFile = fileSystem.files[fileSystem.currentPath];
    if (!currentFile || currentFile.type !== 'folder' || !currentFile.children) {
      return [];
    }

    return currentFile.children
      .map(id => fileSystem.files[id])
      .filter(item => item && (!fileSystem.searchTerm || 
        item.name.toLowerCase().includes(fileSystem.searchTerm.toLowerCase())
      ));
  }, [fileSystem.files, fileSystem.currentPath, fileSystem.searchTerm]);

  // Sort items
  const sortedItems = useMemo(() => {
    const items = [...currentItems];
    
    items.sort((a, b) => {
      let comparison = 0;
      
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      
      switch (fileSystem.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'modified':
          comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
        case 'type':
          comparison = (a.fileType || '').localeCompare(b.fileType || '');
          break;
      }
      
      return fileSystem.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return items;
  }, [currentItems, fileSystem.sortBy, fileSystem.sortOrder]);

  // Get breadcrumb path
  const breadcrumbPath = useMemo(() => {
    const path: FileItem[] = [];
    let currentId: string | null = fileSystem.currentPath;
    
    while (currentId) {
      const item: FileItem = fileSystem.files[currentId];
      if (item) {
        path.unshift(item);
        currentId = item.parent;
      } else {
        break;
      }
    }
    
    return path;
  }, [fileSystem.files, fileSystem.currentPath]);

  // Navigate to folder
  const navigateToFolder = useCallback((folderId: string) => {
    const folder = fileSystem.files[folderId];
    if (folder && folder.type === 'folder') {
      setFileSystem(prev => ({
        ...prev,
        currentPath: folderId,
        selectedItems: []
      }));
    }
  }, [fileSystem.files]);

  // Handle item selection
  const handleItemSelect = useCallback((itemId: string, multiSelect = false) => {
    setFileSystem(prev => ({
      ...prev,
      selectedItems: multiSelect
        ? prev.selectedItems.includes(itemId)
          ? prev.selectedItems.filter(id => id !== itemId)
          : [...prev.selectedItems, itemId]
        : [itemId]
    }));
  }, []);

  // Handle double click
  const handleDoubleClick = useCallback((item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      // Simulate file opening
      console.log('Opening file:', item.name);
    }
  }, [navigateToFolder]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemId
    });
  }, []);

  // Copy/Cut operations
  const handleCopy = useCallback((itemIds: string[]) => {
    setFileSystem(prev => ({
      ...prev,
      clipboard: { items: itemIds, operation: 'copy' }
    }));
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleCut = useCallback((itemIds: string[]) => {
    setFileSystem(prev => ({
      ...prev,
      clipboard: { items: itemIds, operation: 'cut' }
    }));
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Paste operation
  const handlePaste = useCallback(() => {
    if (!fileSystem.clipboard) return;

    const currentFolder = fileSystem.files[fileSystem.currentPath];
    if (!currentFolder || currentFolder.type !== 'folder') return;

    // Simulate paste operation
    console.log('Pasting items:', fileSystem.clipboard.items, 'to', currentFolder.name);
    
    setFileSystem(prev => ({
      ...prev,
      clipboard: null
    }));
  }, [fileSystem.clipboard, fileSystem.files, fileSystem.currentPath]);

  // Delete operation
  const handleDelete = useCallback((itemIds: string[]) => {
    console.log('Deleting items:', itemIds);
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // New folder operation
  const handleNewFolder = useCallback(() => {
    const newId = `folder_${Date.now()}`;
    const currentFolder = fileSystem.files[fileSystem.currentPath];
    
    if (!currentFolder || currentFolder.type !== 'folder') return;

    const newFolder: FileItem = {
      id: newId,
      name: 'New Folder',
      type: 'folder',
      modified: new Date().toISOString(),
      parent: fileSystem.currentPath,
      path: `${currentFolder.path}/New Folder`,
      children: []
    };

    setFileSystem(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [newId]: newFolder,
        [fileSystem.currentPath]: {
          ...currentFolder,
          children: [...(currentFolder.children || []), newId]
        }
      }
    }));
  }, [fileSystem.files, fileSystem.currentPath]);

  // Toggle sort order
  const toggleSort = useCallback((sortBy: typeof fileSystem.sortBy) => {
    setFileSystem(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Close context menu
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-white h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">File Explorer</h1>
        <p className="text-gray-600">
          Navigate and manage your files with multiple view modes and operations
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateToFolder('root')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const currentFile = fileSystem.files[fileSystem.currentPath];
              if (currentFile && currentFile.parent) {
                navigateToFolder(currentFile.parent);
              }
            }}
            disabled={fileSystem.currentPath === 'root'}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNewFolder}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={fileSystem.searchTerm}
              onChange={(e) => setFileSystem(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setFileSystem(prev => ({ ...prev, viewMode: 'grid' }))}
              className={`p-2 ${fileSystem.viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFileSystem(prev => ({ ...prev, viewMode: 'list' }))}
              className={`p-2 ${fileSystem.viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <button
              onClick={() => navigateToFolder(item.id)}
              className="hover:text-blue-600 hover:underline"
            >
              {item.name}
            </button>
            {index < breadcrumbPath.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {fileSystem.viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {sortedItems.map(item => (
              <div
                key={item.id}
                className={`p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  fileSystem.selectedItems.includes(item.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent'
                }`}
                onClick={(e) => handleItemSelect(item.id, e.ctrlKey || e.metaKey)}
                onDoubleClick={() => handleDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="text-4xl">
                    {getFileIcon(item)}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate w-full">
                    {item.name}
                  </div>
                  {item.size && (
                    <div className="text-xs text-gray-500">
                      {formatFileSize(item.size)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3"></th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('name')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Name</span>
                      {fileSystem.sortBy === 'name' && (
                        fileSystem.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('size')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Size</span>
                      {fileSystem.sortBy === 'size' && (
                        fileSystem.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('modified')}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>Modified</span>
                      {fileSystem.sortBy === 'modified' && (
                        fileSystem.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedItems.map(item => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      fileSystem.selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={(e) => handleItemSelect(item.id, e.ctrlKey || e.metaKey)}
                    onDoubleClick={() => handleDoubleClick(item)}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                  >
                    <td className="px-4 py-3">
                      {getFileIcon(item)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(item.modified).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, item.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              if (contextMenu.itemId) {
                handleDoubleClick(fileSystem.files[contextMenu.itemId]);
              }
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Open</span>
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => handleCopy(fileSystem.selectedItems.length > 0 ? fileSystem.selectedItems : [contextMenu.itemId!])}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={() => handleCut(fileSystem.selectedItems.length > 0 ? fileSystem.selectedItems : [contextMenu.itemId!])}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <Scissors className="w-4 h-4" />
            <span>Cut</span>
          </button>
          {fileSystem.clipboard && (
            <button
              onClick={handlePaste}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Paste</span>
            </button>
          )}
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => handleDelete(fileSystem.selectedItems.length > 0 ? fileSystem.selectedItems : [contextMenu.itemId!])}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {sortedItems.length} items
            {fileSystem.selectedItems.length > 0 && ` | ${fileSystem.selectedItems.length} selected`}
          </div>
          <div className="flex items-center space-x-4">
            {fileSystem.clipboard && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                <span>{fileSystem.clipboard.operation === 'copy' ? 'Copied' : 'Cut'}</span>
                <span>{fileSystem.clipboard.items.length} items</span>
              </div>
            )}
            <div>
              Total: {fileSystem.files[fileSystem.currentPath]?.children?.length || 0} items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer; 