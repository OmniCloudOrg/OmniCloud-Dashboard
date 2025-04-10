"use client"

import React from 'react';

/**
 * Button - A reusable button component
 * Used across all dashboard pages
 */
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  className = "",
  disabled = false,
  type = "button"
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
    outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    text: 'text-blue-400 hover:text-blue-300 bg-transparent'
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Disabled style
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'transition-colors';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${Icon ? 'flex items-center gap-2' : ''} rounded-lg ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />}
      {children}
    </button>
  );
};

/**
 * ButtonGroup - A reusable button group component
 * Used for groups of related buttons
 */
export const ButtonGroup = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
};

/**
 * IconButton - A reusable icon-only button component
 * Used for compact actions across all dashboard pages
 */
export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'transparent', 
  size = 'md',
  tooltip,
  className = "",
  disabled = false,
  ariaLabel
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white',
    transparent: 'text-slate-400 hover:text-slate-300 bg-transparent',
    danger: 'text-red-400 hover:text-red-300 bg-transparent',
    success: 'text-green-400 hover:text-green-300 bg-transparent',
    warning: 'text-yellow-400 hover:text-yellow-300 bg-transparent',
    info: 'text-blue-400 hover:text-blue-300 bg-transparent'
  };
  
  // Size styles
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
  
  // Disabled style
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} rounded ${className} relative`}
      aria-label={ariaLabel || tooltip}
      title={tooltip}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
};

/**
 * ToggleButton - A reusable toggle button component
 * Used for boolean state toggles
 */
export const ToggleButton = ({ 
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
  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Active/inactive styles
  const activeClass = isActive 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-slate-800 hover:bg-slate-700 text-slate-300';
  
  // Disabled style
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'transition-colors';
  
  // Icon size
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`${activeClass} ${sizeClasses[size]} ${disabledClass} rounded-lg flex items-center gap-2 ${className}`}
    >
      {isActive 
        ? (ActiveIcon && <ActiveIcon size={iconSizes[size]} />) 
        : (InactiveIcon && <InactiveIcon size={iconSizes[size]} />)
      }
      {isActive ? activeText : inactiveText}
    </button>
  );
};

/**
 * ActionButton - A reusable button for common actions
 * Used for standard actions like edit, delete, etc.
 */
export const ActionButton = ({ 
  action, 
  onClick, 
  size = 'md', 
  variant,
  className = "",
  disabled = false,
  tooltip
}) => {
  // Actions configuration
  const actions = {
    edit: {
      icon: EditIcon,
      text: 'Edit',
      variant: 'secondary'
    },
    delete: {
      icon: TrashIcon,
      text: 'Delete',
      variant: 'danger'
    },
    view: {
      icon: EyeIcon,
      text: 'View',
      variant: 'info'
    },
    download: {
      icon: DownloadIcon,
      text: 'Download',
      variant: 'secondary'
    },
    refresh: {
      icon: RefreshIcon,
      text: 'Refresh',
      variant: 'secondary'
    },
    add: {
      icon: PlusIcon,
      text: 'Add',
      variant: 'primary'
    },
    settings: {
      icon: SettingsIcon,
      text: 'Settings',
      variant: 'secondary'
    },
    search: {
      icon: SearchIcon,
      text: 'Search',
      variant: 'secondary'
    }
  };
  
  const actionConfig = actions[action];
  const IconComponent = actionConfig.icon;
  const buttonVariant = variant || actionConfig.variant;
  
  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Icon size
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  // Disabled style
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'transition-colors';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${buttonVariant === 'danger' ? 'text-red-400 hover:text-red-300' : buttonVariant === 'primary' ? 'text-blue-400 hover:text-blue-300' : 'text-slate-400 hover:text-slate-300'} ${sizeClasses[size]} ${disabledClass} ${className}`}
      title={tooltip}
    >
      <IconComponent size={iconSizes[size]} />
      <span>{actionConfig.text}</span>
    </button>
  );
};

// Icon components for ActionButton
const EditIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EyeIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const DownloadIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const RefreshIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const PlusIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SettingsIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SearchIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);