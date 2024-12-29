import React from 'react';
import { Cloud } from 'lucide-react';




export const Navigation = ({ activeSection, onSectionChange, navigationItems }) => (
  <nav className="w-64 border-r border-slate-800 p-6">
    <div className="flex items-center gap-2 mb-8">
      <Cloud className="text-blue-400" size={24} />
      <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
        Omni Dashboard
      </h1>
    </div>
    <ul className="space-y-1">
      {navigationItems.map(item => (
        <li key={item.id}>
          <button
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
              ${activeSection === item.id
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-blue-400'}`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
);