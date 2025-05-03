"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';

export const CreateAlertRuleModal = ({ isOpen, onClose, apiBaseUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resourceType: 'server',
    metric: 'cpu',
    condition: 'above',
    threshold: '90',
    unit: 'percent',
    duration: '5',
    durationUnit: 'minutes',
    severity: 'critical',
    autoRemediation: 'none',
    notifications: {
      email: true,
      slack: true,
      sms: false,
      webhook: false
    }
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // This would be the actual API call in a real implementation
      console.log('Creating alert rule:', formData);
      console.log(`API URL would be: ${apiBaseUrl}/alert-rules`);
      
      // In a real implementation, we would make the API request here
      // const response = await fetch(`${apiBaseUrl}/alert-rules`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // 
      // if (!response.ok) throw new Error('Failed to create alert rule');
      
      // Close the modal on success
      onClose();
    } catch (error) {
      console.error('Error creating alert rule:', error);
      // Handle error (e.g., show error message)
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Alert Rule</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="High CPU Usage Alert"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Alert when CPU usage exceeds threshold for a sustained period"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Resource Type</label>
                  <select
                    name="resourceType"
                    value={formData.resourceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="server">Server</option>
                    <option value="container">Container</option>
                    <option value="database">Database</option>
                    <option value="application">Application</option>
                    <option value="service">Service</option>
                    <option value="network">Network</option>
                    <option value="storage">Storage</option>
                    <option value="custom">Custom Metric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Metric</label>
                  <select
                    name="metric"
                    value={formData.metric}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="cpu">CPU Usage</option>
                    <option value="memory">Memory Usage</option>
                    <option value="disk">Disk Usage</option>
                    <option value="network">Network Traffic</option>
                    <option value="latency">Response Time</option>
                    <option value="errors">Error Rate</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="above">Greater than</option>
                    <option value="below">Less than</option>
                    <option value="equal">Equal to</option>
                    <option value="not-equal">Not equal to</option>
                  </select>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="percent">Percent</option>
                    <option value="value">Value</option>
                    <option value="count">Count</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <select
                    name="durationUnit"
                    value={formData.durationUnit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="seconds">Seconds</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Severity</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Auto-Remediation</label>
                  <select
                    name="autoRemediation"
                    value={formData.autoRemediation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="restart">Restart Service</option>
                    <option value="scale">Scale Resources</option>
                    <option value="custom">Run Custom Script</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Notification Channels</label>
                <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-email"
                        name="email"
                        checked={formData.notifications.email}
                        onChange={handleInputChange}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <label htmlFor="notify-email" className="ml-2 text-sm text-white">
                        Email
                      </label>
                    </div>
                    <select
                      className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300"
                    >
                      <option value="all">All Team Members</option>
                      <option value="admins">Admins Only</option>
                      <option value="ops">Operations Team</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-slack"
                        name="slack"
                        checked={formData.notifications.slack}
                        onChange={handleInputChange}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <label htmlFor="notify-slack" className="ml-2 text-sm text-white">
                        Slack
                      </label>
                    </div>
                    <select
                      className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300"
                    >
                      <option value="alerts">#alerts</option>
                      <option value="general">#general</option>
                      <option value="incidents">#incidents</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-sms"
                        name="sms"
                        checked={formData.notifications.sms}
                        onChange={handleInputChange}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <label htmlFor="notify-sms" className="ml-2 text-sm text-white">
                        SMS
                      </label>
                    </div>
                    <select
                      className="bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-slate-300"
                    >
                      <option value="oncall">On-Call Team</option>
                      <option value="all">All Team Members</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-webhook"
                        name="webhook"
                        checked={formData.notifications.webhook}
                        onChange={handleInputChange}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <label htmlFor="notify-webhook" className="ml-2 text-sm text-white">
                        Webhook
                      </label>
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300">Configure</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Create Alert Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};