import React from 'react';
import { Plus } from 'lucide-react';

export const AppList = ({ apps, onSelectApp }) => (
  <>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-xl font-semibold text-white">Applications</h2>
      <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
        <Plus size={18} />
        New Application
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map(app => (
        <AppCard key={app.id} app={app} onClick={() => onSelectApp(app)} />
      ))}
    </div>
  </>
);

const AppCard = ({ app, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-lg shadow-emerald-500/20">
        {app.status}
      </span>
    </div>
    <div className="space-y-2">
      <p className="text-sm text-slate-400">{app.type}</p>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{app.instances.length} Instances</span>
        <span className="text-blue-400">View Details →</span>
      </div>
    </div>
  </button>
);