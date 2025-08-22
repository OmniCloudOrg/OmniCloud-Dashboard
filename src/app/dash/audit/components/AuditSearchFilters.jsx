/**
 * Audit Search and Filter Controls Component
 * Contains search input, event type filters, and source dropdown
 */

import React from 'react';
import { Search } from 'lucide-react';
import { SOURCE_OPTIONS } from '@/data/auditConstants';
import EventTypeFilters from './EventTypeFilters';

const AuditSearchFilters = ({ 
  searchQuery, 
  onSearchChange, 
  selectedEventTypes, 
  onToggleEventType, 
  loading 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search logs by action, resource, user or details..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>
      
      <div className="flex gap-3 self-end">
        <EventTypeFilters 
          selectedEventTypes={selectedEventTypes}
          onToggleEventType={onToggleEventType}
        />
        
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          {SOURCE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AuditSearchFilters;
