/**
 * Common Filter Hooks
 * Reusable hooks for common filtering patterns
 */

import { useState, useMemo } from 'react';

/**
 * Generic search and filter hook
 */
export const useSearchAndFilter = (data, searchFields = [], initialFilters = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // Generic filter function
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });

      // Custom filters
      const matchesFilters = Object.entries(filters).every(([filterKey, filterValue]) => {
        if (filterValue === 'all' || filterValue === '' || filterValue === null) return true;
        
        if (Array.isArray(filterValue)) {
          return filterValue.length === 0 || filterValue.includes(item[filterKey]);
        }
        
        return item[filterKey] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchQuery, searchFields, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters(initialFilters);
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    filteredData
  };
};

/**
 * Pagination hook
 */
export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / perPage);
  const startIndex = currentPage * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const validPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    perPage,
    setPerPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages - 1,
    hasPrev: currentPage > 0
  };
};

/**
 * View state management hook
 */
export const useViewState = (initialView = 'grid') => {
  const [view, setView] = useState(initialView);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return {
    view,
    setView,
    isModalOpen,
    selectedItem,
    openModal,
    closeModal
  };
};
