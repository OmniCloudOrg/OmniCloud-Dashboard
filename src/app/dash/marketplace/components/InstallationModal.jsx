"use client"

import React from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  Github, 
  AlertCircle 
} from 'lucide-react';

export const InstallationModal = ({ item, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-white">Install {item.name}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4">
              You're about to install <span className="font-medium text-white">{item.name}</span> by {item.authorName}.
            </p>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg mb-4">
              <Github size={16} className="text-slate-300" />
              <span className="text-sm text-slate-300">{item.repoUrl}</span>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
              <h4 className="font-medium text-slate-200 mb-2">This extension will:</h4>
              <ul className="space-y-2">
                {item.permissions?.slice(0, 3).map((permission, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-green-400 mt-0.5" />
                    <span className="text-slate-300">{permission}</span>
                  </li>
                ))}
                {(item.permissions?.length || 0) > 3 && (
                  <li className="text-sm text-slate-400 ml-6">
                    And {(item.permissions?.length || 0) - 3} more permissions...
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
              <p className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>All extensions are open source under the {item.license} license.</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(item)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Confirm Installation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};