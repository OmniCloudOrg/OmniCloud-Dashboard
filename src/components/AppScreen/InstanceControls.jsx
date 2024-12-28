import React from 'react';
import { Play, Pause, RefreshCw, Trash2, ArrowUpRight } from 'lucide-react';

export const InstanceControls = ({ instance, onAction, onSelect, isSelected }) => (
  <div className="flex gap-2">
    {instance.status === 'running' ? (
      <ControlButton
        icon={Pause}
        onClick={() => onAction(instance, 'stop')}
        title="Stop Instance"
        hoverColor="text-red-400"
      />
    ) : (
      <ControlButton
        icon={Play}
        onClick={() => onAction(instance, 'start')}
        title="Start Instance"
        hoverColor="text-emerald-400"
      />
    )}
    <ControlButton
      icon={RefreshCw}
      onClick={() => onAction(instance, 'restart')}
      title="Restart Instance"
      hoverColor="text-blue-400"
    />
    <ControlButton
      icon={ArrowUpRight}
      onClick={() => onSelect(isSelected ? null : instance)}
      title="View Details"
      hoverColor="text-blue-400"
    />
    <ControlButton
      icon={Trash2}
      onClick={() => onAction(instance, 'terminate')}
      title="Terminate Instance"
      hoverColor="text-red-400"
    />
  </div>
);

const ControlButton = ({ icon: Icon, onClick, title, hoverColor }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg text-slate-400 hover:${hoverColor} hover:bg-slate-800/50 transition-colors`}
    title={title}
  >
    <Icon size={18} />
  </button>
);
