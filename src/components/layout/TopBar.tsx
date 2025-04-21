import React, { useEffect, useState } from 'react';
import { Search, Bell, HelpCircle, CogIcon } from 'lucide-react';
import ProviderBadge from '../navigation/ProviderBadge';
import Button from '../ui/Button';
import { cloudProviders, navSections } from '../../utils/navigation';
import { useRouter } from 'next/navigation'; // Changed from next/router to next/navigation

interface TopBarProps {
  onOpenCommandPalette: (searchResults: { label: string; id: string }[]) => void;
  onToggleNotifications: () => void;
  onToggleHelpPanel: () => void;
  onToggleUserProfile: () => void;
  notificationCount: number;
  activeCloudFilter: string;
  setActiveCloudFilter: (id: string) => void;
}

/**
 * Top navigation bar component
 */
const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleHelpPanel,
  onToggleUserProfile,
  notificationCount,
  activeCloudFilter,
  setActiveCloudFilter
}) => {
  // Extract pages from navSections
  const pages = navSections.flatMap(section =>
    section.items.map(item => ({ label: item.label, id: item.id }))
  );

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Search Command Button */}
        <button
          onClick={() => onOpenCommandPalette(pages)}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search resources...</span>
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">K</kbd>
          </div>
        </button>

        {/* Cloud Provider Filter */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {cloudProviders.map(provider => (
            <ProviderBadge
              key={provider.id}
              provider={provider.name}
              isActive={activeCloudFilter === provider.id}
              onClick={() => setActiveCloudFilter(provider.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="icon"
          icon={Bell}
          onClick={onToggleNotifications}
          ariaLabel="Notifications"
          badge={notificationCount}
        />

        <Button
          variant="icon"
          icon={CogIcon}
          onClick={() => router.push('/dash/settings')}
          ariaLabel="Settings"
        />

        {/* Help Button */}
        <Button
          variant="icon"
          icon={HelpCircle}
          onClick={onToggleHelpPanel}
          ariaLabel="Help and resources"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-slate-800"></div>

        {/* User Profile Button */}
        <button
          onClick={onToggleUserProfile}
          className="flex items-center gap-3 hover:bg-slate-800 p-1 rounded-lg transition-colors"
          aria-label="User profile"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
            AS
          </div>
          <div className="hidden xl:block">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-slate-400">admin@omnicloud.io</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopBar;