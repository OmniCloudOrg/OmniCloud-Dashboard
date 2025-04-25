import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Code, Save, X } from 'lucide-react';

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

const FileEditorModal: React.FC<FileEditorModalProps> = ({ 
  isOpen, 
  file, 
  onClose, 
  onSave 
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      onSave(file.name, content);
    }
  };


  // Define custom Monaco theme to match Tailwind gray-900
  useEffect(() => {
    // Define the theme setup function
    const setupMonacoTheme = () => {
      // Check if Monaco is available in the window object
      // @ts-ignore
      if (window.monaco) {
        try {
          // @ts-ignore
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
              
              // Editor Widgets (critical for fixing white elements)
              'editorWidget.background': '#1f2937', // gray-800
              'editorWidget.foreground': '#e5e7eb', // gray-200
              'editorWidget.border': '#374151', // gray-700
              'editorWidget.resizeBorder': '#3b82f6', // blue-500
              'widget.shadow': '#0f172a', // slate-900 (slightly darker)
              
              // Dropdowns (commonly white in Next.js)
              'dropdown.background': '#1f2937', // gray-800
              'dropdown.listBackground': '#1f2937', // gray-800
              'dropdown.border': '#374151', // gray-700
              'dropdown.foreground': '#e5e7eb', // gray-200
              
              // Lists (for autocomplete, etc.)
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
              
              // Suggestion Widget (autocomplete popup)
              'editorSuggestWidget.background': '#1f2937', // gray-800
              'editorSuggestWidget.border': '#374151', // gray-700
              'editorSuggestWidget.foreground': '#e5e7eb', // gray-200
              'editorSuggestWidget.highlightForeground': '#3b82f6', // blue-500
              'editorSuggestWidget.selectedBackground': '#374151', // gray-700
              
              // Hover Widget (tooltips)
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
          // @ts-ignore
          window.monaco.editor.setTheme('tailwind-gray-900');
          
          console.log('Monaco theme defined successfully');
        } catch (error) {
          console.error('Error defining Monaco theme:', error);
        }
      }
    };
    
    // Try to setup theme immediately
    setupMonacoTheme();
    
    // Also set up an interval to check for Monaco being available (for Next.js dynamic loading)
    const themeInterval = setInterval(() => {
      // @ts-ignore
      if (window.monaco) {
        setupMonacoTheme();
        clearInterval(themeInterval);
      }
    }, 100);
    
    // Clean up the interval on unmount
    return () => clearInterval(themeInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-slate-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-800 p-4">
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

        <div className="flex-grow overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
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
              // Add additional options to override any remaining white elements
              colorDecorators: true,
              contextmenu: true,
              fixedOverflowWidgets: true,
              // Override default colors at the options level too
              colors: {
                'editor.background': '#111827',
                'editorWidget.background': '#1f2937'
              }
            }}
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
      </div>
    </div>
  );
};

export default FileEditorModal;