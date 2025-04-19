"use client"

import React from 'react';

export const RunningServices = () => {
    const [services, setServices] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const itemsPerPage = 5;

    React.useEffect(() => {
        const fetchServices = async () => {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
            try {
                const response = await fetch(`${apiBaseUrl}/apps?page=${currentPage}&per_page=${itemsPerPage}`);
                const data = await response.json();
                const transformedData = data.map(service => ({
                    name: service.name,
                    status: 'unknown',
                    instances: service.instance_count,
                    cpu: null,
                    memory: null,
                    provider: 'unknown'
                }));
                setServices(transformedData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
    
        fetchServices();
    }, [currentPage]);
    

    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

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
            <div className="px-6 py-4 flex justify-between items-center border-t border-slate-800">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className={`text-sm font-medium px-4 py-2 rounded ${
                        currentPage === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                >
                    Previous
                </button>
                <span className="text-sm text-slate-400">Page {currentPage + 1}</span>
                <button
                    onClick={handleNextPage}
                    className="text-sm font-medium px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
