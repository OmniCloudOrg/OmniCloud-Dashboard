import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownPanelProps } from '../../types';

/**
 * Enhanced dropdown panel component with flexible header
 */
interface EnhancedDropdownPanelProps extends DropdownPanelProps {
  /**
   * Optional header content to replace the default title
   */
  headerContent?: ReactNode;
  
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  
  /**
   * Additional CSS classes for the panel
   */
  className?: string;
  
  /**
   * Width of the panel (defaults to w-96)
   */
  width?: string;
  
  /**
   * Render a custom header instead of the default one
   */
  renderHeader?: (onClose: () => void) => ReactNode;
}

const DropdownPanel: React.FC<EnhancedDropdownPanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right-0",
  headerContent,
  showCloseButton = true,
  className = "",
  width = "w-96",
  renderHeader
}) => {
  const panelRef = useOutsideClick(() => {
    if (isOpen) onClose();
  });

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed top-16 mt-1 z-40 ${width} bg-slate-900 border border-slate-800
        rounded-lg shadow-2xl ${position} animate-[fadeIn_0.2s_ease-in-out]
        backdrop-blur-sm ${className}
      `}
      ref={panelRef}
    >
      {/* Flexible header rendering */}
      {renderHeader ? (
        // Use the custom header renderer if provided
        renderHeader(onClose)
      ) : (
        // Default header with optional custom content
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          {headerContent ? (
            // Render custom header content if provided
            <div className="flex-1 flex items-center">{headerContent}</div>
          ) : (
            // Default title
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 ml-2"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
          
      {children}
    </div>
  );
};

export default DropdownPanel;