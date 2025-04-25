// VolumesTab.jsx
import React from 'react';
import { Clock, Edit, Trash } from 'lucide-react';
import { StatusIndicator } from '../../components/ui/common-components';

const VolumesTab = ({ data, searchQuery, statusFilter }) => {
  // Filter data based on search query and status filter
  const filteredData = data.filter(item => 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );
  
  if (filteredData.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
          <HardDrive size={32} />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No Volumes Found</h3>
        <p className="text-slate-400 mb-4 text-center max-w-lg">
          We couldn't find any volumes matching your search criteria.
          Try adjusting your filters or search query.
        </p>
        <button
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
          className="text-blue-400 hover:text-blue-300"
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
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Attached To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Zone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredData.map((volume) => (
            <tr key={volume.id} className="hover:bg-slate-800/30">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-white">{volume.name}</div>
                  <div className="text-xs text-slate-500">{volume.id}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{volume.size} GB</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{volume.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">
                  {volume.instance ? 
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">{volume.instance}</span> : 
                    <span className="text-slate-500">-</span>
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{volume.zone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusIndicator status={volume.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{volume.created}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="text-slate-400 hover:text-slate-300">
                    <Edit size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-slate-300">
                    <Trash size={16} />
                  </button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Actions
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

export default VolumesTab;