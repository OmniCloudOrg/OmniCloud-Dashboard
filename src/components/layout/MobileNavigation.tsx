import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, X, Cloud } from 'lucide-react';
import NavSection from '../navigation/NavSection';
import useOutsideClick from '../../hooks/useOutsideClick';
import { navSections } from '../../utils/navigation';
import Button from '../ui/Button';

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
 * Mobile navigation component with enhanced animations
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
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [menuIconRotation, setMenuIconRotation] = useState(0);

  // Mobile nav ref for click outside
  const mobileNavRef = useOutsideClick(() => {
    if (mobileNavOpen) handleCloseDrawer();
  });

  // Handle open/close animations with proper sequencing
  useEffect(() => {
    if (mobileNavOpen) {
      setIsVisible(true);
      // Small delay to ensure backdrop is visible first before drawer slides in
      setTimeout(() => setDrawerVisible(true), 50);
      setMenuIconRotation(90);
    } else {
      setDrawerVisible(false);
      // Delay backdrop removal to complete drawer animation first
      setTimeout(() => setIsVisible(false), 300);
      setMenuIconRotation(0);
    }
  }, [mobileNavOpen]);

  // Properly close the drawer with animations
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => setMobileNavOpen(false), 300);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300"
              aria-label="Open mobile menu"
            >
              <Menu 
                size={24} 
                style={{ 
                  transform: `rotate(${menuIconRotation}deg)`,
                  transition: 'transform 0.3s ease'
                }} 
              />
            </button>
            <span className="font-semibold">OmniCloud Platform</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommandPalette}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300"
              aria-label="Search"
            >
              <Search size={20} className="transform hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={onToggleNotifications}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white relative transition-all duration-300"
              aria-label="Notifications"
            >
              <Bell size={20} className="transform hover:scale-110 transition-transform" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Animations */}
      {isVisible && (
        <div 
          className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
            drawerVisible ? 'opacity-100 bg-slate-900/80' : 'opacity-0 bg-slate-900/0'
          }`}
        >
          <div 
            ref={mobileNavRef} 
            className={`h-full w-80 max-w-[80%] bg-slate-900 border-r border-slate-800 overflow-y-auto transition-transform duration-300 ease-in-out ${
              drawerVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
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
                onClick={handleCloseDrawer}
                ariaLabel="Close mobile menu"
                className="transform hover:rotate-90 transition-transform duration-300"
                children={undefined}
              />
            </div>

            <div className="p-4 space-y-4">
              {navSections.map((section, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    animation: `fadeInUp 0.3s ease forwards ${0.1 + idx * 0.05}s`,
                    opacity: 0
                  }}
                >
                  <NavSection
                    title={section.title}
                    items={section.items}
                    activeSection={activeSection}
                    openSubmenus={openSubmenus}
                    onNavigate={(id) => {
                      onNavigate(id);
                      handleCloseDrawer();
                    }}
                    onToggleSubmenu={onToggleSubmenu}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default MobileNavigation;