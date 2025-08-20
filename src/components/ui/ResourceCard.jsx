"use client"

import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpRight } from 'lucide-react';

/**
 * Enhanced ResourceCard Component
 * Consolidates 3+ duplicate implementations across the app
 * Supports multiple variants and use cases
 */
export const ResourceCard = ({ 
  title, 
  value, 
  percentage, 
  icon: Icon, 
  color, 
  trend,
  subtitle,
  onClick,
  clickable = false,
  loading = false,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  // Determine if card should be clickable
  const isClickable = clickable || onClick;

  // Trend color logic (security cards have inverted logic for some metrics)
  const getTrendColor = () => {
    if (!percentage) return 'text-slate-400';
    
    if (variant === 'security') {
      // In security context, increases in vulnerabilities are bad
      return trend === 'up' && percentage > 0 ? 'text-red-400' : 
             trend === 'up' && percentage < 0 ? 'text-green-400' :
             trend === 'down' && percentage > 0 ? 'text-green-400' : 
             trend === 'down' && percentage < 0 ? 'text-red-400' : 
             'text-slate-400';
    }
    
    // Default logic - up trends are good
    return trend === 'up' ? 'text-green-400' : 
           trend === 'down' ? 'text-red-400' : 
           'text-slate-400';
  };

  // Trend icon
  const getTrendIcon = () => {
    if (variant === 'security') {
      return <ArrowUpRight size={16} className={trend === 'down' ? 'rotate-90' : ''} />;
    }
    return trend === 'up' ? <ArrowUp size={16} /> : 
           trend === 'down' ? <ArrowDown size={16} /> : null;
  };

  // Size variants
  const sizeClasses = {
    sm: 'p-4',
    default: 'p-6', 
    lg: 'p-8'
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl ${sizeClasses[size]} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-16 h-4 bg-slate-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="w-24 h-8 bg-slate-700 rounded"></div>
            <div className="w-32 h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl
        ${sizeClasses[size]}
        ${isClickable ? 'cursor-pointer hover:border-blue-500/30 transition-all' : ''}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
        {percentage !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            {percentage > 0 && variant !== 'security' ? '+' : ''}{percentage}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        <p className="text-sm text-slate-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
};

/**
 * Specialized ResourceCard variants
 */

// Metric Card for dashboard metrics
export const MetricCard = (props) => (
  <ResourceCard {...props} variant="metric" />
);

// Security Card for security dashboard
export const SecurityCard = (props) => (
  <ResourceCard {...props} variant="security" />
);

// Clickable Card for interactive dashboards
export const ClickableCard = (props) => (
  <ResourceCard {...props} clickable={true} />
);

export default ResourceCard;