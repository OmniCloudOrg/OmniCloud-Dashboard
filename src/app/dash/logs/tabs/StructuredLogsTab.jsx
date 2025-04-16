"use client"

import React, { useState } from 'react';
import { Search, Code, Braces, FileText } from 'lucide-react';

const StructuredLogsTab = ({ onSaveSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('json');

  // Sample structured log data
  const structuredLogs = [
    {
      id: 'struct-log-001',
      service: 'api-service',
      timestamp: '2025-02-25T12:34:56',
      level: 'error',
      payload: {
        error: 'DatabaseConnectionError',
        details: {
          database: 'postgres',
          host: 'db.example.com',
          port: 5432,
          retries: 3
        }
      }
    },
    {
      id: 'struct-log-002',
      service: 'auth-service',
      timestamp: '2025-02-25T12:35:12',
      level: 'info',
      payload: {
        action: 'user_login',
        userId: 'usr-12345',
        method: 'oauth',
        success: true
      }
    }
  ];

  // Filter structured logs
  const filteredLogs = structuredLogs.filter(log => 
    JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render log based on view mode
  const renderLogContent = (log) => {
    switch (viewMode) {
      case 'json':
        return (
          <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto font-mono">
            {JSON.stringify(log, null, 2)}
          </pre>
        );
      case 'table':
        return (
          <div className="bg-slate-900 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  {Object.keys(log).map(key => (
                    <th key={key} className="px-4 py-2 text-left text-sm text-slate-400 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(log).map((value, index) => (
                    <td 
                      key={index} 
                      className="px-4 py-2 text-sm text-slate-300"
                    >
                      {typeof value === 'object' 
                        ? JSON.stringify(value) 
                        : String(value)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search structured logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              viewMode === 'json' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Braces size={16} />
            JSON
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText size={16} />
            Table
          </button>
        </div>
      </div>
      
      {/* Log Results */}
      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <div 
              key={log.id} 
              className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-white">
                    {log.service} - {log.timestamp}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.level === 'error' 
                    ? 'bg-red-500/10 text-red-400' 
                    : log.level === 'warn'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {log.level.toUpperCase()}
                </div>
              </div>
              <div className="p-4">
                {renderLogContent(log)}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No Logs Found</h3>
            <p className="text-slate-400 mb-4 text-center max-w-lg">
              We couldn't find any logs matching your search criteria.
              Try adjusting your search query.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      {/* Save Search Button */}
      <div className="mt-4 text-right">
        <button 
          onClick={onSaveSearch}
          className="text-blue-400 hover:text-blue-300"
        >
          Save Current Search
        </button>
      </div>
    </div>
  );
};

export default StructuredLogsTab;