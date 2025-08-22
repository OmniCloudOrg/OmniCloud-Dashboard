import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Universal Modal Component
 * Replaces 15+ duplicate modal implementations across the app
 */

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  headerActions,
  className = '',
  overlayClassName = '',
  contentClassName = ''
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Size variants
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton || headerActions) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            
            <div className="flex items-center gap-2">
              {headerActions}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800"
                >
                  <X size={20} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${contentClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Common modal footer patterns
 */
export const ModalFooter = ({ 
  onCancel, 
  onConfirm, 
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
  disabled = false,
  children 
}) => {
  if (children) return children;

  return (
    <>
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        loading={loading}
        disabled={disabled}
      >
        {confirmText}
      </Button>
    </>
  );
};

/**
 * Specialized modal variants for common use cases
 */

// Confirmation Modal
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          cancelText={cancelText}
          confirmText={confirmText}
          confirmVariant={variant}
          loading={loading}
        />
      }
    >
      <div className="p-6">
        <p className="text-slate-300">{message}</p>
      </div>
    </Modal>
  );
};

// Form Modal
export const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  size = 'md'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={handleSubmit}
          cancelText={cancelText}
          confirmText={submitText}
          loading={loading}
          disabled={disabled}
        />
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {children}
        </div>
      </form>
    </Modal>
  );
};

// Info Modal
export const InfoModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="p-6">
        {children}
      </div>
    </Modal>
  );
};

export default Modal;
