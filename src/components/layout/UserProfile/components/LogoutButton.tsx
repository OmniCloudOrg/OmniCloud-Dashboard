import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="p-3 border-t border-slate-700">
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded transition-colors"
      >
        <LogOut size={16} className="text-red-400" />
        <span className="text-slate-300 text-sm">Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton;