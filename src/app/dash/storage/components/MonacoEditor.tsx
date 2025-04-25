// components/MonacoFileEditor.tsx
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
    'sql': 'sql'
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


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
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
            theme="vs-dark"
            value={file.content}
            options={{
              fontSize: 14,
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true }
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