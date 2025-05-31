"use client"

import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Search, 
  Copy, 
  Play, 
  Pause,
  Settings,
  Terminal,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

/**
 * NextJS-Compatible Monaco Log Viewer
 * Handles SSR properly
 */
const MonacoLogViewer = ({ app }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedInstance, setSelectedInstance] = useState('all-instances');
  const [timeRange, setTimeRange] = useState('1h');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  
  // State management
  const [logs, setLogs] = useState('');
  const [filteredLogs, setFilteredLogs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalLogs, setTotalLogs] = useState(0);
  const [monacoReady, setMonacoReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const initializingRef = useRef(false);
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate sample logs
  const generateLogs = () => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const instances = ['i-1234567a', 'i-1234567b', 'i-1234567c'];
    const messages = [
      'Server started on port 3000',
      'Connected to database postgresql://localhost:5432/myapp',
      'User authenticated: john.doe@company.com from IP 192.168.1.100',
      'GET /api/users?page=1&limit=50 200 15ms - User-Agent: Mozilla/5.0',
      'Rate limit reached for IP: 192.168.1.1 (50 requests in 60s)',
      'POST /api/items {"name":"Product ABC","price":29.99} 201 32ms',
      'JWT token validation failed: TokenExpiredError at verify (/app/auth.js:45)',
      'GET /api/products?category=electronics&sort=price 200 28ms',
      'Cache hit for key: user:12345:profile (TTL: 3600s)',
      'Database query failed: SELECT * FROM orders WHERE user_id = $1 - Error: connection timeout after 5000ms',
      'Database connection pool recovered: 5/10 connections active',
      'GET /api/dashboard?metrics=true&timeframe=24h 200 64ms',
      'High memory usage detected: 1.2GB/1.5GB (82%) - GC triggered',
      'Redis command: HGET session:abc123 user_id -> "12345"',
      'User session ended: john.doe@company.com (duration: 12m 23s)',
      'Uncaught exception: TypeError: Cannot read property "id" of undefined at processUser (/app/controllers/user.js:128:15)',
      'Scheduled job completed: daily-cleanup took 2.3s, processed 1,247 records',
      'SSL certificate expires in 7 days: *.example.com (expires: 2025-03-04)'
    ];
    
    const logEntries = [];
    for (let i = 0; i < 50000; i++) {
      const timestamp = new Date(Date.now() - (50000 - i) * 1000).toISOString().replace('T', ' ').slice(0, 23);
      const level = levels[Math.floor(Math.random() * levels.length)];
      const instance = instances[Math.floor(Math.random() * instances.length)];
      const message = messages[i % messages.length];
      logEntries.push(`${timestamp} [${level}] ${instance} ${message}`);
    }
    
    return logEntries.join('\n');
  };
  
  // Filter logs function
  const filterLogsData = (logText) => {
    if (!logText) return '';
    
    const hasFilters = searchTerm || selectedLevel !== 'all' || selectedInstance !== 'all-instances';
    if (!hasFilters) return logText;
    
    return logText.split('\n').filter(line => {
      if (!line) return false;
      
      const matchesSearch = !searchTerm || line.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || line.includes(`[${selectedLevel}]`);
      const matchesInstance = selectedInstance === 'all-instances' || line.includes(selectedInstance);
      
      return matchesSearch && matchesLevel && matchesInstance;
    }).join('\n');
  };
  
  // Initialize Monaco Editor (client-side only)
  useEffect(() => {
    if (!isClient || monacoReady || initializingRef.current) return;
    
    initializingRef.current = true;
    
    const initMonaco = async () => {
      try {
        console.log('Starting Monaco initialization (client-side)...');
        
        // Dynamic import for client-side only
        let monaco;
        
        if (typeof window !== 'undefined') {
          // Load Monaco dynamically
          if (!window.monaco) {
            // Load the Monaco loader
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
              script.onload = resolve;
              script.onerror = () => reject(new Error('Failed to load Monaco script'));
              document.head.appendChild(script);
            });
            
            // Wait for loader to be ready
            await new Promise(resolve => setTimeout(resolve, 200));
            
            if (typeof window.require === 'undefined') {
              throw new Error('Monaco loader not available');
            }
            
            // Configure Monaco
            window.require.config({ 
              paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } 
            });
            
            // Load Monaco modules
            await new Promise((resolve, reject) => {
              window.require(['vs/editor/editor.main'], () => {
                monaco = window.monaco;
                resolve();
              }, reject);
            });
          } else {
            monaco = window.monaco;
          }
          
          console.log('Monaco loaded, setting up editor...');
          
          // Define log language and theme
          if (!monaco.languages.getLanguages().find(lang => lang.id === 'logfile')) {
            monaco.languages.register({ id: 'logfile' });
            monaco.languages.setMonarchTokensProvider('logfile', {
              tokenizer: {
                root: [
                  [/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}/, 'timestamp'],
                  [/\[ERROR\]/, 'log-error'],
                  [/\[WARN\]/, 'log-warn'], 
                  [/\[INFO\]/, 'log-info'],
                  [/\[DEBUG\]/, 'log-debug'],
                  [/i-[a-zA-Z0-9]+/, 'instance'],
                  [/\b(GET|POST|PUT|DELETE)\b/, 'http-method'],
                  [/\b(200|201|204)\b/, 'http-success'],
                  [/\b(400|401|403|404|500|502|503|504)\b/, 'http-error'],
                  [/"[^"]*"/, 'string'],
                  [/\{[^}]*\}/, 'json']
                ]
              }
            });
            
            monaco.editor.defineTheme('log-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'timestamp', foreground: '64748B' },
                { token: 'log-error', foreground: 'EF4444', fontStyle: 'bold' },
                { token: 'log-warn', foreground: 'F59E0B', fontStyle: 'bold' },
                { token: 'log-info', foreground: '3B82F6', fontStyle: 'bold' },
                { token: 'log-debug', foreground: '9CA3AF' },
                { token: 'instance', foreground: 'A78BFA' },
                { token: 'http-method', foreground: '10B981', fontStyle: 'bold' },
                { token: 'http-success', foreground: '10B981' },
                { token: 'http-error', foreground: 'EF4444' },
                { token: 'string', foreground: '34D399' },
                { token: 'json', foreground: 'FBBF24' }
              ],
              colors: {
                'editor.background': '#0F172A',
                'editor.foreground': '#E2E8F0',
                'editor.lineHighlightBackground': '#1E293B20',
                'editor.selectionBackground': '#334155',
                'editorLineNumber.foreground': '#475569',
                'editorLineNumber.activeForeground': '#64748B',
                'editor.inactiveSelectionBackground': '#1E293B30',
                'editorCursor.foreground': 'transparent',
                'editorWidget.background': '#1E293B',
                'editorWidget.border': '#374151',
                'input.background': '#1E293B',
                'input.border': '#374151',
                'dropdown.background': '#1E293B',
                'dropdown.border': '#374151',
                'scrollbar.shadow': '#00000000',
                'scrollbarSlider.background': '#37415130',
                'scrollbarSlider.hoverBackground': '#37415150',
                'scrollbarSlider.activeBackground': '#37415170'
              }
            });
          }
          
          // Create editor if container is ready
          if (monacoRef.current && !editorRef.current) {
            console.log('Creating Monaco editor instance...');
            
            editorRef.current = monaco.editor.create(monacoRef.current, {
              value: 'Monaco Editor ready!\n\nClick "Load Logs" to generate 50,000 sample log entries with syntax highlighting.',
              language: 'logfile',
              theme: 'log-dark',
              readOnly: true,
              fontSize: fontSize,
              lineNumbers: showLineNumbers ? 'on' : 'off',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              contextmenu: false,
              selectOnLineNumbers: false,
              selectionHighlight: false,
              occurrencesHighlight: false,
              renderLineHighlight: 'none',
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              overviewRulerLanes: 0,
              quickSuggestions: false,
              parameterHints: { enabled: false },
              suggestOnTriggerCharacters: false,
              acceptSuggestionOnEnter: 'off',
              tabCompletion: 'off',
              wordBasedSuggestions: false,
              find: {
                addExtraSpaceOnTop: false,
                autoFindInSelection: 'never',
                seedSearchStringFromSelection: 'never'
              },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
                arrowSize: 0
              }
            });
            
            console.log('Monaco editor created successfully!');
            
            // Disable command palette and other unwanted keybindings
            editorRef.current.addAction({
              id: 'disable-command-palette',
              label: 'Disable Command Palette',
              keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
                monaco.KeyCode.F1
              ],
              run: () => null // Do nothing - disables the command palette
            });
            
            // Override other problematic keybindings
            editorRef.current.addAction({
              id: 'disable-goto-line',
              label: 'Disable Goto Line',
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG],
              run: () => null
            });
            
            editorRef.current.addAction({
              id: 'disable-quick-open',
              label: 'Disable Quick Open',
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP],
              run: () => null
            });
            
            setMonacoReady(true);
            setError(null);
            
            // Auto-load logs after a longer delay to ensure everything is ready
            setTimeout(() => {
              handleLoadLogs();
            }, 2000);
          }
        }
        
      } catch (error) {
        console.error('Monaco initialization failed:', error);
        setError('Failed to initialize Monaco Editor: ' + error.message);
      } finally {
        initializingRef.current = false;
      }
    };
    
    // Initialize Monaco after a small delay to ensure DOM is ready
    setTimeout(initMonaco, 100);
    
    // Cleanup
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.dispose();
          editorRef.current = null;
        } catch (e) {
          console.warn('Error disposing Monaco editor:', e);
        }
      }
      setMonacoReady(false);
      initializingRef.current = false;
    };
  }, [isClient]);
  
  // Load logs with better error handling and retry logic
  const handleLoadLogs = async (retryCount = 0) => {
    const maxRetries = 3;
    
    // Check if Monaco is ready, with retry logic
    if (!monacoReady || !editorRef.current) {
      if (retryCount < maxRetries) {
        console.log(`Monaco not ready, retrying in ${(retryCount + 1) * 500}ms... (attempt ${retryCount + 1}/${maxRetries + 1})`);
        setTimeout(() => handleLoadLogs(retryCount + 1), (retryCount + 1) * 500);
        return;
      } else {
        setError('Monaco Editor not ready after multiple attempts. Please try refreshing the page.');
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading logs...');
      
      // Show loading message
      editorRef.current.setValue('Generating 50,000 log entries...\n\nThis may take a moment...');
      
      // Simulate async loading with a short delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate logs
      const newLogs = generateLogs();
      setLogs(newLogs);
      setTotalLogs(50000);
      
      // Apply any existing filters
      const displayLogs = filterLogsData(newLogs);
      setFilteredLogs(displayLogs);
      
      console.log('Setting logs in editor, length:', displayLogs.length);
      
      // Update editor with actual logs
      editorRef.current.setValue(displayLogs);
      
      // Auto-scroll to bottom if enabled
      if (autoScroll) {
        setTimeout(() => {
          if (editorRef.current) {
            const lineCount = editorRef.current.getModel()?.getLineCount() || 1;
            editorRef.current.revealLine(lineCount);
          }
        }, 100);
      }
      
      console.log('Logs loaded successfully!');
      
    } catch (error) {
      console.error('Failed to load logs:', error);
      setError('Failed to load logs: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update filtered logs when filters change
  useEffect(() => {
    if (logs && editorRef.current) {
      const newFilteredLogs = filterLogsData(logs);
      setFilteredLogs(newFilteredLogs);
      editorRef.current.setValue(newFilteredLogs);
    }
  }, [logs, searchTerm, selectedLevel, selectedInstance]);
  
  // Update editor settings
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: fontSize,
        lineNumbers: showLineNumbers ? 'on' : 'off'
      });
    }
  }, [fontSize, showLineNumbers]);
  
  const scrollToBottom = () => {
    if (editorRef.current) {
      const lineCount = editorRef.current.getModel()?.getLineCount() || 1;
      editorRef.current.revealLine(lineCount);
    }
  };
  
  const scrollToTop = () => {
    if (editorRef.current) {
      editorRef.current.revealLine(1);
    }
  };
  
  const openFind = () => {
    if (editorRef.current) {
      editorRef.current.getAction('actions.find').run();
    }
  };
  
  const copyAllLogs = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        navigator.clipboard.writeText(model.getValue());
      }
    }
  };

  // Show loading state during SSR or before client hydration
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Terminal className="text-green-400" size={20} />
            <h3 className="text-lg font-medium text-white">Monaco Log Viewer</h3>
            <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
              Initializing...
            </span>
          </div>
        </div>
        
        <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
          <div className="h-[600px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 animate-spin" size={32} />
              <div>Initializing Monaco Editor...</div>
              <div className="text-xs mt-2">Loading client-side components...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal className="text-green-400" size={20} />
          <h3 className="text-lg font-medium text-white">Monaco Log Viewer</h3>
          <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
            {totalLogs.toLocaleString()} lines
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            monacoReady 
              ? 'text-green-400 bg-green-900/30' 
              : 'text-yellow-400 bg-yellow-900/30'
          }`}>
            Monaco {monacoReady ? 'Ready' : 'Loading...'}
          </span>
          {isLoading && (
            <div className="flex items-center gap-1">
              <Loader2 className="text-blue-400 animate-spin" size={14} />
              <span className="text-xs text-blue-400">Generating logs...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLoadLogs()}
            disabled={!monacoReady || isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Load/Refresh logs"
          >
            {isLoading ? 'Loading...' : (logs ? 'Refresh' : 'Load')} Logs
          </button>
          <button
            onClick={openFind}
            disabled={!monacoReady}
            className="p-2 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            title="Search (Ctrl+F)"
          >
            <Search size={16} />
          </button>
          <button
            onClick={scrollToTop}
            disabled={!monacoReady}
            className="p-2 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            title="Scroll to top"
          >
            ↑
          </button>
          <button
            onClick={scrollToBottom}
            disabled={!monacoReady}
            className="p-2 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded transition-colors ${
              autoScroll 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            title="Toggle auto-scroll"
          >
            {autoScroll ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`p-2 rounded transition-colors ${
              showLineNumbers 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            title="Toggle line numbers"
          >
            <Settings size={16} />
          </button>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={10}>Tiny</option>
            <option value={12}>Small</option>
            <option value={14}>Medium</option>
            <option value={16}>Large</option>
            <option value={18}>X-Large</option>
          </select>
          <button
            onClick={copyAllLogs}
            disabled={!monacoReady}
            className="p-2 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            title="Copy all logs"
          >
            <Copy size={16} />
          </button>
          <button className="p-2 bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-400" size={16} />
            <span className="font-medium">Error:</span>
            <span>{error}</span>
            <button 
              onClick={() => handleLoadLogs()}
              className="ml-auto text-red-300 hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-slate-800/50 p-3 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter logs (or use Ctrl+F for full search)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-64"
          />
        </div>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="ERROR">ERROR</option>
          <option value="WARN">WARN</option>
          <option value="INFO">INFO</option>
          <option value="DEBUG">DEBUG</option>
        </select>

        <select
          value={selectedInstance}
          onChange={(e) => setSelectedInstance(e.target.value)}
          className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        >
          <option value="all-instances">All Instances</option>
          <option value="i-1234567a">i-1234567a</option>
          <option value="i-1234567b">i-1234567b</option>
          <option value="i-1234567c">i-1234567c</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        >
          <option value="1h">Last 1 hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>

      {/* Monaco Editor Container */}
      <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700/50">
        {!monacoReady && !error && (
          <div className="h-[600px] flex items-center justify-center text-gray-400 bg-slate-950">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 animate-spin" size={32} />
              <div>Loading Monaco Editor...</div>
              <div className="text-xs mt-2 text-slate-500">Setting up client-side components...</div>
            </div>
          </div>
        )}
        
        <div 
          ref={monacoRef}
          style={{ 
            height: '600px',
            display: monacoReady || error ? 'block' : 'none',
            cursor: 'default'
          }}
          className="w-full bg-slate-950"
        />
        
        {error && !monacoReady && (
          <div className="h-[600px] flex items-center justify-center text-red-400 bg-slate-950/50">
            <div className="text-center p-8">
              <AlertCircle className="mx-auto mb-3" size={32} />
              <div className="font-medium mb-2">Failed to load Monaco Editor</div>
              <div className="text-sm text-gray-400 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 bg-slate-800/30 px-3 py-2 rounded">
        <div className="flex items-center gap-4">
          <span>Total: {totalLogs.toLocaleString()} lines</span>
          <span>Filtered: {filteredLogs.split('\n').length.toLocaleString()} lines</span>
          <span>Features: Ctrl+F (Find), Ctrl+G (Go to Line), Ctrl+A (Select All)</span>
          <span className={autoScroll ? 'text-green-400' : ''}>
            Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonacoLogViewer;