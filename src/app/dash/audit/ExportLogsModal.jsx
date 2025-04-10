"use client"

import React from 'react';
import { 
  ModalContainer, 
  FormField, 
  FormGroup, 
  Button 
} from '../components/ui';

/**
 * Export Logs Modal Component - Modal for configuring and exporting audit logs
 * Refactored to use the UI component library
 */
const ExportLogsModal = ({ isOpen, onClose }) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Export Audit Logs"
      maxWidth="md"
    >
      <div className="space-y-6">
        <FormField
          label="Time Range"
          id="timeRange"
          type="select"
          options={[
            { value: 'current', label: 'Current Selection' },
            { value: '24h', label: 'Last 24 Hours' },
            { value: '7d', label: 'Last 7 Days' },
            { value: '30d', label: 'Last 30 Days' },
            { value: 'custom', label: 'Custom Range' }
          ]}
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Format</label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center justify-center border border-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-800">
              <input type="radio" name="format" value="csv" className="sr-only" defaultChecked />
              <div className="text-center">
                <div className="text-blue-400 font-medium">CSV</div>
                <div className="text-xs text-slate-400 mt-1">Spreadsheet</div>
              </div>
            </label>
            <label className="flex items-center justify-center border border-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-800">
              <input type="radio" name="format" value="json" className="sr-only" />
              <div className="text-center">
                <div className="text-green-400 font-medium">JSON</div>
                <div className="text-xs text-slate-400 mt-1">Raw Data</div>
              </div>
            </label>
            <label className="flex items-center justify-center border border-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-800">
              <input type="radio" name="format" value="pdf" className="sr-only" />
              <div className="text-center">
                <div className="text-red-400 font-medium">PDF</div>
                <div className="text-xs text-slate-400 mt-1">Report</div>
              </div>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Included Fields</label>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">User</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">Event Type</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">Timestamp</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">Resource</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">IP Address</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
                <span className="text-sm text-white">Details</span>
              </label>
            </div>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300">
            Select All
          </button>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
            <span className="text-sm text-white">Schedule recurring export</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700" />
            <span className="text-sm text-white">Include sensitive fields</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-8">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
        >
          Export Logs
        </Button>
      </div>
    </ModalContainer>
  );
};

export default ExportLogsModal;