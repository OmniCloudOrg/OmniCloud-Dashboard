"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';

const SaveSearchModal = ({ isOpen, onClose }) => {
  const [searchName, setSearchName] = useState('');
  const [description, setDescription] = useState('');
  const [pinToDashboard, setPinToDashboard] = useState(false);
  const [createAlert, setCreateAlert] = useState(false);
  const [shareWithTeam, setShareWithTeam] = useState(true);

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving search', {
      searchName,
      description,
      pinToDashboard,
      createAlert,
      shareWithTeam
    });
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Save Search</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Search Name</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Error logs in API service"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Filters for all error logs in the API service"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Options</span>
              </label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pin-search"
                  checked={pinToDashboard}
                  onChange={() => setPinToDashboard(!pinToDashboard)}
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="pin-search" className="ml-2 text-sm text-white">
                  Pin to dashboard
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="create-alert"
                  checked={createAlert}
                  onChange={() => setCreateAlert(!createAlert)}
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="create-alert" className="ml-2 text-sm text-white">
                  Create alert from this search
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="share-team"
                  checked={shareWithTeam}
                  onChange={() => setShareWithTeam(!shareWithTeam)}
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="share-team" className="ml-2 text-sm text-white">
                  Share with team
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              disabled={!searchName}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSearchModal;