/**
 * Severity Distribution Component
 * Shows severity counts and distribution visualization
 */

import React from 'react';
import { DashboardSection } from '../../components/ui';

const SeverityDistribution = ({ severityCounts, totalCount }) => {
  const total = totalCount || (severityCounts.high + severityCounts.medium + severityCounts.low);
  
  const getPercentage = (count) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  return (
    <DashboardSection title="Severity Distribution">
      <div className="flex items-center">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <div className="w-1/3 text-center">
              <div className="text-3xl font-bold text-red-400">{severityCounts.high}</div>
              <div className="text-sm text-slate-400 mt-1">High</div>
            </div>
            <div className="w-1/3 text-center">
              <div className="text-3xl font-bold text-yellow-400">{severityCounts.medium}</div>
              <div className="text-sm text-slate-400 mt-1">Medium</div>
            </div>
            <div className="w-1/3 text-center">
              <div className="text-3xl font-bold text-blue-400">{severityCounts.low}</div>
              <div className="text-sm text-slate-400 mt-1">Low</div>
            </div>
          </div>
          
          <div className="w-full flex h-4 rounded-full overflow-hidden">
            <div 
              className="bg-red-500" 
              style={{ width: `${getPercentage(severityCounts.high)}%` }}
            ></div>
            <div 
              className="bg-yellow-500" 
              style={{ width: `${getPercentage(severityCounts.medium)}%` }}
            ></div>
            <div 
              className="bg-blue-500" 
              style={{ width: `${getPercentage(severityCounts.low)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
};

export default SeverityDistribution;
