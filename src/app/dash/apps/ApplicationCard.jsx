"use client"

import React from 'react';
import { Box, Clock } from 'lucide-react';
import { StatusBadge, DetailItem } from '../components/ui';


/**
 * Application Card Component - Displays an application in a card format
 * Refactored to use the UI component library
 */
const ApplicationCard = ({ app, onSelect }) => {
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(app)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Box size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{app.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{app.description}</div>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DetailItem label="Instances" value={app.instances} />
        <DetailItem label="Version" value={app.version} />
        <DetailItem label="Region" value={app.region} />
        <DetailItem label="Runtime" value={app.runtime} />
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Updated {app.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;