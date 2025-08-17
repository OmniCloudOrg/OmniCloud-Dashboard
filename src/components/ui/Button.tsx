import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'outline' | 'success' | 'warning' | 'text' | 'transparent' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  badge?: number;
  tooltip?: string;
  loading?: boolean;
}

/**
 * Consolidated Button component with multiple variants and sizes
 * Supports all button patterns used across the application
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  disabled = false,
  ariaLabel,
  type = 'button',
  badge,
  tooltip,
  loading = false
}) => {
  // Base classes
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  // Icon-only button sizing
  const iconSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    icon: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    text: 'text-blue-400 hover:text-blue-300 bg-transparent',
    transparent: 'text-slate-400 hover:text-slate-300 bg-transparent',
    info: 'text-blue-400 hover:text-blue-300 bg-transparent'
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? disabledClasses : ''}
    ${fullWidthClass}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || tooltip}
      title={tooltip}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {Icon && !loading && variant !== 'icon' && iconPosition === 'left' && (
        <Icon size={size === 'lg' ? 20 : size === 'md' ? 18 : 16} className="mr-2" />
      )}
      
      {variant === 'icon' ? (
        Icon && !loading && <Icon size={size === 'lg' ? 20 : size === 'md' ? 18 : 16} />
      ) : (
        children
      )}
      
      {Icon && !loading && variant !== 'icon' && iconPosition === 'right' && (
        <Icon size={size === 'lg' ? 20 : size === 'md' ? 18 : 16} className="ml-2" />
      )}
      
      {typeof badge === 'number' && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-medium">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};

/**
 * ButtonGroup - Container for grouped buttons
 */
export const ButtonGroup: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
}> = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {children}
  </div>
);

/**
 * IconButton - Icon-only button component
 */
export const IconButton: React.FC<{
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'transparent' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}> = ({ 
  icon: Icon, 
  onClick, 
  variant = 'transparent', 
  size = 'md',
  tooltip,
  className = "",
  disabled = false,
  ariaLabel
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
    transparent: 'text-slate-400 hover:text-slate-300 bg-transparent',
    danger: 'text-red-400 hover:text-red-300 bg-transparent',
    success: 'text-green-400 hover:text-green-300 bg-transparent',
    warning: 'text-yellow-400 hover:text-yellow-300 bg-transparent',
    info: 'text-blue-400 hover:text-blue-300 bg-transparent'
  };
  
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'transition-colors'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${className}`}
      aria-label={ariaLabel || tooltip}
      title={tooltip}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
};

/**
 * ToggleButton - Boolean state toggle button
 */
export const ToggleButton: React.FC<{
  isActive: boolean;
  onToggle: () => void;
  activeIcon?: LucideIcon | React.ComponentType<{ size?: number }>;
  inactiveIcon?: LucideIcon | React.ComponentType<{ size?: number }>;
  activeText?: string;
  inactiveText?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  isActive, 
  onToggle, 
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  activeText,
  inactiveText,
  className = "",
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`${isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'transition-colors'} rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${className}`}
    >
      {isActive 
        ? (ActiveIcon && <ActiveIcon size={iconSizes[size]} />) 
        : (InactiveIcon && <InactiveIcon size={iconSizes[size]} />)
      }
      {isActive ? activeText : inactiveText}
    </button>
  );
};

export default Button;