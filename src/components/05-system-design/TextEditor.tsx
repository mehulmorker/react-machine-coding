import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Palette,
  Type,
  Search,
  Replace,
  Save,
  Download,
  Upload,
  Copy,
  Scissors,
  FileText,
  MoreHorizontal,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Link,
  Image,
  Table,
  Settings
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  characterCount: number;
}

interface FormatCommand {
  command: string;
  value?: string;
}

interface EditorStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
}

const TextEditor: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Welcome Document',
      content: '<h1>Welcome to the Text Editor</h1><p>This is a full-featured rich text editor with document management capabilities.</p>',
      lastModified: new Date(),
      wordCount: 15,
      characterCount: 98
    }
  ]);
  const [activeDocumentId, setActiveDocumentId] = useState<string>('1');
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  const calculateStats = (content: string): EditorStats => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = content.split(/<\/?p[^>]*>/i).filter(p => p.trim()).length || 1;

    return { words, characters, charactersNoSpaces, paragraphs };
  };

  const updateDocument = (content: string) => {
    if (!activeDocument) return;

    const stats = calculateStats(content);
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === activeDocumentId
          ? {
              ...doc,
              content,
              lastModified: new Date(),
              wordCount: stats.words,
              characterCount: stats.characters
            }
          : doc
      )
    );
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      updateDocument(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (format: FormatCommand) => {
    document.execCommand(format.command, false, format.value);
    editorRef.current?.focus();
    handleEditorChange();
  };

  const createNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: `Document ${documents.length + 1}`,
      content: '<p>Start writing...</p>',
      lastModified: new Date(),
      wordCount: 2,
      characterCount: 16
    };
    setDocuments([...documents, newDoc]);
    setActiveDocumentId(newDoc.id);
  };

  const deleteDocument = (docId: string) => {
    if (documents.length === 1) return;
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
    if (docId === activeDocumentId) {
      setActiveDocumentId(documents.find(doc => doc.id !== docId)?.id || documents[0].id);
    }
  };

  const renameDocument = (docId: string, newName: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId ? { ...doc, name: newName } : doc
      )
    );
  };

  const exportDocument = (format: 'html' | 'txt') => {
    if (!activeDocument) return;

    let content = activeDocument.content;
    let filename = `${activeDocument.name}.${format}`;
    let mimeType = format === 'html' ? 'text/html' : 'text/plain';

    if (format === 'txt') {
      content = content.replace(/<[^>]*>/g, '');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        content: file.type === 'text/html' ? content : `<p>${content}</p>`,
        lastModified: new Date(),
        wordCount: 0,
        characterCount: 0
      };
      const stats = calculateStats(newDoc.content);
      newDoc.wordCount = stats.words;
      newDoc.characterCount = stats.characters;
      
      setDocuments([...documents, newDoc]);
      setActiveDocumentId(newDoc.id);
    };
    reader.readAsText(file);
  };

  const findAndReplace = () => {
    if (!editorRef.current || !searchQuery) return;

    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchQuery, 'gi');
    const newContent = content.replace(regex, replaceText);
    
    editorRef.current.innerHTML = newContent;
    updateDocument(newContent);
    setShowFindReplace(false);
  };

  const insertTable = () => {
    const tableHTML = `
      <table border="1" style="border-collapse: collapse; margin: 10px 0;">
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
        <tr><td>Cell 3</td><td>Cell 4</td></tr>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHTML);
    handleEditorChange();
  };

  const stats = activeDocument ? calculateStats(activeDocument.content) : null;

  return (
    <div className={`flex h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 ${isFullscreen ? 'w-64' : 'w-80'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Text Editor</h2>
          <button
            onClick={createNewDocument}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Document
          </button>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Documents</h3>
          {documents.map(doc => (
            <div key={doc.id} className="mb-2">
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  doc.id === activeDocumentId ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveDocumentId(doc.id)}
              >
                <div className="font-medium text-gray-800 truncate">{doc.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {doc.wordCount} words • {new Date(doc.lastModified).toLocaleDateString()}
                </div>
              </div>
              <div className="flex mt-1 space-x-1">
                <button
                  onClick={() => {
                    const newName = prompt('Enter new name:', doc.name);
                    if (newName) renameDocument(doc.id, newName);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Rename
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                  disabled={documents.length === 1}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Import/Export */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
            >
              Import Document
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => exportDocument('html')}
                className="flex-1 text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Export HTML
              </button>
              <button
                onClick={() => exportDocument('txt')}
                className="flex-1 text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Export TXT
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {showStats && stats && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-2">Statistics</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Words: {stats.words}</div>
              <div>Characters: {stats.characters}</div>
              <div>Characters (no spaces): {stats.charactersNoSpaces}</div>
              <div>Paragraphs: {stats.paragraphs}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center space-x-2 flex-wrap">
            {/* File Operations */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => setShowFindReplace(!showFindReplace)}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Find & Replace"
              >
                🔍
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Fullscreen"
              >
                {isFullscreen ? '📴' : '📺'}
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Toggle Stats"
              >
                📊
              </button>
            </div>

            {/* Formatting */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => executeCommand({ command: 'bold' })}
                className="p-2 rounded hover:bg-gray-100 font-bold text-gray-700"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => executeCommand({ command: 'italic' })}
                className="p-2 rounded hover:bg-gray-100 italic text-gray-700"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => executeCommand({ command: 'underline' })}
                className="p-2 rounded hover:bg-gray-100 underline text-gray-700"
                title="Underline"
              >
                U
              </button>
              <button
                onClick={() => executeCommand({ command: 'strikeThrough' })}
                className="p-2 rounded hover:bg-gray-100 line-through text-gray-700"
                title="Strikethrough"
              >
                S
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => executeCommand({ command: 'justifyLeft' })}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Align Left"
              >
                ⬅️
              </button>
              <button
                onClick={() => executeCommand({ command: 'justifyCenter' })}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Center"
              >
                ⬇️
              </button>
              <button
                onClick={() => executeCommand({ command: 'justifyRight' })}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Align Right"
              >
                ➡️
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
              <button
                onClick={() => executeCommand({ command: 'insertUnorderedList' })}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Bullet List"
              >
                • List
              </button>
              <button
                onClick={() => executeCommand({ command: 'insertOrderedList' })}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Number List"
              >
                1. List
              </button>
            </div>

            {/* Font Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  executeCommand({ command: 'fontName', value: e.target.value });
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(Number(e.target.value));
                  executeCommand({ command: 'fontSize', value: e.target.value });
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>

            {/* Additional Tools */}
            <div className="flex items-center space-x-1">
              <button
                onClick={insertTable}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Insert Table"
              >
                📋
              </button>
              <button
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) executeCommand({ command: 'createLink', value: url });
                }}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                title="Insert Link"
              >
                🔗
              </button>
            </div>
          </div>

          {/* Find & Replace Bar */}
          {showFindReplace && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Find..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                />
                <button
                  onClick={findAndReplace}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Replace All
                </button>
                <button
                  onClick={() => setShowFindReplace(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: activeDocument?.content || '' }}
            onInput={handleEditorChange}
            className="min-h-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: '1.5'
            }}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.html,.htm"
        onChange={importDocument}
        className="hidden"
      />
    </div>
  );
};

export default TextEditor; 