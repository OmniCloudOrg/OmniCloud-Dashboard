import { useState, useCallback, useMemo } from 'react';

/**
 * useDashboardState Hook
 * Consolidates repeated state patterns across 10+ dashboard pages
 * 
 * Common patterns found in:
 * - alerts/page.jsx
 * - provider-overview/page.jsx 
 * - marketplace/page.jsx
 * - security/page.jsx
 * - monitoring/page.jsx
 * - members/page.jsx
 * - logs/page.jsx
 * - and more...
 */

export const useDashboardState = ({
  initialTab = 'overview',
  initialPageSize = 12,
  initialFilters = {}
} = {}) => {
  // Core state management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  
  // Additional filters from initialFilters
  const [customFilters, setCustomFilters] = useState(initialFilters);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // UI state
  const [viewMode, setViewMode] = useState('grid'); // grid, table, list
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Computed values
  const totalPages = useMemo(() => 
    Math.ceil(totalCount / pageSize), 
    [totalCount, pageSize]
  );

  const hasFilters = useMemo(() => 
    searchQuery || 
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    severityFilter !== 'all' ||
    regionFilter !== 'all' ||
    Object.values(customFilters).some(value => value && value !== 'all'),
    [searchQuery, statusFilter, categoryFilter, typeFilter, severityFilter, regionFilter, customFilters]
  );

  const isFiltered = hasFilters;

  // Action handlers
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page on search
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(0); // Reset pagination on tab change
    setSelectedItem(null); // Clear selection
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'category':
        setCategoryFilter(value);
        break;
      case 'type':
        setTypeFilter(value);
        break;
      case 'severity':
        setSeverityFilter(value);
        break;
      case 'region':
        setRegionFilter(value);
        break;
      default:
        setCustomFilters(prev => ({ ...prev, [filterType]: value }));
    }
    setPage(0); // Reset pagination on filter change
  }, []);

  const handleSortChange = useCallback((field, order = null) => {
    setSortBy(field);
    setSortOrder(order || (sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'));
  }, [sortBy, sortOrder]);

  const handleSelectionChange = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleMultiSelectionChange = useCallback((items) => {
    setSelectedItems(items);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setTypeFilter('all');
    setSeverityFilter('all');
    setRegionFilter('all');
    setCustomFilters(initialFilters);
    setPage(0);
  }, [initialFilters]);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setSelectedItems([]);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    // The actual refresh logic should be handled by the consuming component
    // This just manages the UI state
  }, []);

  // Loading states management
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => {
    setLoading(false);
    setRefreshing(false);
  }, []);

  const setErrorMessage = useCallback((message) => {
    setError(message);
    setLoading(false);
    setRefreshing(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Filter helpers for data processing
  const getFilterParams = useCallback(() => ({
    search: searchQuery,
    status: statusFilter,
    category: categoryFilter,
    type: typeFilter,
    severity: severityFilter,
    region: regionFilter,
    page,
    pageSize,
    sortBy,
    sortOrder,
    ...customFilters
  }), [
    searchQuery, statusFilter, categoryFilter, typeFilter, 
    severityFilter, regionFilter, page, pageSize, 
    sortBy, sortOrder, customFilters
  ]);

  return {
    // Core state
    activeTab,
    searchQuery,
    loading,
    error,
    refreshing,

    // Filter state
    statusFilter,
    categoryFilter,
    typeFilter,
    severityFilter,
    regionFilter,
    customFilters,

    // Pagination state
    page,
    pageSize,
    totalCount,
    totalPages,

    // Selection state
    selectedItems,
    selectedItem,

    // UI state
    viewMode,
    sortBy,
    sortOrder,

    // Computed state
    hasFilters,
    isFiltered,

    // Handlers
    setActiveTab,
    handleTabChange,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleSelectionChange,
    handleMultiSelectionChange,

    // Utility actions
    clearFilters,
    clearSelection,
    refresh,
    startLoading,
    stopLoading,
    setErrorMessage,
    clearError,
    setTotalCount,
    setViewMode,

    // Helpers
    getFilterParams
  };
};

export default useDashboardState;
