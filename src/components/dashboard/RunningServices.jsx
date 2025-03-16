"use client"

import React from 'react';

export const RunningServices = () => {
  // Sample data - in a real app this would be fetched
  const services = [
    { name: 'API Gateway', status: 'healthy', instances: 3, cpu: 42, memory: 65, provider: 'AWS' },
    { name: 'Auth Service', status: 'healthy', instances: 2, cpu: 28, memory: 54, provider: 'AWS' },
    { name: 'User Service', status: 'warning', instances: 4, cpu: 78, memory: 82, provider: 'GCP' },
    { name: 'Payment Service', status: 'healthy', instances: 2, cpu: 35, memory: 48, provider: 'Azure' },
    { name: 'Notification Service', status: 'critical', instances: 1, cpu: 92, memory: 87, provider: 'On-Prem' }
  ];
  
return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Running Services</h3>
            <a href="/dash/apps" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
            </a>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-800/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instances</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Memory</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {services.map((service, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{service.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`flex items-center gap-2 ${
                                    service.status === 'healthy' ? 'text-green-400' :
                                    service.status === 'warning' ? 'text-yellow-400' :
                                    'text-red-400'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        service.status === 'healthy' ? 'bg-green-400' :
                                        service.status === 'warning' ? 'bg-yellow-400' :
                                        'bg-red-400'
                                    }`}></div>
                                    <div className="text-sm capitalize">{service.status}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{service.instances}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div 
                                        className={`h-full rounded-full ${
                                            service.cpu < 50 ? 'bg-green-500' :
                                            service.cpu < 80 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        style={{ width: `${service.cpu}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">{service.cpu}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div 
                                        className={`h-full rounded-full ${
                                            service.memory < 50 ? 'bg-green-500' :
                                            service.memory < 80 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                        style={{ width: `${service.memory}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">{service.memory}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-300">{service.provider}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};
