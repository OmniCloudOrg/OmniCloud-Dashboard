"use client"

import React from 'react';
import { 
  Search, Filter, Download, ShieldOff, GitBranch
} from 'lucide-react';
import { SecurityFinding } from '../ui-components';

export const FindingsTab = (props) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedSeverities,
    toggleSeverityFilter,
    focusArea,
    setFocusArea,
    selectedRegion,
    setSelectedRegion,
    selectedResourceType,
    setSelectedResourceType,
    showDriftedOnly,
    setShowDriftedOnly,
    expandedFinding,
    toggleFindingExpansion,
    handleFindingAction,
    filteredFindings,
    categories
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
                placeholder="Search findings by title, resource, stack..." 
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
            <select 
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
            >
              <option value="all">All Resources</option>
              <option value="RDS">RDS</option>
              <option value="S3">S3</option>
              <option value="IAM">IAM</option>
              <option value="APIGateway">API Gateway</option>
              <option value="CloudFront">CloudFront</option>
            </select>
            <select 
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              value={focusArea || ''}
              onChange={(e) => setFocusArea(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
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
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="text-sm text-slate-400 flex items-center">Severity:</div>
          {['critical', 'high', 'medium', 'low'].map((severity) => (
            <button
              key={severity}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedSeverities.includes(severity) ? 
                  severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
              onClick={() => toggleSeverityFilter(severity)}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
              {selectedSeverities.includes(severity) ? (
                <span className="ml-1">✓</span>
              ) : null}
            </button>
          ))}
          <div className="flex-1"></div>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            <Filter size={14} />
            More Filters
          </button>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
      
      {/* Findings count */}
      <div className="text-sm text-slate-400">
        Showing {filteredFindings.length} findings
        {searchQuery && <span> matching "{searchQuery}"</span>}
        {selectedRegion !== 'all' && <span> in {selectedRegion}</span>}
        {selectedResourceType !== 'all' && <span> for {selectedResourceType} resources</span>}
        {focusArea && <span> in {focusArea} category</span>}
        {showDriftedOnly && <span> with detected drift</span>}
      </div>
      
      {/* Findings list */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {filteredFindings.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <ShieldOff size={40} className="mx-auto mb-3 opacity-50" />
            <p>No findings match your current filters</p>
            <button 
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverities(['critical', 'high', 'medium', 'low']);
                setSelectedRegion('all');
                setSelectedResourceType('all');
                setFocusArea(null);
                setShowDriftedOnly(false);
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <SecurityFinding
              key={finding.id}
              finding={finding}
              expanded={expandedFinding === finding.id}
              onToggle={() => toggleFindingExpansion(finding.id)}
              onActionClick={handleFindingAction}
            />
          ))
        )}
      </div>
    </div>
  );
};