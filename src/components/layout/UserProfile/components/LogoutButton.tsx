import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../../ui';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <div className="p-3 border-t border-slate-700">
      <Button
        onClick={onLogout}
        variant="secondary"
        size="md"
        icon={LogOut}
        fullWidth
        className="text-red-400 hover:text-red-300"
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;