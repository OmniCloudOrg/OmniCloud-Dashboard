import React from 'react';

export const StatusOverview = ({ app }) => {
  const activeInstances = app.instances.filter(i => i.status === 'running').length;
  const avgCpu = Math.round(app.instances.reduce((acc, inst) => 
    acc + parseInt(inst.cpu), 0) / app.instances.length);

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatusCard title="Total Instances" value={app.instances.length} />
      <StatusCard title="Active Instances" value={activeInstances} />
      <StatusCard title="Average CPU" value={`${avgCpu}%`} />
      <StatusCard title="Average Uptime" value="99.9%" />
    </div>
  );
};

const StatusCard = ({ title, value }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
    <p className="text-2xl font-semibold text-white">{value}</p>
  </div>
);