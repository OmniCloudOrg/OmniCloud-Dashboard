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
  Filter,
  Server,
  Download,
  Settings,
  ArrowLeft
} from 'lucide-react';

// Import components
import {ResourceCard} from '../components/ui/card-components';
import { StatusIndicator } from '../components/ui/common-components';
import { CreateVolumeModal } from './components/CreateVolumeModal';
import { StorageGrowthChart } from './components/StorageGrowthChart';
import { StorageDistributionChart } from './components/StorageDistributionChart';
import ObjectStorageExplorer from './components/ObjectStorageExplorer';

// Define mock data for storage classes since we don't have an API yet
const mockStorageClasses = [
  { id: 1, name: 'Local Disk', storage_type: 'local-disk', provisioner: 'kubernetes.io/local-disk', allow_volume_expansion: true, volume_binding_mode: 'Immediate' },
  { id: 2, name: 'Local Resilient', storage_type: 'local-resilient', provisioner: 'kubernetes.io/local-resilient', allow_volume_expansion: true, volume_binding_mode: 'Immediate' },
  { id: 3, name: 'Distributed', storage_type: 'distributed', provisioner: 'kubernetes.io/distributed', allow_volume_expansion: true, volume_binding_mode: 'WaitForFirstConsumer' },
  { id: 4, name: 'Geo-Replicated', storage_type: 'geo-replicated', provisioner: 'kubernetes.io/geo-replicated', allow_volume_expansion: false, volume_binding_mode: 'WaitForFirstConsumer' }
];

// Define mock volumes
const mockVolumes = [
  { id: 1, name: 'app-data-1', app_id: 101, size_gb: 100, storage_class_id: 1, node_id: 1, status: 'Bound', access_mode: 'ReadWriteOnce', write_concern: 'WriteAcknowledged', persistence_level: 'Basic' },
  { id: 2, name: 'db-data-1', app_id: 102, size_gb: 200, storage_class_id: 2, node_id: 2, status: 'Mounted', access_mode: 'ReadWriteOnce', write_concern: 'WriteDurable', persistence_level: 'High' },
  { id: 3, name: 'logs-volume', app_id: 101, size_gb: 50, storage_class_id: 3, node_id: 1, status: 'Mounted', access_mode: 'ReadWriteMany', write_concern: 'WriteReplicated', persistence_level: 'Enhanced' },
  { id: 4, name: 'backup-volume', app_id: 103, size_gb: 500, storage_class_id: 4, node_id: 3, status: 'Provisioned', access_mode: 'ReadWriteMany', write_concern: 'WriteDistributed', persistence_level: 'Maximum' },
  { id: 5, name: 'user-data', app_id: 104, size_gb: 300, storage_class_id: 3, node_id: 2, status: 'Bound', access_mode: 'ReadOnlyMany', write_concern: 'WriteReplicated', persistence_level: 'High' },
  { id: 6, name: 'cache-volume', app_id: 105, size_gb: 20, storage_class_id: 1, node_id: 4, status: 'Released', access_mode: 'ReadWriteOnce', write_concern: 'WriteAcknowledged', persistence_level: 'Basic' }
];

