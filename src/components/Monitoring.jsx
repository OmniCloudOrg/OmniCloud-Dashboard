"use client"
import React, { useState, useMemo } from 'react';
import { 
  Server, Cpu, Globe2, Activity, MemoryStick, HardDrive, Network, Database
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonitoringPanel = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const mockData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.floor(Math.random() * 40 + 30),
    memory: Math.floor(Math.random() * 30 + 40),
    network: Math.floor(Math.random() * 1000 + 500),
    errors: Math.floor(Math.random() * 10),
    latency: Math.floor(Math.random() * 100)
  })), []);

  return (
    <div className="space-y-12 p-8">
      {/* Key Metrics */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Key Metrics</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Servers', value: '948', unit: '', icon: Server, color: 'blue' },
            { label: 'CPU Usage', value: '74', unit: '%', icon: Cpu, color: 'green' },
            { label: 'Memory Used', value: '256', unit: 'GB', icon: MemoryStick, color: 'yellow' },
            { label: 'Network Traffic', value: '1.2', unit: 'TB/s', icon: Network, color: 'purple' }
          ].map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* Resource Usage */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Resource Usage</h2>
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-8">
          <div className="h-[400px]">
            <ResponsiveContainer>
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Time (hours)', position: 'bottom', fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Usage (%)', angle: -90, position: 'left', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  name="CPU Usage"
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#3b82f6" 
                  fill="url(#cpuGradient)" 
                  strokeWidth={2}
                />
                <Area 
                  name="Memory Usage"
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#10b981" 
                  fill="url(#memGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Network Activity */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Network Activity</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-8">
            <h3 className="text-lg font-medium text-white mb-4">Latency</h3>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <LineChart data={mockData}>
                  <CartesianGrid stroke="#334155" opacity={0.5} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    label={{ value: 'Time (hours)', position: 'bottom', fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    label={{ value: 'Latency (ms)', angle: -90, position: 'left', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    name="Latency"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-8">
            <h3 className="text-lg font-medium text-white mb-4">Error Rate</h3>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <LineChart data={mockData}>
                  <CartesianGrid stroke="#334155" opacity={0.5} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    label={{ value: 'Time (hours)', position: 'bottom', fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    label={{ value: 'Errors/min', angle: -90, position: 'left', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    name="Errors"
                    type="monotone" 
                    dataKey="errors" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* System Health */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">System Health</h2>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'CPU Temperature', value: 65, max: 100, unit: '°C', icon: Cpu, color: 'blue' },
            { label: 'Memory Usage', value: 74, max: 100, unit: '%', icon: MemoryStick, color: 'green' },
            { label: 'Disk Usage', value: 42, max: 100, unit: '%', icon: HardDrive, color: 'yellow' },
            { label: 'Network Load', value: 31, max: 100, unit: '%', icon: Network, color: 'purple' }
          ].map((metric, i) => (
            <HealthCard key={i} {...metric} />
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value, unit, icon: Icon, color }) => (
  <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6">
    <div className="flex items-start gap-3">
      <div className={`text-${color}-400 bg-slate-800/50 p-2 rounded-lg`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-400 mb-1">{label}</div>
        <div className="text-3xl font-bold text-white">
          {value}<span className="text-slate-400 text-lg ml-1">{unit}</span>
        </div>
      </div>
    </div>
  </div>
);

const HealthCard = ({ label, value, max, unit, icon: Icon, color }) => (
  <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon size={20} className={`text-${color}-400`} />
      <span className="text-lg font-medium text-white">{label}</span>
      <span className="text-2xl font-bold text-white ml-auto">
        {value}<span className="text-slate-400 text-lg ml-1">{unit}</span>
      </span>
    </div>
    <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all bg-gradient-to-r from-${color}-500/50 to-${color}-500`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

export default MonitoringPanel;