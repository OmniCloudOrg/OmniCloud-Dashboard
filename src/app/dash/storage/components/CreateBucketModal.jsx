import React from 'react';
import { X } from 'lucide-react';

export const CreateBucketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Object Storage Bucket</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bucket Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="my-unique-bucket-name"
              />
              <p className="mt-1 text-xs text-slate-500">Bucket names must be globally unique and DNS-compliant</p>
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
                <label className="block text-sm font-medium text-slate-400 mb-1">Storage Class</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="infrequent">Infrequent Access</option>
                  <option value="archive">Archive</option>
                  <option value="glacier">Glacier</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Access Control</label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="private-access"
                    name="access-control"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="private-access" className="ml-2 text-sm text-white">
                    Private (Only authorized users can access)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="public-read"
                    name="access-control"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="public-read" className="ml-2 text-sm text-white">
                    Public Read (Anyone can read, only you can write)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="public-readwrite"
                    name="access-control"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="public-readwrite" className="ml-2 text-sm text-white">
                    Public Read/Write (Not recommended)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400">Advanced Options</label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="versioning"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  defaultChecked
                />
                <label htmlFor="versioning" className="ml-2 text-sm text-white">
                  Enable Versioning
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="encryption"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  defaultChecked
                />
                <label htmlFor="encryption" className="ml-2 text-sm text-white">
                  Server-side Encryption
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lifecycle"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="lifecycle" className="ml-2 text-sm text-white">
                  Configure Lifecycle Rules
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (Optional)</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  <span>Project: Website</span>
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
              Create Bucket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateVolumeModal, CreateBucketModal };