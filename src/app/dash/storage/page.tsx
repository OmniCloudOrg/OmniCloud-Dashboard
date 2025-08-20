"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Database, 
  HardDrive, 
  Save, 
  Archive, 
  RefreshCw, 
  Plus, 
  Search, 
  Folder,
  Filter,
  Server,
  Download,
  Settings,
  ArrowLeft
} from 'lucide-react';

// Import components
import { StatusIndicator, ConsolidatedResourceCard } from '../../../components/ui';
import { CreateVolumeModal } from './components/CreateVolumeModal';
import ObjectStorageExplorer from './components/ObjectStorageExplorer';

// Import API client
import { 
  StorageApiClient, 
  StorageClass, 
  StorageVolume, 
  PaginationParams,
  StorageVolumeFilter
} from '@/utils/apiClient/storage';

// Import platform context
import { usePlatform } from '@/components/context/PlatformContext';

// Import mock data
import { 
  WRITE_CONCERN_TYPES, 
  PERSISTENCE_LEVELS,
  STORAGE_VOLUME_TYPES,
  STORAGE_CLASSES,
  MOCK_STORAGE_VOLUMES,
  STORAGE_STATISTICS
} from '@/data';

const StorageManagement = () => {
  const router = useRouter();
  
  // Get platform context
  const platform: any = usePlatform();
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [volumes, setVolumes] = useState<StorageVolume[]>([]);
  const [storageClasses, setStorageClasses] = useState<StorageClass[]>([]);
  const [selectedStorageType, setSelectedStorageType] = useState<string | null>(null);
  const [selectedWriteConcern, setSelectedWriteConcern] = useState<string | null>(null);
  const [selectedPersistenceLevel, setSelectedPersistenceLevel] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<StorageVolume | null>(null);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [timeRange] = useState('30');
  const [storageStats, setStorageStats] = useState({
    totalStorage: 0,
    volumeCount: 0
  });
  type PaginationState = {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
    requestedPage?: number;
  };

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    per_page: 10,
    total_count: 0,
    total_pages: 0
  });
  
  // Available write concern types
  const writeConcernTypes = WRITE_CONCERN_TYPES;
  
  // Available persistence levels
  const persistenceLevels = PERSISTENCE_LEVELS;

  // Early returns for platform issues
  if (platform === null || platform === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading platform context...</span>
      </div>
    );
  }

  const platformId = platform?.selectedPlatformId;
  console.log("Selected platform metadata:", platform);

  if (platformId === null || platformId === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md text-center">
          <div className="text-blue-700 font-medium mb-2">No Platform Selected</div>
          <div className="text-blue-600 text-sm">
            Please select a platform from the platform selector to view storage.
          </div>
        </div>
      </div>
    );
  }

  // Initialize API client with useMemo to prevent recreation and handle platform changes
  const apiClient = useMemo(() => {
    return new StorageApiClient(platformId);
  }, [platformId]);

  // Handle API client initialization errors
  if (!apiClient) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
          <div className="text-red-700 font-medium mb-2">API Client Error</div>
          <div className="text-red-600 text-sm">
            Failed to initialize storage API client for platform {platformId}
          </div>
        </div>
      </div>
    );
  }
  
  // Fetch storage classes
  useEffect(() => {
    if (!apiClient) return;

    const fetchStorageClasses = async () => {
      try {
        const classes = await apiClient.listStorageClasses();
        setStorageClasses(classes);
      } catch (err) {
        console.error("Error fetching storage classes:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchStorageClasses();
  }, [apiClient]);

  // Fetch storage statistics
  useEffect(() => {
    if (!apiClient) return;

    const fetchStorageStats = async () => {
      try {
        const stats = await apiClient.getStorageStats();
        setStorageStats(stats);
      } catch (err) {
        console.error("Error fetching storage stats:", err);
        // Don't set error here to avoid blocking the UI if only stats fail
      }
    };

    fetchStorageStats();
  }, [apiClient]);

  // Generate mock growth data since there's no growth endpoint
  // In a real app, you would implement this endpoint on your API
  useEffect(() => {
    // No-op: growthChartData is unused
  }, [timeRange]);

  // Fetch storage distribution data
  useEffect(() => {
    // No-op: distributionData is unused
  }, [apiClient]);

  // Handle page change for server-side pagination
  const handlePageChange = (newPage: number) => {
    const requestedPage = Math.max(0, Math.min(newPage, pagination.total_pages - 1));
    const tempPagination = { ...pagination, requestedPage };
    setPagination(tempPagination);
  };
  
  // Fetch volumes with filters - optimized for pagination to prevent UI flashing
  useEffect(() => {
    if (selectedVolume || !apiClient) return;
    const fetchVolumes = async () => {
      if (volumes.length === 0) {
        setIsLoading(true);
      }
      const isPaginationRequest = pagination.hasOwnProperty('requestedPage');
      const pageToFetch = isPaginationRequest ? (pagination.requestedPage ?? pagination.page) : pagination.page;
      setError(null);
      try {
        const paginationParams: PaginationParams = {
          page: pageToFetch,
          per_page: pagination.per_page
        };
        let volumesResponse;
        if (selectedWriteConcern && selectedWriteConcern !== 'All') {
          volumesResponse = await apiClient.getVolumesByWriteConcern(
            selectedWriteConcern,
            paginationParams
          );
        } 
        else if (selectedPersistenceLevel && selectedPersistenceLevel !== 'All') {
          volumesResponse = await apiClient.getVolumesByPersistenceLevel(
            selectedPersistenceLevel,
            paginationParams
          );
        }
        else {
          const filter: StorageVolumeFilter = {};
          if (selectedStorageType) {
            const storageClass = storageClasses.find(cls => cls.storage_type === selectedStorageType);
            if (storageClass) {
              filter.storage_class_id = storageClass.id;
            }
          }
          if (searchQuery) {
            filter.search = searchQuery;
          }
          volumesResponse = await apiClient.listStorageVolumes(filter, paginationParams);
        }
        const newPagination = {
          page: isPaginationRequest ? (pagination.requestedPage ?? 0) : pagination.page,
          per_page: pagination.per_page,
          total_count: volumesResponse.pagination.total_count,
          total_pages: volumesResponse.pagination.total_pages
        };
        setVolumes(volumesResponse.data);
        setPagination(newPagination);
      } catch (err) {
        console.error("Error fetching volumes:", err);
        setError(err instanceof Error ? err.message : String(err));
        if (isPaginationRequest) {
          const resetPagination = { ...pagination };
          delete resetPagination.requestedPage;
          setPagination(resetPagination);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchVolumes();
  }, [
    apiClient,
    selectedStorageType,
    selectedWriteConcern,
    selectedPersistenceLevel,
    searchQuery,
    storageClasses,
    JSON.stringify({
      page: pagination.page,
      requestedPage: pagination.requestedPage,
      per_page: pagination.per_page
    }),
    selectedVolume
  ]);
  
  // Fetch individual volume details when a volume is selected
  useEffect(() => {
    if (!selectedVolume || !apiClient) return;
    const fetchVolumeDetails = async () => {
      setIsLoading(true);
      try {
        const volumeDetails = await apiClient.getVolumeById(selectedVolume.id);
        if (volumeDetails) {
          setSelectedVolume({
            ...volumeDetails,
            detailed: true
          });
        } else {
          setSelectedVolume({
            ...selectedVolume,
            detailed: true
          });
        }
      } catch (err) {
        console.error("Error fetching volume details:", err);
        setError(err instanceof Error ? err.message : String(err));
        setSelectedVolume({
          ...selectedVolume,
          detailed: true
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (!selectedVolume.detailed) {
      fetchVolumeDetails();
    }
  }, [apiClient, selectedVolume]);
  
  // Handle storage type selection with improved selection logic
  const handleStorageTypeSelect = (type: React.SetStateAction<string | null>) => {
    if (type === selectedStorageType) {
      setSelectedStorageType(null);
    } else {
      setSelectedStorageType(type);
    }
    setPagination(prev => ({ ...prev, page: 0 }));
    setSelectedVolume(null);
  };
  
  // Handle write concern selection
  const handleWriteConcernSelect = (writeConcern: string) => {
    const value = writeConcern === 'All' ? null : writeConcern;
    setSelectedWriteConcern(value === selectedWriteConcern ? null : value);
    setPagination(prev => ({ ...prev, page: 0 }));
    setSelectedVolume(null);
  };
  
  // Handle persistence level selection
  const handlePersistenceLevelSelect = (level: string) => {
    const value = level === 'All' ? null : level;
    setSelectedPersistenceLevel(value === selectedPersistenceLevel ? null : value);
    setPagination(prev => ({ ...prev, page: 0 }));
    setSelectedVolume(null);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedStorageType(null);
    setSelectedWriteConcern(null);
    setSelectedPersistenceLevel(null);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 0 }));
    setSelectedVolume(null);
  };
  
  // Handle volume selection for file explorer
  const handleVolumeSelect = (volume: StorageVolume) => {
    setSelectedVolume({ ...volume, detailed: false });
  };
  
  // Handle return from file explorer view
  const handleBackToVolumes = () => {
    setSelectedVolume(null);
  };
  
  // Format storage size
  const formatStorage = (sizeGB: number) => {
    if (sizeGB >= 1024) {
      return `${(sizeGB / 1024).toFixed(2)} TB`;
    }
    return `${sizeGB.toFixed(2)} GB`;
  };
  
  // Convert volume to bucket format for ObjectStorageExplorer
  const volumeToBucket = (volume: StorageVolume) => {
    return {
      id: volume.id,
      name: volume.name,
      region: volume.storage_class || 'Unknown',
      objects: volume.object_count || 0,
      size: `${volume.size_gb} GB`,
      access: volume.access_mode,
      created: volume.created_at || 'Unknown'
    };
  };
  
  // Function to refresh all data
  const refreshData = () => {
    setIsLoading(true);
    setPagination(prev => ({ ...prev, page: 0 }));
    setSelectedVolume(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Storage Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Platform: {platformId}
          </div>
          <button 
            onClick={refreshData}
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
            <ConsolidatedResourceCard 
              title="Total Storage" 
              value={formatStorage(storageStats.totalStorage)} 
              percentage={null}
              subtitle={null}
              trend="up" 
              icon={Database} 
              color="bg-blue-500/10 text-blue-400"
              onClick={() => {}} 
            />
            <ConsolidatedResourceCard 
              title="Volume Count" 
              value={storageStats.volumeCount.toString()} 
              percentage={null}
              subtitle={null}
              icon={HardDrive} 
              color="bg-green-500/10 text-green-400" 
              trend="up"
              onClick={() => {}}
            />
            <ConsolidatedResourceCard 
              title="Storage Classes" 
              value={storageClasses.length.toString()} 
              percentage={null}
              subtitle={null}
              icon={Save} 
              color="bg-purple-500/10 text-purple-400" 
              trend="up"
              onClick={() => {}}
            />
            <ConsolidatedResourceCard 
              title="Persistence Levels" 
              value={(persistenceLevels.length - 1).toString()} // Subtract "All" option
              percentage={null}
              subtitle={null}
              icon={Archive} 
              color="bg-amber-500/10 text-amber-400" 
              trend="up"
              onClick={() => {}}
            />
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
            
            {/* Loading state for selected volume details */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              /* File explorer for selected volume */
              <ObjectStorageExplorer 
                bucket={volumeToBucket(selectedVolume)} 
              />
            )}
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
                {/* Filter buttons for storage types */}
                {['standard', 'fast-local-ssd', 'local-disk', 'distributed', 
                   'performance-small', 'performance-medium', 'performance-large',
                   'geo-replicated', 'local-ssd', 'archive'].map(type => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedStorageType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    onClick={() => handleStorageTypeSelect(type)}
                    aria-pressed={selectedStorageType === type}
                  >
                    {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                  onClick={refreshData}
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
                            {volume.storage_class || 'Unknown'}
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
                              <Folder size={16} />
                            </button>
                            <button 
                              className="p-1 text-slate-400 hover:text-white"
                              onClick={() => router.push(`/storage/volumes/${volume.id}/settings`)}
                            >
                              <Settings size={16} />
                            </button>
                            {['provisioned', 'released'].includes(volume.status.toLowerCase()) && (
                              <button 
                                className="p-1 text-slate-400 hover:text-white"
                                onClick={() => router.push(`/storage/volumes/${volume.id}/download`)}
                              >
                                <Download size={16} />
                              </button>
                            )}
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
                      onClick={() => handlePageChange(pagination.page - 1)}
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
                      onClick={() => handlePageChange(pagination.page + 1)}
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
      {apiClient && (
        <CreateVolumeModal 
          isOpen={isVolumeModalOpen} 
          onClose={() => setIsVolumeModalOpen(false)} 
          storageClasses={storageClasses}
          apiClient={apiClient}
          onVolumeCreated={refreshData}
        />
      )}
    </div>
  );
};

export default StorageManagement;