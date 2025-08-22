import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/dash/components/ui';
import { APP_PAGINATION_DEFAULTS } from '@/data/appConstants';

const ApplicationPagination = ({
  currentPage,
  totalPages,
  totalCount,
  perPage,
  onPageChange,
  onPerPageChange
}) => {
  const startItem = currentPage * perPage + 1;
  const endItem = Math.min((currentPage + 1) * perPage, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Items info */}
      <div className="text-sm text-slate-400">
        {totalCount > 0 ? (
          `Showing ${startItem} to ${endItem} of ${totalCount} applications`
        ) : (
          'No applications found'
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Show:</span>
          <select 
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            {APP_PAGINATION_DEFAULTS.pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="px-3 py-1 text-sm text-white">
            Page {currentPage + 1} of {totalPages || 1}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPagination;
