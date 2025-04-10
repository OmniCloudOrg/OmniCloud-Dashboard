"use client"

import React from 'react';
import { ArrowUpDown, ArrowUpRight } from 'lucide-react';

/**
 * ResourceCard - A reusable card component for displaying resource metrics
 * Used across all dashboard pages for stat displays
 */
export const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? 
            <ArrowUpRight size={16} /> : 
            trend === 'down' ? 
              <ArrowUpRight size={16} className="rotate-90" /> :
              trend === 'upArrow' ?
                <ArrowUpDown size={16} className="rotate-180" /> :
                trend === 'downArrow' ?
                  <ArrowUpDown size={16} className="rotate-0" /> :
                  null
          }
          {percentage}%
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

/**
 * StatusIndicator - A reusable component for displaying status
 * Used across multiple dashboards for showing status badges
 */
export const StatusIndicator = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status.toLowerCase()) {
    case 'active':
    case 'verified':
    case 'running':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      break;
    case 'inactive':
    case 'unverified':
    case 'stopped':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      break;
    case 'pending':
    case 'deploying':
    case 'provisioning':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
  }
  
  return (
    <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      <span className="capitalize">{status === 'verified' ? 'Verified' : status === 'unverified' ? 'Unverified' : status}</span>
    </div>
  );
};

/**
 * SearchFilter - A reusable search and filter component
 * Used across all dashboard pages for filtering content
 */
export const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  searchPlaceholder,
  filters = [],
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-start md:items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={searchPlaceholder || "Search..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      
      <div className="flex gap-3 self-end">
        {filters.map((filter, index) => (
          <select
            key={index}
            value={filter.value}
            onChange={filter.onChange}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
};

/**
 * TabNavigation - A reusable tab navigation component
 * Used across dashboard pages for tab switching
 */
export const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-800">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-blue-400 border-b-2 border-blue-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * EmptyState - A reusable empty state component
 * Used across dashboard pages when no data is found
 */
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText,
  onAction
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-slate-400 mb-4 text-center max-w-lg">
        {description}
      </p>
      {actionText && (
        <button
          onClick={onAction}
          className="text-blue-400 hover:text-blue-300"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Need to import this in the code to avoid errors
const Search = ({ className, size }) => (
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