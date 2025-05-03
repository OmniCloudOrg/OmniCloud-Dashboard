"use client"

import React from 'react';
import { 
  X, 
  RefreshCw, 
  Plus, 
  Mail, 
  Slack, 
  MessageCircle, 
  Zap, 
  ZapOff, 
  CheckCircle, 
  Edit, 
  PhoneCall,
  Hash,
  MessageSquare
} from 'lucide-react';

export const NotificationChannelsModal = ({ isOpen, onClose, apiBaseUrl }) => {
  if (!isOpen) return null;
  
  const testChannel = (channelId) => {
    console.log(`Testing channel ${channelId} via ${apiBaseUrl}/notification-channels/${channelId}/test`);
    // In a real implementation, you would make an API call here
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Manage Notification Channels</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Configured Channels</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm flex items-center gap-1">
                  <RefreshCw size={14} />
                  <span>Test All</span>
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center gap-1">
                  <Plus size={14} />
                  <span>Add Channel</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Email Channel */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Email Notifications</h4>
                      <div className="text-sm text-slate-400 mt-0.5">Sends alerts to team@example.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle size={14} />
                      <span>Active</span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-300">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Recipients:</span> 8 team members
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Alerts:</span> All severities
                    </div>
                  </div>
                  <button 
                    onClick={() => testChannel('email')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Test
                  </button>
                </div>
              </div>
              
              {/* Slack Channel */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                      <Slack size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Slack</h4>
                      <div className="text-sm text-slate-400 mt-0.5">Posts alerts to #alerts and #incidents channels</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle size={14} />
                      <span>Active</span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-300">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Workspace:</span> acme-corp.slack.com
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Alerts:</span> Critical, Warning
                    </div>
                  </div>
                  <button 
                    onClick={() => testChannel('slack')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Test
                  </button>
                </div>
              </div>
              
              {/* SMS Channel */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">SMS</h4>
                      <div className="text-sm text-slate-400 mt-0.5">Sends text messages to on-call team</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle size={14} />
                      <span>Active</span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-300">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Recipients:</span> 3 team members
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Alerts:</span> Critical only
                    </div>
                  </div>
                  <button 
                    onClick={() => testChannel('sms')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Test
                  </button>
                </div>
              </div>
              
              {/* Webhook Channel */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Webhook</h4>
                      <div className="text-sm text-slate-400 mt-0.5">Integration with external incident management system</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <ZapOff size={14} />
                      <span>Inactive</span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-300">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Endpoint:</span> https://api.incident.io/webhook
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Alerts:</span> All severities
                    </div>
                  </div>
                  <button 
                    onClick={() => testChannel('webhook')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Add New Channel</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <Mail size={24} className="text-blue-400 mb-2" />
                  <div className="text-sm font-medium text-white">Email</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <Slack size={24} className="text-purple-400 mb-2" />
                  <div className="text-sm font-medium text-white">Slack</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <MessageCircle size={24} className="text-green-400 mb-2" />
                  <div className="text-sm font-medium text-white">SMS</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <PhoneCall size={24} className="text-red-400 mb-2" />
                  <div className="text-sm font-medium text-white">Phone Call</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <Hash size={24} className="text-amber-400 mb-2" />
                  <div className="text-sm font-medium text-white">Discord</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <Zap size={24} className="text-amber-400 mb-2" />
                  <div className="text-sm font-medium text-white">Webhook</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <MessageSquare size={24} className="text-blue-400 mb-2" />
                  <div className="text-sm font-medium text-white">Teams</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors flex flex-col items-center justify-center text-center">
                  <Plus size={24} className="text-slate-400 mb-2" />
                  <div className="text-sm font-medium text-white">Custom</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};