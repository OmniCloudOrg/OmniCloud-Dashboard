/**
 * Terminal Window Component
 * Manages terminal connection status and display
 */

import React from 'react';
import { Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { TERMINAL_STATUS } from '@/data/instanceConstants';
import Window from './Window';
import Terminal from './Terminal';

const TerminalWindow = ({ 
  terminalId, 
  terminal, 
  onClose, 
  onStatusChange 
}) => {
  const getTerminalStatusConfig = (status) => {
    if (status.isConnecting) return TERMINAL_STATUS.connecting;
    if (status.isConnected) return TERMINAL_STATUS.connected;
    return TERMINAL_STATUS.disconnected;
  };

  const statusConfig = getTerminalStatusConfig(terminal.status);

  const headerActions = (
    <div className="flex items-center gap-1">
      {terminal.status.isConnecting ? (
        <Loader2 size={16} className="text-yellow-500 animate-spin" />
      ) : (
        <div className={`w-2 h-2 rounded-full ${statusConfig.indicator}`}></div>
      )}
      <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    </div>
  );

  return (
    <Window
      isOpen={true}
      onClose={() => onClose(terminalId)}
      title={`Terminal - ${terminal.instance.id}`}
      icon={<TerminalIcon size={20} className="text-green-400" />}
      headerActions={headerActions}
      initialSize={{ width: 900, height: 600 }}
      minSize={{ width: 500, height: 400 }}
      className="font-mono"
    >
      <Terminal 
        instance={terminal.instance}
        onConnectionChange={(status) => onStatusChange(terminalId, status)}
        className="h-full"
      />
    </Window>
  );
};

export default TerminalWindow;
