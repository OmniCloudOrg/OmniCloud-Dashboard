import React from 'react';
import { X } from 'lucide-react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownPanelProps } from '../../types';

/**
 * Base dropdown panel component
 */
const DropdownPanel: React.FC<DropdownPanelProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = "right-0" 
}) => {
  const panelRef = useOutsideClick(() => {
    if (isOpen) onClose();
  });

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed top-16 mt-1 z-40 w-96 bg-slate-900 border border-slate-800 
        rounded-lg shadow-2xl ${position} animate-[fadeIn_0.2s_ease-in-out]
        backdrop-blur-sm
      `} 
      ref={panelRef}
    >
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>
      
      {children}
    </div>
  );
};

export default DropdownPanel;