const StorageManagement = () => {
  const router = useRouter();
  const pathname = usePathname();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [volumes, setVolumes] = useState(mockVolumes);
  const [storageClasses, setStorageClasses] = useState(mockStorageClasses);
  const [selectedStorageType, setSelectedStorageType] = useState(null);
  const [selectedWriteConcern, setSelectedWriteConcern] = useState(null);
  const [selectedPersistenceLevel, setSelectedPersistenceLevel] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    total_count: mockVolumes.length,
    total_pages: Math.ceil(mockVolumes.length / 10)
  });
  
  // Available write concern types derived from schema
  const writeConcernTypes = ['All', 'WriteAcknowledged', 'WriteDurable', 'WriteReplicated', 'WriteDistributed'];
  
  // Available persistence levels derived from schema
  const persistenceLevels = ['All', 'Basic', 'Enhanced', 'High', 'Maximum'];
  
  // Fetch volumes with filters when they change
  useEffect(() => {
    if (selectedVolume) return; // Skip when viewing a specific volume
    
    // This would be a real API call in production
    // Simulating API filtering behavior
    setIsLoading(true);
    
    // Filter the mock volumes based on selected filters
    let filteredVolumes = [...mockVolumes];
    
    if (selectedStorageType) {
      const classIds = storageClasses
        .filter(cls => cls.storage_type === selectedStorageType)
        .map(cls => cls.id);
      
      filteredVolumes = filteredVolumes.filter(vol => classIds.includes(vol.storage_class_id));
    }
    
    if (selectedWriteConcern && selectedWriteConcern !== 'All') {
      filteredVolumes = filteredVolumes.filter(vol => vol.write_concern === selectedWriteConcern);
    }
    
    if (selectedPersistenceLevel && selectedPersistenceLevel !== 'All') {
      filteredVolumes = filteredVolumes.filter(vol => vol.persistence_level === selectedPersistenceLevel);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredVolumes = filteredVolumes.filter(vol => 
        vol.name.toLowerCase().includes(query)
      );
    }
    
    // Handle pagination
    const startIndex = pagination.page * pagination.per_page;
    const endIndex = startIndex + pagination.per_page;
    const paginatedVolumes = filteredVolumes.slice(startIndex, endIndex);
    
    setVolumes(paginatedVolumes);
    setPagination(prev => ({
      ...prev,
      total_count: filteredVolumes.length,
      total_pages: Math.ceil(filteredVolumes.length / pagination.per_page)
    }));
    
    setIsLoading(false);
  }, [selectedStorageType, selectedWriteConcern, selectedPersistenceLevel, 
      searchQuery, pagination.page, pagination.per_page, storageClasses, selectedVolume]);
  
  // Handle storage type selection
  const handleStorageTypeSelect = (type) => {
    setSelectedStorageType(type === selectedStorageType ? null : type);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset pagination when filter changes
    setSelectedVolume(null); // Clear selected volume when changing filters
  };
  
  // Handle write concern selection
  const handleWriteConcernSelect = (writeConcern) => {
    const value = writeConcern === 'All' ? null : writeConcern;
    setSelectedWriteConcern(value === selectedWriteConcern ? null : value);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset pagination when filter changes
    setSelectedVolume(null); // Clear selected volume when changing filters
  };
  
  // Handle persistence level selection
  const handlePersistenceLevelSelect = (level) => {
    const value = level === 'All' ? null : level;
    setSelectedPersistenceLevel(value === selectedPersistenceLevel ? null : value);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset pagination when filter changes
    setSelectedVolume(null); // Clear selected volume when changing filters
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedStorageType(null);
    setSelectedWriteConcern(null);
    setSelectedPersistenceLevel(null);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 0 })); // Reset pagination when filters clear
    setSelectedVolume(null); // Clear selected volume when clearing filters
  };
  
  // Handle volume selection for file explorer
  const handleVolumeSelect = (volume) => {
    setSelectedVolume(volume);
  };
  
  // Handle return from file explorer view
  const handleBackToVolumes = () => {
    setSelectedVolume(null);
  };
  
  // Format storage size
  const formatStorage = (sizeGB) => {
    if (sizeGB >= 1024) {
      return `${(sizeGB / 1024).toFixed(2)} TB`;
    }
    return `${sizeGB.toFixed(2)} GB`;
  };
  
  // Calculate total storage size
  const totalStorageSize = mockVolumes.reduce((sum, vol) => sum + vol.size_gb, 0);
  
  // Prepare data for storage distribution chart
  const getStorageDistributionData = () => {
    const storageTypeMap = new Map();
    
    mockVolumes.forEach(volume => {
      const storageClass = storageClasses.find(cls => cls.id === volume.storage_class_id);
      const type = storageClass ? storageClass.storage_type : 'unknown';
      
      if (!storageTypeMap.has(type)) {
        storageTypeMap.set(type, 0);
      }
      
      storageTypeMap.set(type, storageTypeMap.get(type) + volume.size_gb);
    });
    
    return Array.from(storageTypeMap.entries()).map(([name, value]) => ({ name, value }));
  };
  
  // Mock data for growth chart
  const growthChartData = [
    { date: '01/25', size: 3200 },
    { date: '01/26', size: 3250 },
    { date: '01/27', size: 3300 },
    { date: '01/28', size: 3350 },
    { date: '01/29', size: 3400 },
    { date: '01/30', size: 3450 },
    { date: '01/31', size: 3500 },
    { date: '02/01', size: 3550 },
    { date: '02/02', size: 3600 },
    { date: '02/03', size: 3650 },
    { date: '02/04', size: 3700 },
    { date: '02/05', size: 3750 },
    { date: '02/06', size: 3800 },
    { date: '02/07', size: 3850 }
  ];
  
  // Get class name by ID
  const getClassName = (classId) => {
    const cls = storageClasses.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  // Convert volume to bucket format for ObjectStorageExplorer
  const volumeToBucket = (volume) => {
    return {
      id: volume.id,
      name: volume.name,
      region: getClassName(volume.storage_class_id),
      objects: Math.floor(Math.random() * 1000), // Mock data
      size: `${volume.size_gb} GB`,
      access: volume.access_mode,
      created: '2 months ago' // Mock data
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Storage Management</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsVolumeModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Create Volume</span>
          </button>
        </div>
      </div>
      
      {!selectedVolume && (
        <>
          {/* Resource Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard 
              title="Total Storage" 
              value={formatStorage(totalStorageSize)} 
              percentage="12" 
              trend="up" 
              icon={Database} 
              color="bg-blue-500/10 text-blue-400" 
            />
            <ResourceCard 
              title="Volume Count" 
              value={pagination.total_count.toString()} 
              icon={HardDrive} 
              color="bg-green-500/10 text-green-400" 
              subtitle="Active volumes"
            />
            <ResourceCard 
              title="Storage Classes" 
              value={storageClasses.length.toString()} 
              icon={Save} 
              color="bg-purple-500/10 text-purple-400" 
              subtitle="Available classes"
            />
            <ResourceCard 
              title="Persistence Levels" 
              value={(persistenceLevels.length - 1).toString()} // Subtract "All" option
              icon={Archive} 
              color="bg-amber-500/10 text-amber-400" 
              subtitle="Available levels"
            />
          </div>
          
          {/* Storage usage charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StorageGrowthChart 
                data={growthChartData} 
                timeRange={timeRange} 
                setTimeRange={setTimeRange} 
              />
            </div>
            <div>
              <StorageDistributionChart data={getStorageDistributionData()} />
            </div>
          </div>
        </>
      )}
      
      {/* Main content - either volume listing or file explorer */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        {selectedVolume ? (
          <>
            {/* Back button when viewing a volume */}
            <div className="px-6 py-4 border-b border-slate-800">
              <button 
                onClick={handleBackToVolumes}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <ArrowLeft size={16} />
                <span>Back to Volumes</span>
              </button>
            </div>
            
            {/* File explorer for selected volume */}
            <ObjectStorageExplorer bucket={volumeToBucket(selectedVolume)} demoMode={true} />
          </>
        ) : (
          <div className="p-6">
            {/* Storage type filter pills */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Filter size={18} className="mr-2 text-slate-400" />
                <h3 className="text-white font-medium">Storage Types</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['local-disk', 'local-resilient', 'distributed', 'geo-replicated'].map(type => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedStorageType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    onClick={() => handleStorageTypeSelect(type)}
                  >
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search volumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-3 self-end">
                {/* Persistence Level filter */}
                <select
                  value={selectedPersistenceLevel || 'All'}
                  onChange={(e) => handlePersistenceLevelSelect(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {persistenceLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                
                {/* Clear filters button */}
                {(selectedStorageType || selectedWriteConcern || selectedPersistenceLevel || searchQuery) && (
                  <button 
                    onClick={handleClearFilters}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Write concern tabs */}
            <div className="border-b border-slate-800 mb-6">
              <div className="flex overflow-x-auto">
                {writeConcernTypes.map((writeConcern) => (
                  <button
                    key={writeConcern}
                    onClick={() => handleWriteConcernSelect(writeConcern)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      (writeConcern === 'All' && !selectedWriteConcern) || selectedWriteConcern === writeConcern
                        ? 'text-blue-400 border-b-2 border-blue-500' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {writeConcern === 'WriteAcknowledged' ? 'Acknowledged' :
                     writeConcern === 'WriteDurable' ? 'Durable' :
                     writeConcern === 'WriteReplicated' ? 'Replicated' :
                     writeConcern === 'WriteDistributed' ? 'Distributed' :
                     writeConcern}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Volumes table */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error: {error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : volumes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Server className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <h3 className="text-xl font-medium mb-2">No volumes found</h3>
                <p className="mb-6">No storage volumes match your current filters</p>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-slate-400 text-xs uppercase">
                    <tr className="border-b border-slate-800">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">App</th>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-left">Storage Class</th>
                      <th className="px-4 py-3 text-left">Write Concern</th>
                      <th className="px-4 py-3 text-left">Persistence</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volumes.map((volume) => (
                      <tr key={volume.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <HardDrive size={16} className="text-slate-400" />
                            <div>
                              <button
                                className="font-medium text-blue-400 hover:text-blue-300 block"
                                onClick={() => handleVolumeSelect(volume)}
                              >
                                {volume.name}
                              </button>
                              <div className="text-xs text-slate-500">ID: {volume.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{volume.app_id}</td>
                        <td className="px-4 py-3 text-slate-300">{volume.size_gb} GB</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                            {getClassName(volume.storage_class_id)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                            {volume.write_concern === 'WriteAcknowledged' ? 'Acknowledged' :
                             volume.write_concern === 'WriteDurable' ? 'Durable' :
                             volume.write_concern === 'WriteReplicated' ? 'Replicated' :
                             volume.write_concern === 'WriteDistributed' ? 'Distributed' :
                             volume.write_concern}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
                            {volume.persistence_level}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusIndicator status={volume.status.toLowerCase()} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 text-slate-400 hover:text-white"
                              onClick={() => handleVolumeSelect(volume)}
                            >
                              <Folder size={16} title="Browse files" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-white">
                              <Settings size={16} title="Settings" />
                            </button>
                            {volume.status === 'Provisioned' || volume.status === 'Released' ? (
                              <button className="p-1 text-slate-400 hover:text-white">
                                <Download size={16} title="Download" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-slate-400">
                    Showing {Math.min(pagination.per_page, volumes.length)} of {pagination.total_count} volumes
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                      disabled={pagination.page === 0}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pagination.page === 0 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-400">
                      Page {pagination.page + 1} of {Math.max(1, pagination.total_pages)}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages - 1, prev.page + 1) }))}
                      disabled={pagination.page >= pagination.total_pages - 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pagination.page >= pagination.total_pages - 1
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create Volume Modal */}
      <CreateVolumeModal 
        isOpen={isVolumeModalOpen} 
        onClose={() => setIsVolumeModalOpen(false)} 
        storageClasses={storageClasses}
        apiBaseUrl={apiBaseUrl}
      />
    </div>
  );
};

export default StorageManagement;