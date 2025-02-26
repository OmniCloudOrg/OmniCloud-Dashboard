"use client"

import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Save, 
  Archive, 
  RefreshCw, 
  Clock, 
  Plus, 
  Search, 
  BarChart2, 
  Check, 
  X, 
  AlertTriangle, 
  Settings,
  Trash,
  Edit,
  Download,
  Upload,
  Link,
  Copy,
  FileText,
  Folder,
  ArrowUpDown,
  Tag,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Camera,
  Lock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
          {trend === 'up' ? <ArrowUpDown size={16} className="rotate-180" /> : trend === 'down' ? <ArrowUpDown size={16} className="rotate-0" /> : null}
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

// Status Indicator Component
const StatusIndicator = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'available':
    case 'active':
    case 'healthy':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <Check size={14} />;
      break;
    case 'detached':
    case 'inactive':
    case 'deleted':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <X size={14} />;
      break;
    case 'creating':
    case 'attaching':
    case 'detaching':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={14} className="animate-spin" />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Create Volume Modal Component
const CreateVolumeModal = ({ isOpen, onClose }) => {
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

// Create Bucket Modal Component
const CreateBucketModal = ({ isOpen, onClose }) => {
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

// Object Storage Explorer Component
const ObjectStorageExplorer = ({ bucket }) => {
  const [currentPath, setCurrentPath] = useState('/');
  
  // Sample folder structure
  const folders = [
    { name: 'images', type: 'folder', size: null, lastModified: '2025-02-15' },
    { name: 'documents', type: 'folder', size: null, lastModified: '2025-02-20' },
    { name: 'backups', type: 'folder', size: null, lastModified: '2025-02-22' }
  ];
  
  // Sample files
  const files = [
    { name: 'logo.png', type: 'image', size: '245 KB', lastModified: '2025-02-18' },
    { name: 'report.pdf', type: 'document', size: '1.2 MB', lastModified: '2025-02-19' },
    { name: 'data.json', type: 'json', size: '34 KB', lastModified: '2025-02-21' },
    { name: 'config.yaml', type: 'yaml', size: '8 KB', lastModified: '2025-02-23' },
    { name: 'users.csv', type: 'csv', size: '156 KB', lastModified: '2025-02-24' }
  ];
  
  // Combine folders and files
  const items = [...folders, ...files];
  
  // Function to get icon based on file type
  const getFileIcon = (type) => {
    switch (type) {
      case 'folder':
        return <Folder size={16} className="text-blue-400" />;
      case 'image':
        return <Camera size={16} className="text-green-400" />;
      case 'document':
        return <FileText size={16} className="text-amber-400" />;
      default:
        return <FileText size={16} className="text-slate-400" />;
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-white">{bucket.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {bucket.region}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-slate-300">
            <Settings size={16} />
          </button>
          <button className="text-slate-400 hover:text-slate-300">
            <BarChart2 size={16} />
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800/50 flex items-center gap-2 border-b border-slate-800">
        <div className="flex items-center gap-1 text-slate-400">
          <HardDrive size={14} />
          <span className="text-sm">Path:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          <button 
            onClick={() => setCurrentPath('/')}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            root
          </button>
          {currentPath !== '/' && currentPath.split('/').filter(Boolean).map((segment, index, array) => (
            <React.Fragment key={index}>
              <span className="text-slate-400">/</span>
              <button 
                onClick={() => setCurrentPath('/' + array.slice(0, index + 1).join('/'))}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Modified</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getFileIcon(item.type)}
                    <button 
                      className={`text-sm ${item.type === 'folder' ? 'text-blue-400 hover:text-blue-300' : 'text-white'}`}
                      onClick={() => item.type === 'folder' ? setCurrentPath(`${currentPath}${item.name}/`) : null}
                    >
                      {item.name}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{item.size || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{item.lastModified}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.type !== 'folder' && (
                      <button className="text-slate-400 hover:text-slate-300">
                        <Download size={16} />
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-slate-300">
                      <Link size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-300">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {items.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
              <Folder size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">This folder is empty</h3>
            <p className="text-slate-400 mb-4 max-w-md">
              Upload files or create folders to start organizing your storage.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center gap-1">
                <Upload size={16} />
                <span>Upload Files</span>
              </button>
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 flex items-center gap-1">
                <Folder size={16} />
                <span>New Folder</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Storage Management Component
const StorageManagement = () => {
  const [activeTab, setActiveTab] = useState('volumes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  
  // Sample data for volumes
  const volumes = [
    { id: 'vol-0abc123def456', name: 'app-data', size: 100, type: 'SSD', instance: 'i-0abc123def456', zone: 'us-east-1a', status: 'available', created: '2 months ago' },
    { id: 'vol-0bcd234efg567', name: 'db-data', size: 500, type: 'SSD', instance: 'i-0bcd234efg567', zone: 'us-east-1a', status: 'available', created: '1 month ago' },
    { id: 'vol-0cde345fgh678', name: 'backup-vol', size: 1000, type: 'HDD', instance: null, zone: 'us-east-1b', status: 'available', created: '3 weeks ago' },
    { id: 'vol-0def456ghi789', name: 'temp-storage', size: 50, type: 'SSD', instance: null, zone: 'us-east-1c', status: 'creating', created: '1 hour ago' },
    { id: 'vol-0efg567hij890', name: 'analytics-data', size: 200, type: 'SSD', instance: 'i-0efg567hij890', zone: 'us-west-2a', status: 'available', created: '1 week ago' },
    { id: 'vol-0fgh678ijk901', name: 'archive-data', size: 2000, type: 'Cold HDD', instance: null, zone: 'us-east-1a', status: 'available', created: '2 weeks ago' }
  ];
  
  // Sample data for object storage buckets
  const buckets = [
    { id: 1, name: 'assets-production', region: 'us-east', objects: 1248, size: '42.5 GB', access: 'Private', created: '3 months ago' },
    { id: 2, name: 'user-uploads', region: 'us-east', objects: 8754, size: '156.8 GB', access: 'Private', created: '2 months ago' },
    { id: 3, name: 'static-website', region: 'us-east', objects: 325, size: '5.2 GB', access: 'Public', created: '4 months ago' },
    { id: 4, name: 'backups-daily', region: 'us-west', objects: 90, size: '890.4 GB', access: 'Private', created: '6 months ago' },
    { id: 5, name: 'logs-archive', region: 'eu-central', objects: 4328, size: '24.6 GB', access: 'Private', created: '1 month ago' }
  ];
  
  // Sample data for backups
  const backups = [
    { id: 'bak-0abc123def456', name: 'Daily DB Backup', source: 'Database', size: '12.5 GB', frequency: 'Daily', lastRun: '12 hours ago', status: 'healthy' },
    { id: 'bak-0bcd234efg567', name: 'Weekly Full Backup', source: 'All Systems', size: '85.2 GB', frequency: 'Weekly', lastRun: '3 days ago', status: 'healthy' },
    { id: 'bak-0cde345fgh678', name: 'User Data Backup', source: 'User Service', size: '34.8 GB', frequency: 'Daily', lastRun: '1 day ago', status: 'warning' },
    { id: 'bak-0def456ghi789', name: 'Config Backup', source: 'System Config', size: '0.8 GB', frequency: 'Daily', lastRun: '1 day ago', status: 'healthy' },
    { id: 'bak-0efg567hij890', name: 'Monthly Archive', source: 'All Services', size: '142.6 GB', frequency: 'Monthly', lastRun: '15 days ago', status: 'healthy' }
  ];
  
  // Sample data for snapshots
  const snapshots = [
    { id: 'snap-0abc123def456', name: 'app-data-snap', volume: 'vol-0abc123def456', size: '42.8 GB', created: '2 days ago', status: 'completed' },
    { id: 'snap-0bcd234efg567', name: 'db-data-snap', volume: 'vol-0bcd234efg567', size: '124.5 GB', created: '1 week ago', status: 'completed' },
    { id: 'snap-0cde345fgh678', name: 'pre-update-snap', volume: 'vol-0abc123def456', size: '40.2 GB', created: '2 weeks ago', status: 'completed' },
    { id: 'snap-0def456ghi789', name: 'analytics-backup', volume: 'vol-0efg567hij890', size: '76.3 GB', created: '3 days ago', status: 'creating' },
    { id: 'snap-0efg567hij890', name: 'monthly-snap', volume: 'vol-0abc123def456', size: '44.1 GB', created: '1 month ago', status: 'completed' }
  ];
  
  const tabs = [
    { id: 'volumes', label: 'Volumes' },
    { id: 'objectstorage', label: 'Object Storage' },
    { id: 'backups', label: 'Backups' },
    { id: 'snapshots', label: 'Snapshots' }
  ];
  
  // Filter data based on search query and status filter
  const getFilteredData = () => {
    switch (activeTab) {
      case 'volumes':
        return volumes.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'objectstorage':
        return buckets.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || (statusFilter === 'public' && item.access === 'Public') || (statusFilter === 'private' && item.access === 'Private'))
        );
      case 'backups':
        return backups.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'snapshots':
        return snapshots.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.volume.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      default:
        return [];
    }
  };
  
  // Render content based on active tab
  const renderTabContent = () => {
    const filteredData = getFilteredData();
    
    switch (activeTab) {
      case 'volumes':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Attached To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((volume) => (
                  <tr key={volume.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium text-white">{volume.name}</div>
                        <div className="text-xs text-slate-500">{volume.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{volume.size} GB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{volume.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {volume.instance ? 
                          <span className="text-blue-400 hover:text-blue-300 cursor-pointer">{volume.instance}</span> : 
                          <span className="text-slate-500">-</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{volume.zone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={volume.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>{volume.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <Edit size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Trash size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Actions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <HardDrive size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Volumes Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any volumes matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'objectstorage':
        return selectedBucket ? (
          <ObjectStorageExplorer bucket={selectedBucket} />
        ) : (
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
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Database size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Buckets Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any storage buckets matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'backups':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((backup) => (
                  <tr key={backup.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium text-white">{backup.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{backup.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{backup.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{backup.frequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>{backup.lastRun}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={backup.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <RefreshCw size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Download size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Archive size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Backups Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any backups matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'snapshots':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((snapshot) => (
                  <tr key={snapshot.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium text-white">{snapshot.name}</div>
                        <div className="text-xs text-slate-500">{snapshot.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">{snapshot.volume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{snapshot.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>{snapshot.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={snapshot.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <Copy size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Trash size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Create Volume
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Snapshots Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any snapshots matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Storage usage data for charts
  const storageData = [
    { name: 'Volumes', value: 3850 },
    { name: 'Object Storage', value: 1120 },
    { name: 'Backups', value: 2450 },
    { name: 'Snapshots', value: 580 }
  ];
  
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Storage</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              if (activeTab === 'volumes') setIsVolumeModalOpen(true);
              else if (activeTab === 'objectstorage') setIsBucketModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>{activeTab === 'volumes' ? 'Create Volume' : activeTab === 'objectstorage' ? 'Create Bucket' : activeTab === 'backups' ? 'Create Backup' : 'Create Snapshot'}</span>
          </button>
        </div>
      </div>
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Storage" 
          value="8.0 TB" 
          percentage="12" 
          trend="up" 
          icon={Database} 
          color="bg-blue-500/10 text-blue-400" 
        />
        <ResourceCard 
          title="Volumes" 
          value="3.85 TB" 
          icon={HardDrive} 
          color="bg-green-500/10 text-green-400" 
          subtitle="6 volumes"
        />
        <ResourceCard 
          title="Object Storage" 
          value="1.12 TB" 
          icon={Save} 
          color="bg-purple-500/10 text-purple-400" 
          subtitle="5 buckets"
        />
        <ResourceCard 
          title="Backups & Snapshots" 
          value="3.03 TB" 
          icon={Archive} 
          color="bg-amber-500/10 text-amber-400" 
          subtitle="10 active backups"
        />
      </div>
      
      {/* Storage usage chart */}
      {!selectedBucket && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Storage Growth</h3>
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { date: '01/25', volumes: 3200, objects: 800, backups: 1800, snapshots: 400 },
                      { date: '01/26', volumes: 3250, objects: 820, backups: 1850, snapshots: 420 },
                      { date: '01/27', volumes: 3300, objects: 840, backups: 1900, snapshots: 440 },
                      { date: '01/28', volumes: 3350, objects: 860, backups: 1950, snapshots: 460 },
                      { date: '01/29', volumes: 3400, objects: 880, backups: 2000, snapshots: 480 },
                      { date: '01/30', volumes: 3450, objects: 900, backups: 2050, snapshots: 500 },
                      { date: '01/31', volumes: 3500, objects: 920, backups: 2100, snapshots: 520 },
                      { date: '02/01', volumes: 3550, objects: 940, backups: 2150, snapshots: 540 },
                      { date: '02/02', volumes: 3600, objects: 960, backups: 2200, snapshots: 560 },
                      { date: '02/03', volumes: 3650, objects: 980, backups: 2250, snapshots: 580 },
                      { date: '02/04', volumes: 3700, objects: 1000, backups: 2300, snapshots: 580 },
                      { date: '02/05', volumes: 3750, objects: 1020, backups: 2350, snapshots: 580 },
                      { date: '02/06', volumes: 3800, objects: 1040, backups: 2400, snapshots: 580 },
                      { date: '02/07', volumes: 3850, objects: 1120, backups: 2450, snapshots: 580 }
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorVolumes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorObjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBackups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSnapshots" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => [`${value} GB`]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volumes" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorVolumes)" 
                      name="Volumes"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="objects" 
                      stackId="1"
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorObjects)" 
                      name="Object Storage"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="backups" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fillOpacity={1}
                      fill="url(#colorBackups)" 
                      name="Backups"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="snapshots" 
                      stackId="1"
                      stroke="#f59e0b" 
                      fillOpacity={1}
                      fill="url(#colorSnapshots)" 
                      name="Snapshots"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-300">Volumes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-300">Object Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-300">Backups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-slate-300">Snapshots</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-medium text-white">Storage Distribution</h3>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={storageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {storageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} GB`]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-slate-400 mb-1">Monthly Cost</h4>
                  <div className="text-xl font-bold text-white">$243.50</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-slate-400 mb-1">Projected</h4>
                  <div className="text-xl font-bold text-white">$278.20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs for different storage components */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        {!selectedBucket && (
          <div className="border-b border-slate-800">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-blue-400 border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-6">
          {selectedBucket ? (
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setSelectedBucket(null)}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300"
              >
                <ChevronDown className="rotate-90" size={16} />
                <span>Back to Buckets</span>
              </button>
              <div className="flex gap-3">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm">
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm">
                  <Folder size={16} />
                  <span>New Folder</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-3 self-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">All Statuses</option>
                  {activeTab === 'volumes' && (
                    <>
                      <option value="available">Available</option>
                      <option value="creating">Creating</option>
                      <option value="attaching">Attaching</option>
                      <option value="detaching">Detaching</option>
                    </>
                  )}
                  {activeTab === 'objectstorage' && (
                    <>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </>
                  )}
                  {activeTab === 'backups' && (
                    <>
                      <option value="healthy">Healthy</option>
                      <option value="warning">Warning</option>
                    </>
                  )}
                  {activeTab === 'snapshots' && (
                    <>
                      <option value="completed">Completed</option>
                      <option value="creating">Creating</option>
                    </>
                  )}
                </select>
                
                {activeTab === 'volumes' && (
                  <select
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="ssd">SSD</option>
                    <option value="hdd">HDD</option>
                    <option value="cold">Cold Storage</option>
                  </select>
                )}
                
                {activeTab === 'backups' && (
                  <select
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Sources</option>
                    <option value="database">Database</option>
                    <option value="system">System</option>
                    <option value="user">User Service</option>
                  </select>
                )}
              </div>
            </div>
          )}
          
          {renderTabContent()}
        </div>
      </div>
      
      {/* Modals */}
      <CreateVolumeModal isOpen={isVolumeModalOpen} onClose={() => setIsVolumeModalOpen(false)} />
      <CreateBucketModal isOpen={isBucketModalOpen} onClose={() => setIsBucketModalOpen(false)} />
    </div>
  );
};

export default StorageManagement;