"use client"

import React from 'react';
import { Server } from 'lucide-react';
import { StatusBadge } from '../../components/ui/status-components';
import { EmptyState } from '../../components/ui/common-components';

const EnvironmentsGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((env) => (
        <div key={env.id} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Server size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{env.name}</h3>
                <div className="text-sm text-slate-400 mt-0.5">{env.version}</div>
              </div>
            </div>
            <StatusBadge status={env.status} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-slate-800">
            <div>
              <div className="text-sm text-slate-500">Applications</div>
              <div className="font-semibold text-lg text-white">{env.applications}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Last Deployed</div>
              <div className="font-semibold text-lg text-white">{env.lastDeployed}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button className="text-slate-400 hover:text-slate-300 text-sm">
              View Details
            </button>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              Deploy
            </button>
          </div>
        </div>
      ))}
      
      {data.length === 0 && (
        <div className="col-span-2">
          <EmptyState
            icon={Server}
            title="No Environments Found"
            description="We couldn't find any environments matching your search criteria."
            actionText="Clear Filters"
            onAction={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export { EnvironmentsGrid };