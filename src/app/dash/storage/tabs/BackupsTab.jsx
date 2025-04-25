// BackupsTab.jsx
import React from 'react';
import { Archive, Clock, RefreshCw, Download } from 'lucide-react';
import { StatusIndicator } from '../../components/ui/common-components';

export const BackupsTab = ({ data, searchQuery, statusFilter }) => {
  // Filter data based on search query and status filter
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );

  if (filteredData.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
          <Archive size={32} />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No Backups Found</h3>
        <p className="text-slate-400 mb-4 text-center max-w-lg">
          We couldn't find any backups matching your search criteria.
        </p>
        <button
          className="text-blue-400 hover:text-blue-300"
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Frequency</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Run</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredData.map((backup) => (
            <tr key={backup.id} className="hover:bg-slate-800/30">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-white">{backup.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{backup.source}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{backup.size}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{backup.frequency}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{backup.lastRun}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusIndicator status={backup.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="text-slate-400 hover:text-slate-300">
                    <RefreshCw size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-slate-300">
                    <Download size={16} />
                  </button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Restore
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};