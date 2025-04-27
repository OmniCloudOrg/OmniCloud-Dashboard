import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Code, Save, X } from 'lucide-react';
import { Rnd } from 'react-rnd';
import * as Monaco from 'monaco-editor';

declare global {
  interface Window {
    monaco: typeof Monaco;
  }
}

// Dynamically import Monaco Editor with SSR disabled
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), { 
  ssr: false 
});

// Type definitions for the component props
interface FileEditorModalProps {
  isOpen: boolean;
  file: {
    name: string;
    type: string;
    content: string;
    lastModified: string;
    size: string;
  };
  onClose: () => void;
  onSave: (fileName: string, content: string) => void;
}

// Mapping file types to Monaco Editor language
const getLanguageFromFileType = (fileType: string): string => {
  const languageMap: { [key: string]: string } = {
    'markdown': 'markdown',
    'json': 'json',
    'yaml': 'yaml',
    'config': 'ini',
    'log': 'log',
    'html': 'html',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'css': 'css',
    'xml': 'xml',
    'sql': 'sql',
    'python': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'php': 'php',
    'ruby': 'ruby',
    'go': 'go',
    'rust': 'rust',
    'shell': 'shell',
    'dockerfile': 'dockerfile',
    'perl': 'perl',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'scala': 'scala',
    'powershell': 'powershell'
  };

  return languageMap[fileType] || 'plaintext';
};

/**
 * FileEditorModal Component
 * A draggable and resizable modal window for editing files using react-rnd.
 */
