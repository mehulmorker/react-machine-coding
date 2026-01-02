import React, { useState, useCallback, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Scissors, 
  Clipboard,
  Search,
  MoreVertical,
  FileText,
  Image,
  Code,
  Database,
  Archive,
  Video,
  Music,
  Settings
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  expanded?: boolean;
  parent?: string;
  fileType?: 'text' | 'image' | 'code' | 'database' | 'archive' | 'video' | 'audio' | 'config';
  size?: number;
  modified?: string;
  level?: number;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  nodeId: string | null;
}

const TreeView: React.FC = () => {
  // Sample tree data
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: '1-1',
          name: 'components',
          type: 'folder',
          expanded: true,
          parent: '1',
          children: [
            {
              id: '1-1-1',
              name: 'Header.tsx',
              type: 'file',
              parent: '1-1',
              fileType: 'code',
              size: 2048,
              modified: '2024-01-15'
            },
            {
              id: '1-1-2',
              name: 'Footer.tsx',
              type: 'file',
              parent: '1-1',
              fileType: 'code',
              size: 1536,
              modified: '2024-01-14'
            },
            {
              id: '1-1-3',
              name: 'ui',
              type: 'folder',
              expanded: false,
              parent: '1-1',
              children: [
                {
                  id: '1-1-3-1',
                  name: 'Button.tsx',
                  type: 'file',
                  parent: '1-1-3',
                  fileType: 'code',
                  size: 1024,
                  modified: '2024-01-13'
                },
                {
                  id: '1-1-3-2',
                  name: 'Input.tsx',
                  type: 'file',
                  parent: '1-1-3',
                  fileType: 'code',
                  size: 896,
                  modified: '2024-01-12'
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          name: 'assets',
          type: 'folder',
          expanded: false,
          parent: '1',
          children: [
            {
              id: '1-2-1',
              name: 'images',
              type: 'folder',
              expanded: false,
              parent: '1-2',
              children: [
                {
                  id: '1-2-1-1',
                  name: 'logo.png',
                  type: 'file',
                  parent: '1-2-1',
                  fileType: 'image',
                  size: 4096,
                  modified: '2024-01-10'
                },
                {
                  id: '1-2-1-2',
                  name: 'hero.jpg',
                  type: 'file',
                  parent: '1-2-1',
                  fileType: 'image',
                  size: 8192,
                  modified: '2024-01-09'
                }
              ]
            },
            {
              id: '1-2-2',
              name: 'styles',
              type: 'folder',
              expanded: false,
              parent: '1-2',
              children: [
                {
                  id: '1-2-2-1',
                  name: 'global.css',
                  type: 'file',
                  parent: '1-2-2',
                  fileType: 'code',
                  size: 2048,
                  modified: '2024-01-11'
                }
              ]
            }
          ]
        },
        {
          id: '1-3',
          name: 'utils',
          type: 'folder',
          expanded: false,
          parent: '1',
          children: [
            {
              id: '1-3-1',
              name: 'helpers.ts',
              type: 'file',
              parent: '1-3',
              fileType: 'code',
              size: 1280,
              modified: '2024-01-08'
            },
            {
              id: '1-3-2',
              name: 'constants.ts',
              type: 'file',
              parent: '1-3',
              fileType: 'code',
              size: 512,
              modified: '2024-01-07'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'public',
      type: 'folder',
      expanded: false,
      children: [
        {
          id: '2-1',
          name: 'index.html',
          type: 'file',
          parent: '2',
          fileType: 'code',
          size: 1024,
          modified: '2024-01-06'
        },
        {
          id: '2-2',
          name: 'favicon.ico',
          type: 'file',
          parent: '2',
          fileType: 'image',
          size: 256,
          modified: '2024-01-05'
        }
      ]
    },
    {
      id: '3',
      name: 'package.json',
      type: 'file',
      fileType: 'config',
      size: 2048,
      modified: '2024-01-04'
    },
    {
      id: '4',
      name: 'README.md',
      type: 'file',
      fileType: 'text',
      size: 4096,
      modified: '2024-01-03'
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null
  });
  const [clipboard, setClipboard] = useState<{ node: TreeNode; action: 'copy' | 'cut' } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '1-1']));
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Get file icon based on type
  const getFileIcon = useCallback((fileType?: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4 text-purple-500" />;
      case 'code': return <Code className="w-4 h-4 text-blue-500" />;
      case 'database': return <Database className="w-4 h-4 text-green-500" />;
      case 'archive': return <Archive className="w-4 h-4 text-orange-500" />;
      case 'video': return <Video className="w-4 h-4 text-red-500" />;
      case 'audio': return <Music className="w-4 h-4 text-pink-500" />;
      case 'config': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }, []);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Find node by ID
  const findNode = useCallback((nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Update tree data
  const updateTreeData = useCallback((updater: (data: TreeNode[]) => TreeNode[]) => {
    setTreeData(updater);
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      nodeId
    });
  }, []);

  // Handle edit node
  const handleEditNode = useCallback((nodeId: string) => {
    const node = findNode(treeData, nodeId);
    if (node) {
      setEditingNodeId(nodeId);
      setEditingName(node.name);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [treeData, findNode]);

  // Save edit
  const handleSaveEdit = useCallback(() => {
    if (editingNodeId && editingName.trim()) {
      updateTreeData(data => {
        const updateNode = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map(node => {
            if (node.id === editingNodeId) {
              return { ...node, name: editingName.trim() };
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) };
            }
            return node;
          });
        };
        return updateNode(data);
      });
    }
    setEditingNodeId(null);
    setEditingName('');
  }, [editingNodeId, editingName, updateTreeData]);

  // Cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingNodeId(null);
    setEditingName('');
  }, []);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    updateTreeData(data => {
      const deleteNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (node.id === nodeId) return false;
          if (node.children) {
            node.children = deleteNode(node.children);
          }
          return true;
        });
      };
      return deleteNode(data);
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [updateTreeData, selectedNodeId]);

  // Copy/Cut node
  const handleCopyNode = useCallback((nodeId: string, action: 'copy' | 'cut') => {
    const node = findNode(treeData, nodeId);
    if (node) {
      setClipboard({ node, action });
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [treeData, findNode]);

  // Paste node
  const handlePasteNode = useCallback((targetNodeId: string) => {
    if (!clipboard) return;

    const targetNode = findNode(treeData, targetNodeId);
    if (!targetNode || targetNode.type !== 'folder') return;

    updateTreeData(data => {
      const newNode = { 
        ...clipboard.node, 
        id: `${targetNodeId}-${Date.now()}`,
        parent: targetNodeId
      };

      const addNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === targetNodeId) {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return { ...node, children: addNode(node.children) };
          }
          return node;
        });
      };

      let result = addNode(data);

      // If cut, remove original node
      if (clipboard.action === 'cut') {
        const deleteOriginal = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.filter(node => {
            if (node.id === clipboard.node.id) return false;
            if (node.children) {
              node.children = deleteOriginal(node.children);
            }
            return true;
          });
        };
        result = deleteOriginal(result);
      }

      return result;
    });

    setClipboard(null);
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [clipboard, treeData, findNode, updateTreeData]);

  // Add new node
  const handleAddNode = useCallback((parentId: string, type: 'folder' | 'file') => {
    const newNode: TreeNode = {
      id: `${parentId}-${Date.now()}`,
      name: type === 'folder' ? 'New Folder' : 'New File',
      type,
      parent: parentId,
      fileType: type === 'file' ? 'text' : undefined,
      size: type === 'file' ? 0 : undefined,
      modified: new Date().toISOString().split('T')[0]
    };

    updateTreeData(data => {
      const addNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return { ...node, children: addNode(node.children) };
          }
          return node;
        });
      };
      return addNode(data);
    });

    setExpandedNodes(prev => new Set(prev).add(parentId));
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, [updateTreeData]);

  // Flatten tree for search
  const flattenTree = useCallback((nodes: TreeNode[], level = 0): TreeNode[] => {
    const result: TreeNode[] = [];
    for (const node of nodes) {
      result.push({ ...node, level });
      if (node.children && expandedNodes.has(node.id)) {
        result.push(...flattenTree(node.children, level + 1));
      }
    }
    return result;
  }, [expandedNodes]);

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchTerm) return flattenTree(treeData);
    
    const filtered = flattenTree(treeData).filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered;
  }, [treeData, searchTerm, flattenTree]);

  // Render tree node
  const renderTreeNode = useCallback((node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const isEditing = editingNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const level = node.level || 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleNodeSelect(node.id)}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        >
          {/* Expand/Collapse Button */}
          {node.type === 'folder' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {hasChildren && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
            </button>
          ) : (
            <div className="w-4 h-4" />
          )}

          {/* Icon */}
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            getFileIcon(node.fileType)
          )}

          {/* Name */}
          <div className="flex-1 flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="flex-1 px-1 py-0 text-sm border border-blue-500 rounded focus:outline-none"
                autoFocus
              />
            ) : (
              <>
                <span className="text-sm text-gray-900">{node.name}</span>
                {node.type === 'file' && node.size && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(node.size)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    expandedNodes,
    selectedNodeId,
    editingNodeId,
    editingName,
    handleNodeSelect,
    handleContextMenu,
    toggleNode,
    getFileIcon,
    formatFileSize,
    handleSaveEdit,
    handleCancelEdit
  ]);

  // Close context menu on click outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tree View Explorer</h1>
        <p className="text-gray-600">
          Hierarchical file explorer with expand/collapse, context menus, and search functionality
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => handleAddNode('1', 'folder')}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Folder</span>
        </button>
        <button
          onClick={() => handleAddNode('1', 'file')}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
          <span>New File</span>
        </button>
        {clipboard && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
            <Clipboard className="w-4 h-4" />
            <span>{clipboard.action === 'copy' ? 'Copied' : 'Cut'}: {clipboard.node.name}</span>
          </div>
        )}
      </div>

      {/* Tree View */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="max-h-96 overflow-y-auto">
          {filteredTree.length > 0 ? (
            filteredTree.map(node => renderTreeNode(node))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No files or folders match your search' : 'No files or folders'}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.nodeId && findNode(treeData, contextMenu.nodeId)?.type === 'folder' && (
            <>
              <button
                onClick={() => handleAddNode(contextMenu.nodeId!, 'folder')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </button>
              <button
                onClick={() => handleAddNode(contextMenu.nodeId!, 'file')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New File
              </button>
              <div className="border-t border-gray-200 my-1" />
            </>
          )}
          <button
            onClick={() => handleEditNode(contextMenu.nodeId!)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Rename
          </button>
          <button
            onClick={() => handleCopyNode(contextMenu.nodeId!, 'copy')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => handleCopyNode(contextMenu.nodeId!, 'cut')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            Cut
          </button>
          {clipboard && contextMenu.nodeId && findNode(treeData, contextMenu.nodeId)?.type === 'folder' && (
            <button
              onClick={() => handlePasteNode(contextMenu.nodeId!)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Clipboard className="w-4 h-4" />
              Paste
            </button>
          )}
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => handleDeleteNode(contextMenu.nodeId!)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

      {/* Selected Node Details */}
      {selectedNodeId && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Item Details</h3>
          {(() => {
            const node = findNode(treeData, selectedNodeId);
            if (!node) return null;
            
            return (
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {node.name}</div>
                <div><strong>Type:</strong> {node.type}</div>
                {node.fileType && <div><strong>File Type:</strong> {node.fileType}</div>}
                {node.size && <div><strong>Size:</strong> {formatFileSize(node.size)}</div>}
                {node.modified && <div><strong>Modified:</strong> {node.modified}</div>}
                <div><strong>ID:</strong> {node.id}</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {flattenTree(treeData).filter(n => n.type === 'folder').length}
          </div>
          <div className="text-blue-600">Folders</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {flattenTree(treeData).filter(n => n.type === 'file').length}
          </div>
          <div className="text-green-600">Files</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {expandedNodes.size}
          </div>
          <div className="text-purple-600">Expanded</div>
        </div>
      </div>
    </div>
  );
};

export default TreeView; 