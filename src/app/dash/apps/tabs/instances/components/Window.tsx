import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Rnd } from 'react-rnd';

// Type definitions for the component props
interface WindowProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  
  // Optional customization props
  icon?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  
  // Window configuration
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  className?: string;
  contentClassName?: string;
  
  // Resize configuration
  enableResizing?: {
    bottom?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
  };
}

/**
 * Window Component
 * A draggable and resizable window component using react-rnd.
 */
const Window: React.FC<WindowProps> = ({ 
  isOpen,
  title,
  children,
  onClose,
  icon,
  headerActions,
  footer,
  initialSize = { width: 900, height: 600 },
  minSize = { width: 400, height: 300 },
  className = '',
  contentClassName = '',
  enableResizing = {
    bottom: false,
    bottomLeft: false,
    bottomRight: true,
    left: false,
    right: false,
    top: false,
    topLeft: false,
    topRight: false
  }
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for window dimensions and position
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Window boundaries
  const [boundaries, setBoundaries] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
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
  }, [isOpen, size.width, size.height]);

  // Check position is within boundaries before drag ends
  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    // Ensure the modal doesn't go off-screen
    const x = Math.max(0, Math.min(d.x, boundaries.width - size.width));
    const y = Math.max(0, Math.min(d.y, boundaries.height - size.height));
    
    setPosition({ x, y });
  };

  // Handle window resize
  const handleResize = (e: any, direction: any, ref: any, delta: any, position: any) => {
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
  };

  // If the window is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={position}
        minWidth={minSize.width}
        minHeight={minSize.height}
        dragHandleClassName="drag-handle"
        onDragStop={handleDragStop}
        onResize={handleResize}
        bounds="parent"
        enableResizing={enableResizing}
        className={`bg-gray-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto ${className}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 p-4 cursor-move drag-handle">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-grow overflow-hidden ${contentClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-slate-800 p-3">
            {footer}
          </div>
        )}
      </Rnd>
    </div>
  );
};

export default Window;