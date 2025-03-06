import React from 'react';
import { Menu, Search, Bell, X, Cloud } from 'lucide-react';
import NavSection from '../navigation/NavSection';
import useOutsideClick from '../../hooks/useOutsideClick';
import { navSections } from '../../utils/navigation';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface MobileNavigationProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  notificationCount: number;
}

/**
 * Mobile navigation component
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({
  mobileNavOpen,
  setMobileNavOpen,
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu,
  onOpenCommandPalette,
  onToggleNotifications,
  notificationCount
}) => {
  // Mobile nav ref for click outside
  const mobileNavRef = useOutsideClick(() => {
    if (mobileNavOpen) setMobileNavOpen(false);
  });

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
            <span className="font-semibold">OmniCloud Platform</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommandPalette}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={onToggleNotifications}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white relative transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/80 backdrop-blur-sm">
          <div 
            ref={mobileNavRef} 
            className="h-full w-80 max-w-[80%] bg-slate-900 border-r border-slate-800 overflow-y-auto animate-[slideInLeft_0.3s_ease-out]"
          >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cloud className="text-blue-400" size={24} />
                <span className="text-lg font-semibold">OmniCloud</span>
              </div>
              <Button
                variant="icon"
                size="sm"
                icon={X}
                onClick={() => setMobileNavOpen(false)}
                ariaLabel="Close mobile menu"
              />
            </div>

            <div className="p-4 space-y-4">
              {navSections.map((section, idx) => (
                <NavSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  activeSection={activeSection}
                  openSubmenus={openSubmenus}
                  onNavigate={(id) => {
                    onNavigate(id);
                    setMobileNavOpen(false);
                  }}
                  onToggleSubmenu={onToggleSubmenu}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;