import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CogIcon, HelpCircle, Menu } from 'lucide-react';
import Button from '../../../ui/Button';

interface ActionButtonsProps {
  isMobile: boolean;
  selectedPlatformId: string;
  notificationCount: number;
  onToggleMobileMenu: () => void;
  onToggleNotifications: () => void;
  onToggleHelpPanel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isMobile,
  selectedPlatformId,
  notificationCount,
  onToggleMobileMenu,
  onToggleNotifications,
  onToggleHelpPanel
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {isMobile && (
        <Button
          variant="icon"
          icon={Menu}
          onClick={onToggleMobileMenu}
          ariaLabel="Toggle mobile menu"
          className="mr-1"
        />
      )}

      {selectedPlatformId && (
        <div className="hidden md:flex items-center px-2 py-1 bg-blue-900 text-blue-100 rounded text-xs">
          Platform ID: {selectedPlatformId}
        </div>
      )}
      
      <Button
        variant="icon"
        icon={Bell}
        onClick={onToggleNotifications}
        ariaLabel="Notifications"
        badge={notificationCount}
      />

      <div className="hidden xs:block">
        <Button
          variant="icon"
          icon={CogIcon}
          onClick={() => router.push('/dash/settings')}
          ariaLabel="Settings"
        />
      </div>

      <div className="hidden sm:block">
        <Button
          variant="icon"
          icon={HelpCircle}
          onClick={onToggleHelpPanel}
          ariaLabel="Help and resources"
        />
      </div>

      <div className="hidden sm:block w-px h-6 bg-slate-800"></div>
    </div>
  );
};

export default ActionButtons;