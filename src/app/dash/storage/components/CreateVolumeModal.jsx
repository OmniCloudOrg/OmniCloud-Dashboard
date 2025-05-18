import React from 'react';
import { X } from 'lucide-react';

export const CreateVolumeModal = ({ storageClasses, apiClient, onVolumeCreated, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Storage Volume</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Volume Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="my-volume"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Size (GB)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Volume Type</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ssd">SSD (General Purpose)</option>
                  <option value="premium-ssd">Premium SSD</option>
                  <option value="hdd">HDD (Throughput Optimized)</option>
                  <option value="cold">Cold Storage</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Region</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="us-east">US East (N. Virginia)</option>
                  <option value="us-west">US West (Oregon)</option>
                  <option value="eu-central">EU Central (Frankfurt)</option>
                  <option value="ap-southeast">Asia Pacific (Singapore)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Availability Zone</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="us-east-1a">us-east-1a</option>
                  <option value="us-east-1b">us-east-1b</option>
                  <option value="us-east-1c">us-east-1c</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Attach to Instance (Optional)</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Do not attach</option>
                <option value="i-0abc123def456">i-0abc123def456 (Web Server)</option>
                <option value="i-0bcd234efg567">i-0bcd234efg567 (API Server)</option>
                <option value="i-0cde345fgh678">i-0cde345fgh678 (Database)</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400">Advanced Options</label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="encrypted"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  defaultChecked
                />
                <label htmlFor="encrypted" className="ml-2 text-sm text-white">
                  Encrypt Volume
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="multi-attach"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="multi-attach" className="ml-2 text-sm text-white">
                  Enable Multi-Attach
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-snapshot"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  defaultChecked
                />
                <label htmlFor="auto-snapshot" className="ml-2 text-sm text-white">
                  Enable Automatic Snapshots
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (Optional)</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  <span>Environment: Production</span>
                  <button className="text-blue-400 hover:text-blue-300">
                    <X size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  className="flex-1 min-w-[100px] bg-transparent border-none text-white focus:outline-none text-sm"
                  placeholder="Add tags (key:value)"
                />
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
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Create Volume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};