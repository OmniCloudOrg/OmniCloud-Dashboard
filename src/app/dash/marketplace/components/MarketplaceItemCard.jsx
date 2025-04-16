"use client"

import React from 'react';
import { Star, Check, Download } from 'lucide-react';

export const MarketplaceItemCard = ({ item, onClick }) => {
  return (
    <div 
      className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-blue-900/10 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${item.type === 'cpi' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
          {item.icon && React.createElement(item.icon, { size: 20 })}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-200">{item.name}</h3>
            {item.installed && (
              <span className="flex items-center text-xs font-medium text-green-400">
                <Check size={12} className="mr-1" />
                Installed
              </span>
            )}
          </div>
          
          <div className="text-xs text-slate-400 mb-2">by {item.authorName}</div>
          
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span>{item.stars.toLocaleString()}</span>
              </div>
              <div className="text-slate-400">
                {item.type === 'cpi' ? 'Integration' : 'Dashboard'}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the parent component will handle installation
                item.onInstall?.(item);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                item.installed 
                  ? 'bg-green-500/10 text-green-400 cursor-default' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {item.installed ? (
                'Installed'
              ) : (
                <>
                  <Download size={12} />
                  <span>Install</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};