import React, { useState, useRef, useEffect } from 'react';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  lastModified: Date;
  size: number;
}

interface Theme {
  name: string;
  background: string;
  foreground: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  operator: string;
}

interface Language {
  name: string;
  extension: string;
  keywords: string[];
  comment: string;
}

const CodeEditor: React.FC = () => {
  const themes: Theme[] = [
    {
      name: 'Dark',
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      comment: '#6a9955',
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      operator: '#d4d4d4'
    },
    {
      name: 'Light',
      background: '#ffffff',
      foreground: '#000000',
      comment: '#008000',
      keyword: '#0000ff',
      string: '#a31515',
      number: '#098658',
      operator: '#000000'
    },
    {
      name: 'Monokai',
      background: '#272822',
      foreground: '#f8f8f2',
      comment: '#75715e',
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      operator: '#f8f8f2'
    }
  ];

  const languages: Language[] = [
    {
      name: 'JavaScript',
      extension: 'js',
      keywords: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      comment: '//'
    },
    {
      name: 'TypeScript',
      extension: 'ts',
      keywords: ['interface', 'type', 'const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      comment: '//'
    },
    {
      name: 'Python',
      extension: 'py',
      keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return', 'try', 'except'],
      comment: '#'
    },
    {
      name: 'HTML',
      extension: 'html',
      keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style'],
      comment: '<!--'
    },
    {
      name: 'CSS',
      extension: 'css',
      keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position'],
      comment: '/*'
    },
    {
      name: 'JSON',
      extension: 'json',
      keywords: ['true', 'false', 'null'],
      comment: ''
    }
  ];

  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'welcome.js',
      language: 'JavaScript',
      content: `// Welcome to the Code Editor
console.log("Hello, World!");

function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("Developer");
console.log(message);`,
      lastModified: new Date(),
      size: 156
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [wordWrap, setWordWrap] = useState<boolean>(false);
  const [minimap, setMinimap] = useState<boolean>(true);
  const [autoComplete, setAutoComplete] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{line: number, column: number}>({line: 1, column: 1});

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(file => file.id === activeFileId);
  const activeLanguage = languages.find(lang => lang.name === activeFile?.language);

  const updateFile = (content: string) => {
    if (!activeFile) return;

    setFiles(files =>
      files.map(file =>
        file.id === activeFileId
          ? {
              ...file,
              content,
              lastModified: new Date(),
              size: content.length
            }
          : file
      )
    );
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    updateFile(content);
    updateCursorPosition();
  };

  const updateCursorPosition = () => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const content = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    const lines = content.substring(0, cursorPos).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line, column });
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name (with extension):');
    if (!fileName) return;

    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const language = languages.find(lang => lang.extension === extension)?.name || 'JavaScript';

    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: fileName,
      language,
      content: '',
      lastModified: new Date(),
      size: 0
    };

    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const deleteFile = (fileId: string) => {
    if (files.length === 1) return;
    setFiles(files => files.filter(file => file.id !== fileId));
    if (fileId === activeFileId) {
      setActiveFileId(files.find(file => file.id !== fileId)?.id || files[0].id);
    }
  };

  const changeLanguage = (language: string) => {
    if (!activeFile) return;
    setFiles(files =>
      files.map(file =>
        file.id === activeFileId ? { ...file, language } : file
      )
    );
  };

  const downloadFile = () => {
    if (!activeFile) return;

    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const language = languages.find(lang => lang.extension === extension)?.name || 'JavaScript';

      const newFile: CodeFile = {
        id: Date.now().toString(),
        name: file.name,
        language,
        content,
        lastModified: new Date(),
        size: content.length
      };

      setFiles([...files, newFile]);
      setActiveFileId(newFile.id);
    };
    reader.readAsText(file);
  };

  const formatCode = () => {
    if (!activeFile || !editorRef.current) return;

    let formattedContent = activeFile.content;
    
    // Basic formatting for JavaScript/TypeScript
    if (activeFile.language === 'JavaScript' || activeFile.language === 'TypeScript') {
      formattedContent = formattedContent
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n')
        .replace(/}/g, '\n}\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    }

    updateFile(formattedContent);
  };

  const insertTemplate = () => {
    if (!activeFile) return;

    let template = '';
    
    switch (activeFile.language) {
      case 'JavaScript':
        template = `// JavaScript Template
function main() {
    console.log("Hello, World!");
}

main();`;
        break;
      case 'TypeScript':
        template = `// TypeScript Template
interface User {
    name: string;
    age: number;
}

function greetUser(user: User): string {
    return \`Hello, \${user.name}!\`;
}`;
        break;
      case 'Python':
        template = `# Python Template
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`;
        break;
      case 'HTML':
        template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`;
        break;
      case 'CSS':
        template = `/* CSS Template */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
}`;
        break;
      default:
        template = '// Template code here';
    }

    updateFile(template);
  };

  const findAndReplace = () => {
    if (!activeFile || !searchQuery) return;

    const newContent = activeFile.content.replace(new RegExp(searchQuery, 'g'), replaceText);
    updateFile(newContent);
    setShowFindReplace(false);
  };

  const syntaxHighlight = (code: string, language: Language): string => {
    let highlighted = code;

    // Highlight keywords
    language.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span style="color: ${currentTheme.keyword}">${keyword}</span>`);
    });

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
      `<span style="color: ${currentTheme.string}">$1$2$1</span>`);

    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, 
      `<span style="color: ${currentTheme.number}">$&</span>`);

    // Highlight comments
    if (language.comment) {
      const commentRegex = language.comment === '//' ? 
        /\/\/.*$/gm : 
        language.comment === '#' ? 
        /#.*$/gm : 
        /<!--.*?-->/gs;
      
      highlighted = highlighted.replace(commentRegex, 
        `<span style="color: ${currentTheme.comment}">$&</span>`);
    }

    return highlighted;
  };

  const getLineNumbers = () => {
    if (!activeFile) return [];
    const lines = activeFile.content.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.addEventListener('selectionchange', updateCursorPosition);
      editorRef.current.addEventListener('keyup', updateCursorPosition);
      editorRef.current.addEventListener('click', updateCursorPosition);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-3">Code Editor</h2>
          <button
            onClick={createNewFile}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New File
          </button>
        </div>

        {/* File Explorer */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold text-gray-300 mb-3">Files</h3>
          {files.map(file => (
            <div key={file.id} className="mb-2">
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  file.id === activeFileId ? 'bg-blue-900 border-2 border-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <div className="font-medium text-white truncate">{file.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {file.language} • {file.size} chars • {new Date(file.lastModified).toLocaleDateString()}
                </div>
              </div>
              <div className="flex mt-1 space-x-1">
                <button
                  onClick={() => {
                    const newName = prompt('Enter new name:', file.name);
                    if (newName) {
                      const extension = newName.split('.').pop()?.toLowerCase() || '';
                      const language = languages.find(lang => lang.extension === extension)?.name || file.language;
                      setFiles(files =>
                        files.map(f =>
                          f.id === file.id ? { ...f, name: newName, language } : f
                        )
                      );
                    }
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Rename
                </button>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                  disabled={files.length === 1}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-700 space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Theme</label>
            <select
              value={currentTheme.name}
              onChange={(e) => setCurrentTheme(themes.find(t => t.name === e.target.value) || themes[0])}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              {themes.map(theme => (
                <option key={theme.name} value={theme.name}>{theme.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              {[10, 12, 14, 16, 18, 20, 24].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Line Numbers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Word Wrap</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={minimap}
                onChange={(e) => setMinimap(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-300">Minimap</span>
            </label>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500"
            >
              Import
            </button>
            <button
              onClick={downloadFile}
              className="flex-1 text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Language:</span>
                <select
                  value={activeFile?.language || ''}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.name} value={lang.name}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFindReplace(!showFindReplace)}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Find & Replace
                </button>
                <button
                  onClick={formatCode}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Format
                </button>
                <button
                  onClick={insertTemplate}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Template
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Line {cursorPosition.line}, Column {cursorPosition.column}
              </span>
              <span className="text-sm text-gray-400">
                {activeFile?.size || 0} characters
              </span>
            </div>
          </div>

          {/* Find & Replace Bar */}
          {showFindReplace && (
            <div className="mt-3 p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Find..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm flex-1"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm flex-1"
                />
                <button
                  onClick={findAndReplace}
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Replace All
                </button>
                <button
                  onClick={() => setShowFindReplace(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex">
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex" style={{ backgroundColor: currentTheme.background }}>
              {/* Line Numbers */}
              {lineNumbers && (
                <div 
                  className="bg-gray-800 border-r border-gray-600 px-3 py-4 select-none"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                >
                  {getLineNumbers().map(lineNum => (
                    <div key={lineNum} className="text-gray-500 text-right" style={{ height: `${fontSize * 1.5}px` }}>
                      {lineNum}
                    </div>
                  ))}
                </div>
              )}

              {/* Code Editor */}
              <div className="flex-1 relative">
                <textarea
                  ref={editorRef}
                  value={activeFile?.content || ''}
                  onChange={handleEditorChange}
                  onSelect={updateCursorPosition}
                  className="absolute inset-0 w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.5',
                    color: currentTheme.foreground,
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                    overflowWrap: wordWrap ? 'break-word' : 'normal'
                  }}
                  spellCheck={false}
                  placeholder="Start coding..."
                />
              </div>
            </div>
          </div>

          {/* Minimap */}
          {minimap && (
            <div className="w-32 bg-gray-800 border-l border-gray-600 p-2">
              <div className="text-xs text-gray-400 mb-2">Minimap</div>
              <div 
                className="text-xs overflow-hidden"
                style={{ 
                  fontSize: '2px',
                  lineHeight: '3px',
                  color: currentTheme.foreground,
                  backgroundColor: currentTheme.background,
                  maxHeight: '300px'
                }}
              >
                {activeFile?.content.split('\n').slice(0, 100).map((line, i) => (
                  <div key={i} className="truncate">{line || ' '}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>{activeFile?.name || 'No file'}</span>
              <span>{activeFile?.language || 'Plain Text'}</span>
              <span>{activeFile?.content.split('\n').length || 0} lines</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>UTF-8</span>
              <span>CRLF</span>
              <span>Spaces: 2</span>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.ts,.py,.html,.css,.json,.txt,.md"
        onChange={importFile}
        className="hidden"
      />
    </div>
  );
};

export default CodeEditor; 