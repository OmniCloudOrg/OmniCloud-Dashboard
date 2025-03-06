import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  badge?: number;
}

/**
 * Button component with multiple variants and sizes
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
  badge
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
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    icon: 'bg-slate-800 hover:bg-slate-700 text-slate-200'
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
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {Icon && variant !== 'icon' && iconPosition === 'left' && (
        <Icon size={size === 'lg' ? 20 : size === 'md' ? 18 : 16} className="mr-2" />
      )}
      
      {variant === 'icon' ? (
        <Icon size={size === 'lg' ? 20 : size === 'md' ? 18 : 16} />
      ) : (
        children
      )}
      
      {Icon && variant !== 'icon' && iconPosition === 'right' && (
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

export default Button;