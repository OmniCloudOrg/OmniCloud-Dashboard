import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Button from './Button';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  backdrop?: 'blur' | 'solid' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

interface SimpleModalProps extends BaseModalProps {
  type: 'simple';
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

interface FormModalProps extends BaseModalProps {
  type: 'form';
  title: string;
  children: React.ReactNode;
  onSubmit: (e?: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
  loading?: boolean;
}

interface MultiStepModalProps extends BaseModalProps {
  type: 'multistep';
  title: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  nextText?: string;
  backText?: string;
  submitText?: string;
  cancelText?: string;
  canGoNext?: boolean;
  canGoBack?: boolean;
  loading?: boolean;
}

interface ConfirmationModalProps extends BaseModalProps {
  type: 'confirmation';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  loading?: boolean;
}

interface FullScreenModalProps extends BaseModalProps {
  type: 'fullscreen';
  title?: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

type ModalProps = 
  | SimpleModalProps 
  | FormModalProps 
  | MultiStepModalProps 
  | ConfirmationModalProps 
  | FullScreenModalProps;

/**
 * Consolidated Modal component that handles all modal variations used in the application
 */
const Modal: React.FC<ModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    className = '',
    backdrop = 'blur',
    size = 'lg',
    position = 'center',
    closeOnEscape = true,
    closeOnClickOutside = true
  } = props;

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-none w-full h-full'
  };

  // Position classes
  const positionClasses = {
    center: 'flex items-center justify-center',
    top: 'flex items-start justify-center pt-20',
    bottom: 'flex items-end justify-center pb-20'
  };

  // Backdrop classes
  const backdropClasses = {
    blur: 'bg-black/70 backdrop-blur-sm',
    solid: 'bg-black/80',
    none: 'bg-transparent'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderSimpleModal = (props: SimpleModalProps) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl ${sizeClasses[size]} ${props.type === 'fullscreen' ? 'h-full' : 'max-h-[90vh]'} overflow-hidden ${className}`}>
      {props.title && (
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">{props.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className="p-6 overflow-y-auto" style={{ maxHeight: props.title ? 'calc(90vh - 140px)' : 'calc(90vh - 60px)' }}>
        {props.children}
      </div>

      {props.footer && (
        <div className="border-t border-slate-800 p-6">
          {props.footer}
        </div>
      )}
    </div>
  );

  const renderFormModal = (props: FormModalProps) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}>
      <div className="flex justify-between items-center border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">{props.title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={props.onSubmit}>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {props.children}
        </div>

        <div className="border-t border-slate-800 p-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {props.cancelText || 'Cancel'}
          </Button>
          <Button 
            type="submit" 
            disabled={props.submitDisabled} 
            loading={props.loading}
          >
            {props.submitText || 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderMultiStepModal = (props: MultiStepModalProps) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}>
      <div className="flex justify-between items-center border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">{props.title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <MultiStepProgress step={props.step} totalSteps={props.totalSteps} />
      </div>
      
      <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
        {props.children}
      </div>

      <div className="border-t border-slate-800 p-6">
        <div className="flex justify-between">
          {props.step > 1 && props.canGoBack !== false ? (
            <Button variant="secondary" onClick={props.onBack}>
              {props.backText || 'Back'}
            </Button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              {props.cancelText || 'Cancel'}
            </Button>
            
            {props.step < props.totalSteps ? (
              <Button 
                onClick={props.onNext} 
                disabled={props.canGoNext === false}
                loading={props.loading}
              >
                {props.nextText || 'Next'}
              </Button>
            ) : (
              <Button 
                onClick={props.onSubmit}
                loading={props.loading}
              >
                {props.submitText || 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationModal = (props: ConfirmationModalProps) => {
    const variantClasses = {
      danger: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400',
      success: 'text-green-400'
    };

    const buttonVariant = {
      danger: 'danger' as const,
      warning: 'warning' as const,
      info: 'primary' as const,
      success: 'success' as const
    };

    return (
      <div className={`bg-slate-900 border border-slate-800 rounded-xl ${sizeClasses[size]} ${className}`}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full bg-${props.variant || 'info'}-500/10 ${variantClasses[props.variant || 'info']}`}>
              <X size={24} />
            </div>
            <h2 className="text-xl font-semibold text-white">{props.title}</h2>
          </div>
          
          <p className="text-slate-300 mb-6">{props.message}</p>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              {props.cancelText || 'Cancel'}
            </Button>
            <Button 
              variant={buttonVariant[props.variant || 'info']} 
              onClick={props.onConfirm}
              loading={props.loading}
            >
              {props.confirmText || 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderFullScreenModal = (props: FullScreenModalProps) => (
    <div className="w-full h-full bg-slate-900 flex flex-col">
      {(props.title || props.toolbar) && (
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <div className="flex items-center gap-4">
            {props.title && <h2 className="text-xl font-semibold text-white">{props.title}</h2>}
            {props.toolbar}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-6">
        {props.children}
      </div>
    </div>
  );

  const renderModalContent = () => {
    switch (props.type) {
      case 'form':
        return renderFormModal(props);
      case 'multistep':
        return renderMultiStepModal(props);
      case 'confirmation':
        return renderConfirmationModal(props);
      case 'fullscreen':
        return renderFullScreenModal(props);
      case 'simple':
      default:
        return renderSimpleModal(props);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 ${positionClasses[position]} ${backdropClasses[backdrop]}`}
      onClick={handleBackdropClick}
    >
      {renderModalContent()}
    </div>
  );
};

/**
 * MultiStepProgress - Progress indicator for multi-step modals
 */
export const MultiStepProgress: React.FC<{ 
  step: number; 
  totalSteps: number; 
  className?: string;
}> = ({ step, totalSteps, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    {Array.from({ length: totalSteps }).map((_, i) => (
      <React.Fragment key={i}>
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            step === i + 1 
              ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
              : step > i + 1 
                ? 'border-green-500 bg-green-500/20 text-green-400' 
                : 'border-slate-700 bg-slate-800 text-slate-400'
          }`}
        >
          {step > i + 1 ? <Check size={16} /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div className={`flex-1 h-0.5 mx-2 ${
            step > i + 1 ? 'bg-green-500/50' : 'bg-slate-700'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Export specialized modal hooks for common patterns
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
  } | null>(null);

  const openConfirmModal = (modalConfig: NonNullable<typeof config>) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const ConfirmModal = config ? (
    <Modal
      type="confirmation"
      isOpen={isOpen}
      onClose={closeModal}
      title={config.title}
      message={config.message}
      onConfirm={() => {
        config.onConfirm();
        closeModal();
      }}
      variant={config.variant}
      confirmText={config.confirmText}
    />
  ) : null;

  return { openConfirmModal, ConfirmModal };
};

export default Modal;