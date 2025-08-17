import React from 'react';
import CommandPalette from '../../../command/CommandPalette';
import NotificationsPanel from '../../../dropdowns/NotificationsPanel';
import HelpPanel from '../../../dropdowns/HelpPanel';
import UserProfilePanel from '../../../dropdowns/UserProfilePanel';
import { PanelState, UIState } from '../types';

interface PanelOverlaysProps {
  panelState: PanelState;
  uiState: UIState;
  onCloseCommandPalette: () => void;
  onCloseNotifications: () => void;
  onCloseHelp: () => void;
  onCloseUserProfile: () => void;
}

const PanelOverlays: React.FC<PanelOverlaysProps> = ({
  panelState,
  uiState,
  onCloseCommandPalette,
  onCloseNotifications,
  onCloseHelp,
  onCloseUserProfile
}) => {
  return (
    <>
      <CommandPalette
        isOpen={uiState.commandPaletteOpen}
        onClose={onCloseCommandPalette}
      />

      <NotificationsPanel 
        isOpen={panelState.notificationsOpen} 
        onClose={onCloseNotifications} 
      />

      <HelpPanel 
        isOpen={panelState.helpPanelOpen} 
        onClose={onCloseHelp} 
      />

      <UserProfilePanel 
        isOpen={panelState.userProfileOpen} 
        onClose={onCloseUserProfile} 
      />
    </>
  );
};

export default PanelOverlays;