const FileEditorModal: React.FC<FileEditorModalProps> = ({ 
  isOpen, 
  file, 
  onClose, 
  onSave 
}) => {
  // Refs
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for window dimensions and position
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Window boundaries
  const [boundaries, setBoundaries] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Constants
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 300;
  
  // Update boundaries on window resize
  useEffect(() => {
    const handleResize = () => {
      setBoundaries({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Ensure modal stays within bounds when window resizes
      setPosition(prevPosition => ({
        x: Math.min(prevPosition.x, window.innerWidth - size.width),
        y: Math.min(prevPosition.y, window.innerHeight - size.height)
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);
  
  // Initialize window position when opened
  useEffect(() => {
    if (isOpen) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Center the window in the viewport
      setPosition({
        x: Math.max(0, Math.round((viewportWidth - size.width) / 2)),
        y: Math.max(0, Math.round((viewportHeight - size.height) / 2))
      });
      
      // Update boundaries
      setBoundaries({
        width: viewportWidth,
        height: viewportHeight
      });
    }
  }, [isOpen]);

  // Monaco editor theme setup
  useEffect(() => {
    // Define the theme setup function
    const setupMonacoTheme = () => {
      // Check if Monaco is available in the window object
      if (window.monaco) {
        try {
          window.monaco.editor.defineTheme('tailwind-gray-900', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6b7280' }, // gray-500
              { token: 'keyword', foreground: '93c5fd' }, // blue-300
              { token: 'string', foreground: 'a7f3d0' }, // emerald-200
              { token: 'number', foreground: 'fca5a5' }, // red-300
              { token: 'type', foreground: 'c4b5fd' } // violet-300
            ],
            colors: {
              // Editor Core
              'editor.background': '#111827', // gray-900
              'editor.foreground': '#f3f4f6', // gray-100
              'editorCursor.foreground': '#f3f4f6', // gray-100
              'editor.selectionBackground': '#374151', // gray-700
              'editor.selectionHighlightBackground': '#374151aa', // gray-700 with alpha
              'editor.inactiveSelectionBackground': '#2d3748', // gray-800 (darker)
              'editor.lineHighlightBackground': '#1f2937', // gray-800
              'editorLineNumber.foreground': '#6b7280', // gray-500
              'editorLineNumber.activeForeground': '#e5e7eb', // gray-200
              'editorGutter.background': '#111827', // gray-900
              
              // Editor Widgets
              'editorWidget.background': '#1f2937', // gray-800
              'editorWidget.foreground': '#e5e7eb', // gray-200
              'editorWidget.border': '#374151', // gray-700
              'editorWidget.resizeBorder': '#3b82f6', // blue-500
              'widget.shadow': '#0f172a', // slate-900 (slightly darker)
              
              // Dropdowns
              'dropdown.background': '#1f2937', // gray-800
              'dropdown.listBackground': '#1f2937', // gray-800
              'dropdown.border': '#374151', // gray-700
              'dropdown.foreground': '#e5e7eb', // gray-200
              
              // Lists
              'list.activeSelectionBackground': '#374151', // gray-700
              'list.activeSelectionForeground': '#f3f4f6', // gray-100
              'list.hoverBackground': '#1f2937', // gray-800
              'list.hoverForeground': '#f3f4f6', // gray-100
              'list.highlightForeground': '#3b82f6', // blue-500
              'list.inactiveSelectionBackground': '#1f2937', // gray-800
              'list.inactiveSelectionForeground': '#e5e7eb', // gray-200
              'list.focusBackground': '#374151', // gray-700
              'list.focusForeground': '#f3f4f6', // gray-100
              
              // Input Controls
              'input.background': '#1f2937', // gray-800
              'input.border': '#374151', // gray-700
              'input.foreground': '#e5e7eb', // gray-200
              'input.placeholderForeground': '#9ca3af', // gray-400
              
              // Suggestion Widget
              'editorSuggestWidget.background': '#1f2937', // gray-800
              'editorSuggestWidget.border': '#374151', // gray-700
              'editorSuggestWidget.foreground': '#e5e7eb', // gray-200
              'editorSuggestWidget.highlightForeground': '#3b82f6', // blue-500
              'editorSuggestWidget.selectedBackground': '#374151', // gray-700
              
              // Hover Widget
              'editorHoverWidget.background': '#1f2937', // gray-800
              'editorHoverWidget.border': '#374151', // gray-700
              'editorHoverWidget.foreground': '#e5e7eb', // gray-200
              'editorHoverWidget.statusBarBackground': '#111827', // gray-900
              
              // Context Menu
              'menu.background': '#1f2937', // gray-800
              'menu.foreground': '#e5e7eb', // gray-200
              'menu.selectionBackground': '#374151', // gray-700
              'menu.selectionForeground': '#f3f4f6', // gray-100
              'menu.selectionBorder': '#4b5563', // gray-600
              'menu.separatorBackground': '#374151', // gray-700
              'menu.border': '#374151', // gray-700
              
              // Command Palette
              'quickInput.background': '#1f2937', // gray-800
              'quickInput.foreground': '#e5e7eb', // gray-200
              'quickInputTitle.background': '#1f2937', // gray-800
              'pickerGroup.border': '#374151', // gray-700
              'pickerGroup.foreground': '#9ca3af', // gray-400
              
              // Scrollbar
              'scrollbar.shadow': '#000000',
              'scrollbarSlider.background': '#4b556380', // gray-600 with alpha
              'scrollbarSlider.hoverBackground': '#6b728080', // gray-500 with alpha
              'scrollbarSlider.activeBackground': '#9ca3af80', // gray-400 with alpha
              
              // Status Bar
              'statusBar.background': '#111827', // gray-900
              'statusBar.foreground': '#e5e7eb', // gray-200
              'statusBar.border': '#1f2937', // gray-800
              
              // Other UI elements
              'editorBracketMatch.background': '#374151', // gray-700
              'editorBracketMatch.border': '#4b5563', // gray-600
              'editorOverviewRuler.border': '#1f2937', // gray-800
              'editorOverviewRuler.findMatchForeground': '#92400e80', // amber-800 with alpha
              'editorOverviewRuler.errorForeground': '#ef444480', // red-500 with alpha
              'editorOverviewRuler.warningForeground': '#f59e0b80', // amber-500 with alpha
              'tab.activeBackground': '#111827', // gray-900
              'tab.inactiveBackground': '#1f2937', // gray-800
              'tab.activeForeground': '#f3f4f6', // gray-100
              'tab.inactiveForeground': '#9ca3af', // gray-400
              'tab.border': '#1f2937' // gray-800
            }
          });
          
          // Set the theme as the active theme
          window.monaco.editor.setTheme('tailwind-gray-900');
        } catch (error) {
          console.error('Error defining Monaco theme:', error);
        }
      }
    };
    
    // Try to setup theme immediately
    setupMonacoTheme();
    
    // Also set up an interval to check for Monaco being available
    const themeInterval = setInterval(() => {
      if (window.monaco) {
        setupMonacoTheme();
        clearInterval(themeInterval);
      }
    }, 100);
    
    // Clean up the interval on unmount
    return () => clearInterval(themeInterval);
  }, []);

  // Handle editor mounting
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Handle file save
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      onSave(file.name, content);
    }
  };

  // Calculate editor height based on window size
  const editorHeight = size.height - 100; // Account for header and footer height

  // Check position is within boundaries before drag ends
  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    // Ensure the modal doesn't go off-screen
    const x = Math.max(0, Math.min(d.x, boundaries.width - size.width));
    const y = Math.max(0, Math.min(d.y, boundaries.height - size.height));
    
    setPosition({ x, y });
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={position}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        dragHandleClassName="drag-handle"
        onDragStop={handleDragStop}
        onResize={(e, direction, ref, delta, position) => {
          const newWidth = ref.offsetWidth;
          const newHeight = ref.offsetHeight;
          
          // Update size
          setSize({
            width: newWidth,
            height: newHeight
          });
          
          // Ensure position remains valid when resizing
          const newX = Math.max(0, Math.min(position.x, boundaries.width - newWidth));
          const newY = Math.max(0, Math.min(position.y, boundaries.height - newHeight));
          
          if (newX !== position.x || newY !== position.y) {
            setPosition({ x: newX, y: newY });
          }
        }}
        bounds="parent"
        enableResizing={{
          bottom: false,
          bottomLeft: false,
          bottomRight: true,
          left: false,
          right: false,
          top: false,
          topLeft: false,
          topRight: false
        }}
        className="bg-gray-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto"
      >
        <div className="flex justify-between items-center border-b border-slate-800 p-4 cursor-move drag-handle">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">{file.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {file.type}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-hidden" style={{ height: editorHeight }}>
          <MonacoEditor
            language={getLanguageFromFileType(file.type)}
            theme="tailwind-gray-900"
            value={file.content}
            options={{
              fontSize: 14,
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true },
              colorDecorators: true,
              contextmenu: true,
              fixedOverflowWidgets: true
            }}
            height={editorHeight}
            onMount={handleEditorDidMount}
          />
        </div>

        <div className="border-t border-slate-800 p-3 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Last modified: {file.lastModified}
          </div>
          <div className="text-xs text-slate-500">
            Size: {file.size}
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default FileEditorModal;