import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';

const Terminal = ({ 
  instance, 
  onConnectionChange = () => {},
  className = "",
  autoConnect = true
}) => {
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const wsRef = useRef(null);
  const xtermRef = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize xterm.js terminal
  useEffect(() => {
    if (!terminalContainerRef.current) return;

    const initTerminal = async () => {
      try {
        // Dynamically import xterm.js and addons
        const { Terminal } = await import('xterm');
        const { FitAddon } = await import('xterm-addon-fit');
        const { WebLinksAddon } = await import('xterm-addon-web-links');
        
        // Create terminal instance
        const terminal = new Terminal({
          theme: {
            background: '#0f172a',
            foreground: '#e2e8f0',
            cursor: '#00ff00',
            selection: '#1e293b',
            black: '#0f172a',
            red: '#ef4444',
            green: '#22c55e',
            yellow: '#eab308',
            blue: '#3b82f6',
            magenta: '#a855f7',
            cyan: '#06b6d4',
            white: '#f1f5f9',
            brightBlack: '#475569',
            brightRed: '#f87171',
            brightGreen: '#4ade80',
            brightYellow: '#facc15',
            brightBlue: '#60a5fa',
            brightMagenta: '#c084fc',
            brightCyan: '#22d3ee',
            brightWhite: '#ffffff'
          },
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          fontSize: 13,
          lineHeight: 1.2,
          letterSpacing: 0,
          cursorBlink: true,
          cursorStyle: 'block',
          scrollback: 1000,
          tabStopWidth: 4,
          bellSound: null,
          bellStyle: 'none'
        });

        // Add addons
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);

        // Open terminal in DOM
        terminal.open(terminalContainerRef.current);
        
        // Store references
        xtermRef.current = terminal;
        terminalRef.current = { terminal, fitAddon };

        // Fit terminal to container
        fitAddon.fit();

        // Welcome message
        terminal.writeln('\x1b[32m╭─────────────────────────────────────╮\x1b[0m');
        terminal.writeln('\x1b[32m│          Remote Terminal            │\x1b[0m');
        terminal.writeln('\x1b[32m╰─────────────────────────────────────╯\x1b[0m');
        terminal.writeln('');

        // Auto-connect if enabled
        if (autoConnect && instance) {
          connectToShell();
        }

      } catch (error) {
        console.error('Failed to initialize terminal:', error);
        setConnectionError('Failed to initialize terminal');
      }
    };

    initTerminal();

    // Cleanup
    return () => {
      disconnect();
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  // Update connection status
  useEffect(() => {
    onConnectionChange({ isConnected, isConnecting, connectionError });
  }, [isConnected, isConnecting, connectionError, onConnectionChange]);

  // Connect to WebSocket shell
  const connectToShell = () => {
    if (!instance || !xtermRef.current) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Construct WebSocket URL for the instance
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/api/instances/${instance.id}/shell`;
      
      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        xtermRef.current.writeln(`\x1b[32mConnected to instance: ${instance.id}\x1b[0m`);
        xtermRef.current.writeln(`\x1b[36mContainer IP: ${instance.container_ip || 'N/A'}\x1b[0m`);
        xtermRef.current.writeln(`\x1b[36mUptime: ${instance.uptime}\x1b[0m`);
        xtermRef.current.writeln('');
        
        // Handle terminal input
        xtermRef.current.onData((data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'input', data }));
          }
        });

        // Handle terminal resize
        xtermRef.current.onResize(({ cols, rows }) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'resize', cols, rows }));
          }
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'output':
              xtermRef.current.write(message.data);
              break;
            case 'error':
              xtermRef.current.writeln(`\x1b[31mError: ${message.message}\x1b[0m`);
              break;
            case 'exit':
              xtermRef.current.writeln(`\x1b[33mSession ended with code: ${message.code}\x1b[0m`);
              setIsConnected(false);
              break;
          }
        } catch (error) {
          // Handle plain text messages
          xtermRef.current.write(event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
        setIsConnecting(false);
        xtermRef.current.writeln('\x1b[31mConnection failed. Falling back to demo mode...\x1b[0m');
        
        // Fall back to demo mode
        setupDemoMode();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        xtermRef.current.writeln('\x1b[33mConnection closed\x1b[0m');
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Failed to connect');
      setIsConnecting(false);
      
      // Fall back to demo mode
      setupDemoMode();
    }
  };

  // Disconnect from shell
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  // Setup demo mode with simulated commands
  const setupDemoMode = () => {
    if (!xtermRef.current) return;

    xtermRef.current.writeln('\x1b[33mDemo Mode - Limited functionality\x1b[0m');
    xtermRef.current.write('\x1b[32m$ \x1b[0m');

    let currentCommand = '';

    xtermRef.current.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        xtermRef.current.write('\r\n');
        
        if (currentCommand.trim()) {
          handleDemoCommand(currentCommand.trim());
        }
        
        currentCommand = '';
        xtermRef.current.write('\x1b[32m$ \x1b[0m');
        
      } else if (code === 127) { // Backspace
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1);
          xtermRef.current.write('\b \b');
        }
      } else if (code >= 32 && code <= 126) { // Printable characters
        currentCommand += data;
        xtermRef.current.write(data);
      }
    });
  };

  // Handle demo commands
  const handleDemoCommand = (command) => {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'ls':
        xtermRef.current.writeln('app.js  config/  logs/  node_modules/  package.json  public/  src/');
        break;
      case 'pwd':
        xtermRef.current.writeln('/app');
        break;
      case 'ps':
        xtermRef.current.writeln('  PID TTY          TIME CMD');
        xtermRef.current.writeln('    1 pts/0    00:00:01 node');
        xtermRef.current.writeln('   15 pts/0    00:00:00 sh');
        break;
      case 'whoami':
        xtermRef.current.writeln('app');
        break;
      case 'top':
        xtermRef.current.writeln(`CPU: ${instance?.cpu || 0}%  Memory: ${instance?.memory || 0}%  Disk: ${instance?.disk || 0}%`);
        break;
      case 'clear':
        xtermRef.current.clear();
        break;
      case 'exit':
        xtermRef.current.writeln('Session ended.');
        break;
      case 'help':
        xtermRef.current.writeln('Available commands: ls, pwd, ps, whoami, top, clear, exit, help');
        break;
      case 'echo':
        xtermRef.current.writeln(args.slice(1).join(' '));
        break;
      case 'date':
        xtermRef.current.writeln(new Date().toString());
        break;
      case 'uname':
        xtermRef.current.writeln('Linux container 5.4.0 #1 SMP x86_64 GNU/Linux');
        break;
      default:
        xtermRef.current.writeln(`Command not found: ${command}`);
    }
  };

  // Fit terminal to container
  const fitTerminal = () => {
    if (terminalRef.current?.fitAddon) {
      setTimeout(() => {
        terminalRef.current.fitAddon.fit();
      }, 100);
    }
  };

  // Reconnect function
  const handleReconnect = () => {
    disconnect();
    connectToShell();
  };

  // Clear terminal
  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  // Expose methods for parent component
  useEffect(() => {
    // Attach methods to ref for parent access
    if (terminalRef.current) {
      terminalRef.current.connect = connectToShell;
      terminalRef.current.disconnect = disconnect;
      terminalRef.current.reconnect = handleReconnect;
      terminalRef.current.clear = clearTerminal;
      terminalRef.current.fit = fitTerminal;
    }
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          {isConnecting ? (
            <Loader2 size={16} className="text-yellow-500 animate-spin" />
          ) : isConnected ? (
            <Wifi size={16} className="text-green-500" />
          ) : (
            <WifiOff size={16} className="text-red-500" />
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isConnecting ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
            isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {instance && (
            <span className="text-xs text-slate-400">
              {instance.id} ({instance.container_ip || 'N/A'})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {!isConnected && !isConnecting && (
            <button
              onClick={handleReconnect}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <RefreshCw size={12} />
              Reconnect
            </button>
          )}
          <button
            onClick={clearTerminal}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 overflow-hidden bg-slate-900">
        <div 
          ref={terminalContainerRef}
          className="w-full h-full p-2"
          style={{ minHeight: '200px' }}
        />
      </div>

      {/* Error Display */}
      {connectionError && (
        <div className="p-2 bg-red-900/20 border-t border-red-500/20">
          <div className="text-red-400 text-xs">
            {connectionError}
          </div>
        </div>
      )}

      {/* Load xterm.js CSS */}
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/xterm/5.3.0/xterm.min.css');
        
        .xterm {
          padding: 8px;
        }
        
        .xterm-viewport {
          background-color: transparent !important;
        }
        
        .xterm-screen {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Terminal;