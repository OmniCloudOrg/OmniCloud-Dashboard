"use client"

import React from 'react';
import { 
  Search, GitBranch, AlertTriangle, Layers, CheckCircle
} from 'lucide-react';
import { StackItem } from '../ui-components';

export const StacksTab = (props) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    showDriftedOnly,
    setShowDriftedOnly,
    showNonCompliantOnly,
    setShowNonCompliantOnly,
    expandedStack,
    toggleStackExpansion,
    handleViewStackResources,
    handleViewStackTemplate,
    filteredStacks
  } = props;
  
  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Search stacks by name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <select 
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              <option value="us-east-1">us-east-1</option>
              <option value="us-west-2">us-west-2</option>
              <option value="eu-west-1">eu-west-1</option>
              <option value="global">Global</option>
            </select>
            <button 
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                showDriftedOnly ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
              onClick={() => setShowDriftedOnly(!showDriftedOnly)}
            >
              <GitBranch size={16} />
              Drifted Only
            </button>
            <button 
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                showNonCompliantOnly ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
              onClick={() => setShowNonCompliantOnly(!showNonCompliantOnly)}
            >
              <AlertTriangle size={16} />
              Non-Compliant Only
            </button>
          </div>
        </div>
      </div>
      
      {/* Stacks count */}
      <div className="text-sm text-slate-400">
        Showing {filteredStacks.length} stacks
        {searchQuery && <span> matching "{searchQuery}"</span>}
        {selectedRegion !== 'all' && <span> in {selectedRegion}</span>}
        {showDriftedOnly && <span> with detected drift</span>}
        {showNonCompliantOnly && <span> with security issues</span>}
      </div>
      
      {/* Stacks list */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {filteredStacks.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Layers size={40} className="mx-auto mb-3 opacity-50" />
            <p>No stacks match your current filters</p>
            <button 
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setShowDriftedOnly(false);
                setShowNonCompliantOnly(false);
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredStacks.map((stack) => (
            <StackItem
              key={stack.id}
              stack={stack}
              expanded={expandedStack === stack.id}
              onToggle={() => toggleStackExpansion(stack.id)}
              onViewResources={() => handleViewStackResources(stack.id)}
              onViewTemplate={() => handleViewStackTemplate(stack.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};