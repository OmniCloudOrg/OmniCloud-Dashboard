"use client"

import React from 'react';
import { Rocket, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const BuildStatus = () => {
  // Sample data - in a real app this would be fetched
  const builds = [
    { name: 'frontend', version: 'v1.2.3', status: 'running', progress: 75, provider: 'GitHub', updated: '2 min ago' },
    { name: 'api-service', version: 'v2.0.1', status: 'success', progress: 100, provider: 'GitLab', updated: '15 min ago' },
    { name: 'auth-service', version: 'v1.5.0', status: 'failed', progress: 100, provider: 'GitHub', updated: '45 min ago' },
    { name: 'user-service', version: 'v1.1.2', status: 'queued', progress: 0, provider: 'Bitbucket', updated: '1 hr ago' }
  ];
  
return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Recent Builds</h3>
            <a href="/dash/apps" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
            </a>
        </div>
        <div className="divide-y divide-slate-800">
            {builds.map((build, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-800 rounded-lg p-2">
                            <Rocket size={20} className="text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-white truncate">{build.name}</div>
                                <StatusBadge status={build.status} />
                            </div>
                            <div className="text-sm text-slate-400 mt-1">{build.version} • {build.provider}</div>
                            {build.status === 'running' && (
                                <div className="mt-2">
                                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${build.progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                            <div className="text-xs text-slate-500 mt-2">Updated {build.updated}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};
