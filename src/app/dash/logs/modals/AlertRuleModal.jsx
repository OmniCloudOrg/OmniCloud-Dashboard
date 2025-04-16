"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';

const AlertRuleModal = ({ isOpen, onClose }) => {
  const [alertName, setAlertName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionType, setConditionType] = useState('greater-than');
  const [conditionValue, setConditionValue] = useState(5);
  const [conditionMetric, setConditionMetric] = useState('occurrences');
  const [timeValue, setTimeValue] = useState(5);
  const [timeUnit, setTimeUnit] = useState('minutes');
  const [severity, setSeverity] = useState('warning');
  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    slack: true,
    webhook: false
  });

  const handleSave = () => {
    // Implement save logic here
    console.log('Creating alert rule', {
      alertName,
      searchQuery,
      condition: {
        type: conditionType,
        value: conditionValue,
        metric: conditionMetric
      },
      timeWindow: {
        value: timeValue,
        unit: timeUnit
      },
      severity,
      notificationChannels
    });
    onClose();
  };

  const toggleNotificationChannel = (channel) => {
    setNotificationChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Log Alert</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Alert Name</label>
              <input
                type="text"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="API Service Error Rate"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Search Query</label>
              <textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                placeholder="level:error service:api-service"
                rows={2}
              />
              <p className="mt-1 text-xs text-slate-500">
                This query will be used to filter logs for this alert.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="greater-than">Greater than</option>
                  <option value="less-than">Less than</option>
                  <option value="equal-to">Equal to</option>
                  <option value="not-equal-to">Not equal to</option>
                </select>
                <input
                  type="number"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={conditionMetric}
                  onChange={(e) => setConditionMetric(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="occurrences">occurrences</option>
                  <option value="percentage">percentage</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Alert when the number of matching logs exceeds this threshold in the time window.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Time Window</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={timeValue}
                  onChange={(e) => setTimeValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Notification Channels</h3>
              <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-email"
                      checked={notificationChannels.email}
                      onChange={() => toggleNotificationChannel('email')}
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="notify-email" className="ml-2 text-sm text-white">
                      Email
                    </label>
                  </div>
                  <span className="text-xs text-slate-400">team@example.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-slack"
                      checked={notificationChannels.slack}
                      onChange={() => toggleNotificationChannel('slack')}
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="notify-slack" className="ml-2 text-sm text-white">
                      Slack
                    </label>
                  </div>
                  <span className="text-xs text-slate-400">#alerts-channel</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-webhook"
                      checked={notificationChannels.webhook}
                      onChange={() => toggleNotificationChannel('webhook')}
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="notify-webhook" className="ml-2 text-sm text-white">
                      Webhook
                    </label>
                  </div>
                  <button className="text-xs text-blue-400 hover:text-blue-300">
                    Configure
                  </button>
                </div>
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
              disabled={!alertName || !searchQuery}
            >
              Create Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertRuleModal;