import React from 'react';
import { 
  Check, 
  X, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Code,
  Activity
} from 'lucide-react';

interface StatusBadgeProps {
  status?: string;
  level?: string;
  severity?: string;
  type?: 'status' | 'log' | 'severity' | 'custom';
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  showIcon?: boolean;
  animate?: boolean;
}

/**
 * Consolidated StatusBadge component that handles all badge variations
 * Supports status badges, log level badges, severity badges, and custom badges
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  level,
  severity,
  type = 'status',
  variant = 'filled',
  size = 'md',
  icon: CustomIcon,
  className = '',
  showIcon = true,
  animate = false
}) => {
  // Determine the value to display
  const value = status || level || severity || 'unknown';
  const normalizedValue = value.toLowerCase();

  // Size configurations
  const sizeConfig = {
    sm: {
      text: 'text-xs',
      padding: 'px-1.5 py-0.5',
      iconSize: 12
    },
    md: {
      text: 'text-xs',
      padding: 'px-2 py-1',
      iconSize: 14
    },
    lg: {
      text: 'text-sm',
      padding: 'px-3 py-1.5',
      iconSize: 16
    }
  };

  // Get colors and icons based on type and value
  const getConfiguration = () => {
    switch (type) {
      case 'log':
        return getLogConfiguration(normalizedValue);
      case 'severity':
        return getSeverityConfiguration(normalizedValue);
      case 'custom':
        return getCustomConfiguration(normalizedValue);
      default:
        return getStatusConfiguration(normalizedValue);
    }
  };

  const getStatusConfiguration = (value: string) => {
    switch (value) {
      case 'running':
      case 'active':
      case 'verified':
      case 'success':
      case 'resolved':
      case 'online':
      case 'healthy':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          icon: <Check size={sizeConfig[size].iconSize} />
        };
      case 'stopped':
      case 'inactive':
      case 'unverified':
      case 'failed':
      case 'error':
      case 'offline':
      case 'unhealthy':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: <X size={sizeConfig[size].iconSize} />
        };
      case 'provisioning':
      case 'deploying':
      case 'pending':
      case 'in progress':
      case 'loading':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          icon: <RefreshCw size={sizeConfig[size].iconSize} className={animate ? 'animate-spin' : ''} />
        };
      case 'queued':
      case 'scheduled':
        return {
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/20',
          icon: <Clock size={sizeConfig[size].iconSize} />
        };
      case 'warning':
      case 'degraded':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/20',
          icon: <AlertTriangle size={sizeConfig[size].iconSize} />
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/20',
          icon: null
        };
    }
  };

  const getLogConfiguration = (level: string) => {
    switch (level) {
      case 'error':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: <AlertCircle size={sizeConfig[size].iconSize} />
        };
      case 'warn':
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/20',
          icon: <AlertTriangle size={sizeConfig[size].iconSize} />
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          icon: <Info size={sizeConfig[size].iconSize} />
        };
      case 'debug':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/20',
          icon: <Code size={sizeConfig[size].iconSize} />
        };
      case 'trace':
        return {
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/20',
          icon: <Activity size={sizeConfig[size].iconSize} />
        };
      default:
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          icon: <CheckCircle size={sizeConfig[size].iconSize} />
        };
    }
  };

  const getSeverityConfiguration = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: <AlertCircle size={sizeConfig[size].iconSize} />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/20',
          icon: <AlertTriangle size={sizeConfig[size].iconSize} />
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          icon: <Info size={sizeConfig[size].iconSize} />
        };
      case 'resolved':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          icon: <CheckCircle size={sizeConfig[size].iconSize} />
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/20',
          icon: null
        };
    }
  };

  const getCustomConfiguration = (value: string) => {
    return {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/20',
      icon: CustomIcon ? <CustomIcon size={sizeConfig[size].iconSize} /> : null
    };
  };

  const config = getConfiguration();
  const currentSize = sizeConfig[size];

  // Build class names
  const baseClasses = 'flex items-center gap-1 rounded-full font-medium';
  const variantClasses = variant === 'outlined' 
    ? `${config.bg} ${config.text} border ${config.border}`
    : `${config.bg} ${config.text}`;

  const classes = `${baseClasses} ${variantClasses} ${currentSize.text} ${currentSize.padding} ${className}`;

  // Determine text transform
  const getTextTransform = () => {
    if (type === 'log') return 'uppercase';
    return 'capitalize';
  };

  return (
    <div className={classes}>
      {showIcon && config.icon}
      <span style={{ textTransform: getTextTransform() }}>{value}</span>
    </div>
  );
};

// Export specialized versions for backward compatibility
export const LogLevelBadge: React.FC<{ level: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  level, 
  size = 'md', 
  className = '' 
}) => (
  <StatusBadge level={level} type="log" size={size} className={className} />
);

export const SeverityBadge: React.FC<{ severity: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  severity, 
  size = 'md', 
  className = '' 
}) => (
  <StatusBadge severity={severity} type="severity" size={size} className={className} />
);

export default StatusBadge;