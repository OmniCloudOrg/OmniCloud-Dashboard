"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
  ChevronDown,
  Folder,
  Upload,
  Settings
} from 'lucide-react';

// Import components
import {ResourceCard} from '../components/ui/card-components';
import { StatusIndicator } from '../components/ui/common-components';
import { CreateVolumeModal } from './components/CreateVolumeModal';
import { CreateBucketModal } from './components/CreateBucketModal';
import ObjectStorageExplorer from './components/ObjectStorageExplorer';
import { StorageGrowthChart } from './components/StorageGrowthChart';
import { StorageDistributionChart } from './components/StorageDistributionChart';
import VolumesTab from './tabs/VolumesTab';
import BucketsTab from './tabs/BucketsTab';
import { BackupsTab } from './tabs/BackupsTab';
import { SnapshotsTab } from './tabs/SnapshotsTab';

const StorageManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Define tabs with their corresponding hash paths
  const tabs = [
    { id: 'volumes', label: 'Volumes', path: '/storage#volumes' },
    { id: 'objectstorage', label: 'Object Storage', path: '/storage#objectstorage' },
    { id: 'backups', label: 'Backups', path: '/storage#backups' },
    { id: 'snapshots', label: 'Snapshots', path: '/storage#snapshots' }
  ];
  
  // Determine initial active tab based on the URL hash
  const getInitialActiveTab = () => {
    // Default to 'volumes' if no match is found
    if (typeof window === 'undefined') return 'volumes';
    
    // Get hash from URL (remove the # character)
    const hash = window.location.hash.substring(1);
    
    if (hash && tabs.some(tab => tab.id === hash)) {
      return hash;
    }
    
    return 'volumes'; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  
  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    window.location.hash = tabId;
    setActiveTab(tabId);
  };
  
  // Initialize the active tab and bucket based on hash on component mount and when hash changes
  useEffect(() => {
    // Function to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      
      // Check if hash contains a bucket path
      if (hash.startsWith('objectstorage/bucket/')) {
        const bucketId = hash.split('/')[2];
        const foundBucket = buckets.find(b => b.id.toString() === bucketId);
        
        if (foundBucket) {
          setSelectedBucket(foundBucket);
          setActiveTab('objectstorage');
        }
      } else if (tabs.some(tab => tab.id === hash)) {
        // Regular tab navigation
        setActiveTab(hash);
        setSelectedBucket(null);
      } else if (hash === '') {
        // Default to volumes if no hash
        setActiveTab('volumes');
        setSelectedBucket(null);
      }
    };
    
    // Set up hash change listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial setup based on current hash
    handleHashChange();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
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
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };
  
  // Storage usage data for charts
  const storageData = [
    { name: 'Volumes', value: 3850 },
    { name: 'Object Storage', value: 1120 },
    { name: 'Backups', value: 2450 },
    { name: 'Snapshots', value: 580 }
  ];
  
  // Chart data for growth chart
  const growthChartData = [
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
  ];
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'volumes':
        return <VolumesTab 
          data={volumes} 
          searchQuery={searchQuery} 
          statusFilter={statusFilter} 
        />;
        
      case 'objectstorage':
        return selectedBucket ? (
          <ObjectStorageExplorer bucket={selectedBucket} />
        ) : (
          <BucketsTab 
            data={buckets} 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            setSelectedBucket={setSelectedBucket} 
          />
        );
        
      case 'backups':
        return <BackupsTab 
          data={backups} 
          searchQuery={searchQuery} 
          statusFilter={statusFilter} 
        />;
        
      case 'snapshots':
        return <SnapshotsTab 
          data={snapshots} 
          searchQuery={searchQuery} 
          statusFilter={statusFilter} 
        />;
        
      default:
        return null;
    }
  };
  
  // Handle bucket selection with URL update using hash
  const handleBucketSelect = (bucket) => {
    setSelectedBucket(bucket);
    // Update URL to include bucket ID in hash
    window.location.hash = `objectstorage/bucket/${bucket.id}`;
  };
  
  // Handle back to buckets with URL update
  const handleBackToBuckets = () => {
    setSelectedBucket(null);
    window.location.hash = 'objectstorage';
  };
  
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
          <div className="lg:col-span-2">
            <StorageGrowthChart 
              data={growthChartData} 
              timeRange={timeRange} 
              setTimeRange={setTimeRange} 
            />
          </div>
          <div>
            <StorageDistributionChart data={storageData} />
          </div>
        </div>
      )}
      
      {/* Tabs for different storage components */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        {!selectedBucket && (
          <div className="border-b border-slate-800">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange(tab.id);
                  }}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-blue-400 border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-6">
          {selectedBucket ? (
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBackToBuckets}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300"
              >
                <ChevronDown className="rotate-90" size={16} />
                <span>Back to Buckets</span>
              </button>
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