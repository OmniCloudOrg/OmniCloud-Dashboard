/**
 * Event Type Filters Component
 * Displays filter buttons for different event types
 */

import React from 'react';
import { EVENT_TYPE_FILTERS } from '@/data/auditConstants';

const EventTypeFilters = ({ selectedEventTypes, onToggleEventType }) => {
  return (
    <div className="flex gap-1">
      {EVENT_TYPE_FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onToggleEventType(filter.id)}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedEventTypes.includes(filter.id) 
              ? filter.color 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default EventTypeFilters;
