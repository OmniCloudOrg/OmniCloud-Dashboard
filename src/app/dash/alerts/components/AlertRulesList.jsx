"use client"

import React, { useState, useEffect } from 'react';
import { SeverityBadge } from '../../../../components/ui';

export const AlertRulesList = ({ apiBaseUrl, onCreateRule }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // This would fetch from an API in a real implementation
  useEffect(() => {
    // Simulate API call
    const fetchRules = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would be:
        // const response = await fetch(`${apiBaseUrl}/alert-rules`);
        // const data = await response.json();
        // setRules(data.rules);
        
        // For now, use sample data
        const sampleRules = [
          { id: 1, name: 'High CPU Usage', condition: 'CPU > 90% for 5m', target: 'All Servers', severity: 'critical', status: 'active' },
          { id: 2, name: 'High Memory Usage', condition: 'Memory > 85% for 5m', target: 'All Servers', severity: 'warning', status: 'active' },
          { id: 3, name: 'Low Disk Space', condition: 'Disk Space < 15% for 10m', target: 'All Servers', severity: 'warning', status: 'active' },
          { id: 4, name: 'High API Error Rate', condition: 'Error Rate > 5% for 3m', target: 'API Gateway', severity: 'warning', status: 'active' },
          { id: 5, name: 'Database Connection Issues', condition: 'Connection Pool > 95% for 2m', target: 'Database Servers', severity: 'critical', status: 'active' }
        ];
        
        setRules(sampleRules);
      } catch (error) {
        console.error('Error fetching alert rules:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRules();
  }, [apiBaseUrl]);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Alert Rules</h3>
        <button 
          onClick={onCreateRule} 
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Add Rule
        </button>
      </div>
      <div className="divide-y divide-slate-800">
        {loading ? (
          <div className="p-4 text-center text-slate-400">Loading rules...</div>
        ) : (
          rules.slice(0, 4).map((rule) => (
            <div key={rule.id} className="p-4 hover:bg-slate-800/30">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-white">{rule.name}</div>
                <SeverityBadge severity={rule.severity} />
              </div>
              <div className="text-xs font-mono bg-slate-800 rounded p-1.5 mb-2 text-slate-400">
                {rule.condition}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Target: {rule.target}</span>
                <div className="flex items-center">
                  <span className="text-green-400 mr-1">●</span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-slate-800">
        <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
          View All Rules
        </button>
      </div>
    </div>
  );
};