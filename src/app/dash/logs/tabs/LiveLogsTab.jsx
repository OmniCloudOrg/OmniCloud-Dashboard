"use client"

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  BarChart2, 
  Settings, 
  Play, 
  Pause 
} from 'lucide-react';
import { LogEntry } from '../components/log-components';

const LiveLogsTab = ({ onSaveSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(['error', 'warn', 'info', 'debug']);
  const [expandedLog, setExpandedLog] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRange, setTimeRange] = useState('1h');

  // Sample log data (would typically come from an API or context)
  const logs = [
    {
      id: 'log-001',
      timestamp: '2025-02-25T12:34:56',
      level: 'error',
      service: 'api-service',
      message: 'Failed to connect to database',
      user: 'system',
      requestId: 'req-abcdef123456',
      details: {
        error: 'ConnectionError',
        database: 'postgres://user:***@db.example.com:5432/prod',
        retries: 3,
        stack: 'Error: Failed to connect to database\n  at connectToDB (/app/src/db.js:42:15)\n  at startServer (/app/src/index.js:23:5)'
      }
    },
    // ... other log entries
  ];

  // Filter logs based on search query and selected levels
  const filteredLogs = logs.filter(log => 
    (searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedLevels.includes(log.level)
  );

  // Toggle log expansion
  const toggleLogExpansion = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  // Toggle level filter
  const toggleLevelFilter = (level) => {
    setSelectedLevels(
      selectedLevels.includes(level)
        ? selectedLevels.filter(l => l !== level)
        : [...selectedLevels, level]
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search logs by message, service or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-3 self-end">
          <div className="flex gap-1">
            {['error', 'warn', 'info', 'debug'].map(level => (
              <button
                key={level}
                onClick={() => toggleLevelFilter(level)}
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  selectedLevels.includes(level) 
                    ? `bg-${level === 'error' ? 'red' : level === 'warn' ? 'yellow' : level === 'info' ? 'blue' : 'purple'}-500/10 text-${level === 'error' ? 'red' : level === 'warn' ? 'yellow' : level === 'info' ? 'blue' : 'purple'}-400 border border-${level === 'error' ? 'red' : level === 'warn' ? 'yellow' : level === 'info' ? 'blue' : 'purple'}-500/20`
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <button 
            className={`flex items-center gap-2 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-800 hover:bg-slate-700'} text-white px-4 py-2 rounded-lg transition-colors`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play size={16} />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Download size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <BarChart2 size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Log Results */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {filteredLogs.map((log) => (
              <LogEntry 
                key={log.id} 
                log={log} 
                expanded={expandedLog === log.id} 
                onToggle={() => toggleLogExpansion(log.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No Logs Found</h3>
            <p className="text-slate-400 mb-4 text-center max-w-lg">
              We couldn't find any logs matching your search criteria.
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevels(['error', 'warn', 'info', 'debug']);
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-slate-400">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
              Next
            </button>
          </div>
        </div>
      )}
      
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

export default LiveLogsTab;