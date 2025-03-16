"use client"

import React, { useState } from 'react';
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  Server, 
  Database, 
  Search, 
  Filter, 
  RefreshCw, 
  Plus,
  Users,
  Settings,
  Trash,
  Edit,
  Eye,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  X,
  Play,
  Pause,
  Copy,
  Share,
  ArrowUpRight,
  Activity,
  Calendar,
  User,
  BarChart2,
  Download,
  ZapOff,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Monitor,
  Zap,
  Cloud,
  Terminal,
  Mail,
  Slack,
  MessageCircle,
  PhoneCall,
  Hash
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowUpRight size={16} className="rotate-90" /> : null}
          {percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Severity Badge Component
const SeverityBadge = ({ severity }) => {
  let bgColor, textColor, icon;
  
  switch (severity.toLowerCase()) {
    case 'critical':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    case 'info':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <Info size={14} />;
      break;
    case 'resolved':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="capitalize">{severity}</span>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ alert, expanded, onToggle }) => {
  return (
    <div 
      className={`border-b border-slate-800 ${expanded ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}
    >
      <div 
        className="px-4 py-3 flex items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-none pt-1">
          {expanded ? 
            <ChevronDown size={16} className="text-slate-400" /> : 
            <ChevronRight size={16} className="text-slate-400" />
          }
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <SeverityBadge severity={alert.severity} />
            <div className="text-sm font-medium text-white truncate">{alert.title}</div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{alert.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server size={12} />
              <span>{alert.source}</span>
            </div>
            {alert.service && (
              <div className="flex items-center gap-1">
                <Activity size={12} />
                <span>{alert.service}</span>
              </div>
            )}
            {alert.assignee && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{alert.assignee}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex items-center">
          <button className="p-1 text-slate-400 hover:text-slate-300">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <div className="text-sm text-slate-300 whitespace-pre-line mb-4">
              {alert.description}
            </div>
            
            {alert.data && (
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto mb-4">
                {typeof alert.data === 'string' ? alert.data : JSON.stringify(alert.data, null, 2)}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Alert ID</div>
                <div className="text-slate-300 font-mono">{alert.id}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Alert Rule</div>
                <div className="text-slate-300">{alert.rule || 'Manual Alert'}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">First Detected</div>
                <div className="text-slate-300">{alert.firstDetected || alert.timestamp}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Status</div>
                <SeverityBadge severity={alert.severity} />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Play size={14} />
                <span>Runbook</span>
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Terminal size={14} />
                <span>View Logs</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              {alert.severity !== 'resolved' && (
                <button className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>Resolve</span>
                </button>
              )}
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Share size={14} />
                <span>Escalate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Alert Rule Modal Component
const CreateAlertRuleModal = ({ isOpen, onClose }) => {
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
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="High CPU Usage Alert"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Alert when CPU usage exceeds threshold for a sustained period"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Resource Type</label>
                <select
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
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="above">Greater than</option>
                  <option value="below">Less than</option>
                  <option value="equal">Equal to</option>
                  <option value="not-equal">Not equal to</option>
                </select>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="90"
                />
                <select
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
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="5"
                />
                <select
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
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
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
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
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
              Create Alert Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Channels Modal Component
const NotificationChannelsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
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
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
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
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
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
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
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
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
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

// Main Alerts Management Component
const AlertsManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChannelsModalOpen, setIsChannelsModalOpen] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState(null);
  
  // Sample alert data
  const alerts = [
    {
      id: 'alert-001',
      title: 'High CPU Usage on API Server',
      severity: 'critical',
      timestamp: '10 minutes ago',
      source: 'api-server-001',
      service: 'API Service',
      assignee: null,
      description: 'CPU usage has exceeded 95% for more than 5 minutes on api-server-001. This may indicate a resource constraint or runaway process.',
      rule: 'CPU Usage > 95% for 5m',
      firstDetected: '10 minutes ago',
      data: {
        cpu: 97.8,
        memory: 82.5,
        processes: [
          { name: 'node', pid: 12345, cpu: 80.5, memory: 45.2 },
          { name: 'nginx', pid: 12346, cpu: 10.2, memory: 12.5 }
        ]
      }
    },
    {
      id: 'alert-002',
      title: 'Database Connection Pool Exhausted',
      severity: 'critical',
      timestamp: '25 minutes ago',
      source: 'postgres-db-primary',
      service: 'Database',
      assignee: 'jane.smith',
      description: 'The application is unable to establish new database connections because the connection pool is exhausted. This may lead to service degradation or outage.',
      rule: 'DB Connection Pool > 95% for 2m',
      firstDetected: '25 minutes ago',
      data: {
        pool_size: 100,
        active_connections: 100,
        waiting_clients: 45,
        queries_per_second: 1250
      }
    },
    {
      id: 'alert-003',
      title: 'High API Error Rate',
      severity: 'warning',
      timestamp: '40 minutes ago',
      source: 'api-gateway',
      service: 'API Gateway',
      assignee: null,
      description: 'The error rate for API requests has increased above the threshold of 5%. This may indicate issues with downstream services or client requests.',
      rule: 'Error Rate > 5% for 3m',
      firstDetected: '40 minutes ago',
      data: {
        error_rate: 7.8,
        total_requests: 12548,
        failed_requests: 978,
        top_errors: [
          { code: 502, count: 423, message: 'Bad Gateway' },
          { code: 500, count: 312, message: 'Internal Server Error' },
          { code: 429, count: 243, message: 'Too Many Requests' }
        ]
      }
    },
    {
      id: 'alert-004',
      title: 'Low Disk Space',
      severity: 'warning',
      timestamp: '1 hour ago',
      source: 'file-server-002',
      service: 'Storage',
      assignee: 'john.doe',
      description: 'Available disk space on file-server-002 is below 15%. If the disk continues to fill up, it may impact service availability.',
      rule: 'Disk Space < 15% for 10m',
      firstDetected: '1 hour ago',
      data: {
        disk_total: '2.0 TB',
        disk_used: '1.73 TB',
        disk_available: '270 GB',
        disk_percent: 86.5
      }
    },
    {
      id: 'alert-005',
      title: 'Payment Gateway Connection Timeout',
      severity: 'critical',
      timestamp: '1.5 hours ago',
      source: 'payment-service',
      service: 'Payment Service',
      assignee: 'alex.johnson',
      description: 'Connections to the payment gateway are timing out. This is preventing customers from completing purchases.',
      rule: 'Payment Gateway Response Time > 5s for 5m',
      firstDetected: '1.5 hours ago',
      data: {
        avg_response_time: '8.2s',
        timeout_percentage: 62.5,
        successful_transactions: 145,
        failed_transactions: 242,
        gateway: 'stripe-api'
      }
    },
    {
      id: 'alert-006',
      title: 'API Rate Limit Reached',
      severity: 'info',
      timestamp: '2 hours ago',
      source: 'external-api-client',
      service: 'Integration Service',
      assignee: null,
      description: 'The rate limit for the external API service has been reached. Some operations may be delayed until the limit resets.',
      rule: 'Rate Limit Threshold > 95% for 1m',
      firstDetected: '2 hours ago',
      data: {
        provider: 'github-api',
        limit: 5000,
        remaining: 12,
        reset_time: '2025-02-25T14:30:00Z'
      }
    },
    {
      id: 'alert-007',
      title: 'SSL Certificate Expiring Soon',
      severity: 'warning',
      timestamp: '5 hours ago',
      source: 'load-balancer-001',
      service: 'Load Balancer',
      assignee: null,
      description: 'The SSL certificate for api.example.com will expire in 15 days. Please renew the certificate to avoid service disruption.',
      rule: 'SSL Certificate < 15 days to expiry',
      firstDetected: '5 hours ago',
      data: {
        domain: 'api.example.com',
        issuer: 'Let\'s Encrypt',
        expires: '2025-03-12T00:00:00Z',
        days_remaining: 15
      }
    },
    {
      id: 'alert-008',
      title: 'Database Backup Failed',
      severity: 'critical',
      timestamp: '6 hours ago',
      source: 'backup-service',
      service: 'Backup Service',
      assignee: 'john.doe',
      description: 'The scheduled database backup failed to complete. Please check the backup logs for more information.',
      rule: 'Backup Job Status = Failed',
      firstDetected: '6 hours ago',
      data: {
        backup_job_id: 'backup-20250225-04',
        database: 'postgres-main',
        error: 'Insufficient storage space for backup',
        last_successful_backup: '2025-02-24T04:00:00Z'
      }
    },
    {
      id: 'alert-009',
      title: 'High Memory Usage',
      severity: 'resolved',
      timestamp: '12 hours ago',
      source: 'app-server-005',
      service: 'Application Service',
      assignee: 'sarah.williams',
      description: 'Memory usage on app-server-005 exceeded 90% for more than 5 minutes. The issue has been resolved by restarting the application.',
      rule: 'Memory Usage > 90% for 5m',
      firstDetected: '12 hours ago',
      resolvedAt: '11 hours ago',
      resolvedBy: 'sarah.williams',
      data: {
        memory_total: '64 GB',
        memory_used: '59.2 GB',
        memory_free: '4.8 GB',
        memory_percent: 92.5
      }
    },
    {
      id: 'alert-010',
      title: 'Network Connectivity Issue',
      severity: 'resolved',
      timestamp: '1 day ago',
      source: 'network-switch-003',
      service: 'Network',
      assignee: 'alex.johnson',
      description: 'Network switch network-switch-003 is experiencing connectivity issues. This may impact services in Rack B12.',
      rule: 'Network Device Status = Down',
      firstDetected: '1 day ago',
      resolvedAt: '23 hours ago',
      resolvedBy: 'alex.johnson',
      data: {
        device: 'network-switch-003',
        location: 'Rack B12',
        downtime: '32 minutes',
        affected_devices: 8
      }
    }
  ];
  
  // Filter alerts based on search query, tab, and severity filter
  const getFilteredAlerts = () => {
    let filtered = alerts.filter(alert => 
      (searchQuery === '' || 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.service && alert.service.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      (severityFilter === 'all' || alert.severity === severityFilter)
    );
    
    // Apply tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(alert => alert.severity !== 'resolved');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(alert => alert.severity === 'resolved');
    } else if (activeTab === 'critical') {
      filtered = filtered.filter(alert => alert.severity === 'critical');
    } else if (activeTab === 'assigned') {
      filtered = filtered.filter(alert => alert.assignee);
    }
    
    return filtered;
  };
  
  const filteredAlerts = getFilteredAlerts();
  
  // Toggle alert expansion
  const toggleAlertExpansion = (alertId) => {
    if (expandedAlert === alertId) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(alertId);
    }
  };
  
  // Count alerts by severity for stats cards
  const countAlerts = (severity) => {
    return alerts.filter(alert => alert.severity === severity).length;
  };
  
  const activeSeverityCounts = {
    critical: countAlerts('critical'),
    warning: countAlerts('warning'),
    info: countAlerts('info')
  };
  
  // Recent alert activity data for chart
  const alertActivityData = [
    { time: '02/19', critical: 3, warning: 4, info: 2 },
    { time: '02/20', critical: 2, warning: 3, info: 5 },
    { time: '02/21', critical: 4, warning: 6, info: 3 },
    { time: '02/22', critical: 5, warning: 4, info: 2 },
    { time: '02/23', critical: 3, warning: 5, info: 4 },
    { time: '02/24', critical: 2, warning: 3, info: 6 },
    { time: '02/25', critical: 4, warning: 2, info: 3 }
  ];
  
  // Sample alert rules
  const alertRules = [
    { id: 1, name: 'High CPU Usage', condition: 'CPU > 90% for 5m', target: 'All Servers', severity: 'critical', status: 'active' },
    { id: 2, name: 'High Memory Usage', condition: 'Memory > 85% for 5m', target: 'All Servers', severity: 'warning', status: 'active' },
    { id: 3, name: 'Low Disk Space', condition: 'Disk Space < 15% for 10m', target: 'All Servers', severity: 'warning', status: 'active' },
    { id: 4, name: 'High API Error Rate', condition: 'Error Rate > 5% for 3m', target: 'API Gateway', severity: 'warning', status: 'active' },
    { id: 5, name: 'Database Connection Issues', condition: 'Connection Pool > 95% for 2m', target: 'Database Servers', severity: 'critical', status: 'active' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Alerts</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChannelsModalOpen(true)} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Bell size={16} />
            <span>Channels</span>
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Create Rule</span>
          </button>
        </div>
      </div>
      
      {/* Alert Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Active Alerts" 
          value={activeSeverityCounts.critical + activeSeverityCounts.warning + activeSeverityCounts.info} 
          icon={Bell} 
          color="bg-blue-500/10 text-blue-400" 
        />
        <ResourceCard 
          title="Critical Alerts" 
          value={activeSeverityCounts.critical} 
          percentage={activeSeverityCounts.critical > 0 ? 100 : 0} 
          trend={activeSeverityCounts.critical > 0 ? 'up' : 'down'} 
          icon={AlertCircle} 
          color="bg-red-500/10 text-red-400" 
        />
        <ResourceCard 
          title="Warning Alerts" 
          value={activeSeverityCounts.warning} 
          icon={AlertTriangle} 
          color="bg-yellow-500/10 text-yellow-400" 
        />
        <ResourceCard 
          title="Info Alerts" 
          value={activeSeverityCounts.info} 
          icon={Info} 
          color="bg-blue-500/10 text-blue-400" 
        />
      </div>
      
      {/* Alert Activity and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Alert Activity</h3>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="critical" name="Critical" fill="#f87171" />
                  <Bar dataKey="warning" name="Warning" fill="#facc15" />
                  <Bar dataKey="info" name="Info" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Alert Rules</h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Add Rule
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {alertRules.slice(0, 4).map((rule) => (
              <div key={rule.id} className="p-4 hover:bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-white">{rule.name}</div>
                  <SeverityBadge severity={rule.severity} />
                </div>
                <div className="text-xs font-mono bg-slate-800 rounded p-1.5 mb-2 text-slate-400">
                  {rule.condition}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Target: {rule.target}</span>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-1">●</span>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-800">
            <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
              View All Rules
            </button>
          </div>
        </div>
      </div>
      
      {/* Alerts List */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'active' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Active ({activeSeverityCounts.critical + activeSeverityCounts.warning + activeSeverityCounts.info})
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'critical' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Critical ({activeSeverityCounts.critical})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'assigned' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Assigned
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'resolved' ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Resolved
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Download size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <BarChart2 size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search alerts by title, source or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <select
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Services</option>
                <option value="api">API Service</option>
                <option value="database">Database</option>
                <option value="payment">Payment Service</option>
                <option value="storage">Storage</option>
                <option value="network">Network</option>
              </select>
            </div>
          </div>
          
          {/* Alert Results */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
            {filteredAlerts.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {filteredAlerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    expanded={expandedAlert === alert.id} 
                    onToggle={() => toggleAlertExpansion(alert.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Bell size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Alerts Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any alerts matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSeverityFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredAlerts.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                Showing {filteredAlerts.length} of {activeTab === 'active' ? activeSeverityCounts.critical + activeSeverityCounts.warning + activeSeverityCounts.info : alerts.length} alerts
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
                  Previous
                </button>
                <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <CreateAlertRuleModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <NotificationChannelsModal isOpen={isChannelsModalOpen} onClose={() => setIsChannelsModalOpen(false)} />
    </div>
  );
};

export default AlertsManagement;