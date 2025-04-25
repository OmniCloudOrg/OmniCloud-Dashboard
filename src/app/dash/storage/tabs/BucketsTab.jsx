// BucketsTab.jsx
import React from 'react';
import { HardDrive, Clock, Settings, Trash, Database } from 'lucide-react';

const BucketsTab = ({ data, searchQuery, statusFilter, setSelectedBucket }) => {
  // Filter data based on search query and status filter
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === 'all' || 
     (statusFilter === 'public' && item.access === 'Public') || 
     (statusFilter === 'private' && item.access === 'Private'))
  );

  if (filteredData.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
          <Database size={32} />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No Buckets Found</h3>
        <p className="text-slate-400 mb-4 text-center max-w-lg">
          We couldn't find any storage buckets matching your search criteria.
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
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Objects</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Access</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {filteredData.map((bucket) => (
            <tr key={bucket.id} className="hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelectedBucket(bucket)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className="text-blue-400" />
                  <div className="text-sm font-medium text-white">{bucket.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{bucket.region}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{bucket.objects.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{bucket.size}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  bucket.access === 'Public' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {bucket.access}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{bucket.created}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="text-slate-400 hover:text-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle settings action
                    }}
                  >
                    <Settings size={16} />
                  </button>
                  <button 
                    className="text-slate-400 hover:text-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete action
                    }}
                  >
                    <Trash size={16} />
                  </button>
                  <button 
                    className="text-blue-400 hover:text-blue-300 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBucket(bucket);
                    }}
                  >
                    Explore
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

export default BucketsTab;