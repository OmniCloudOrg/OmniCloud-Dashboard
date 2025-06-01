import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Rnd } from 'react-rnd';

interface WindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  enableResize?: boolean;
  resizeHandles?: {
    bottom?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
  };
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerContent?: React.ReactNode;
}

const WindowModal: React.FC<WindowModalProps> = ({
  isOpen,
  onClose,
  title,
  headerContent,
  children,
  defaultSize = { width: 900, height: 600 },
  minWidth = 400,
  minHeight = 300,
  enableResize = true,
  resizeHandles = {
    bottom: false,
    bottomLeft: false,
    bottomRight: true,
    left: false,
    right: false,
    top: false,
    topLeft: false,
    topRight: false
  },
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerContent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false); // Guard centering logic

  const [size, setSize] = useState(defaultSize);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(1000);
  const [boundaries, setBoundaries] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setBoundaries({ width: innerWidth, height: innerHeight });

      setPosition(prev => ({
        x: Math.min(prev.x, innerWidth - size.width),
        y: Math.min(prev.y, innerHeight - size.height)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  // Center modal once when opened
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      const { innerWidth, innerHeight } = window;

      setPosition({
        x: Math.max(0, Math.round((innerWidth - defaultSize.width) / 2)),
        y: Math.max(0, Math.round((innerHeight - defaultSize.height) / 2))
      });

      setBoundaries({ width: innerWidth, height: innerHeight });
      hasInitialized.current = true;
    }
  }, [isOpen]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen]);

  const bringToFront = () => {
    setZIndex(prev => prev + 1);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    >
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={position}
        minWidth={minWidth}
        minHeight={minHeight}
        dragHandleClassName="drag-handle"
        onMouseDown={bringToFront}
        onResizeStop={(e, direction, ref, delta, newPosition) => {
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setPosition(newPosition);
        }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        bounds="window"
        enableResizing={enableResize ? resizeHandles : false}
        style={{ zIndex }}
        className={`bg-gray-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto ${className}`}
      >
        <div className={`flex justify-between items-center border-b border-slate-800 p-4 cursor-move drag-handle ${headerClassName}`}>
          <div className="flex items-center gap-2">
            {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
            {headerContent}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className={`flex-grow overflow-hidden ${contentClassName}`}>
          {children}
        </div>

        {footerContent && (
          <div className="border-t border-slate-800 p-3">
            {footerContent}
          </div>
        )}
      </Rnd>
    </div>,
    document.body
  );
};

export default WindowModal;
