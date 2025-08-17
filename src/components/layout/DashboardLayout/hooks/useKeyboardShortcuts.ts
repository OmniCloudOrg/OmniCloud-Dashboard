import { useEffect } from 'react';

export const useKeyboardShortcuts = (
  setCommandPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void,
  closeAllPanels: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } 
      else if (e.key === 'Escape') {
        closeAllPanels();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, closeAllPanels]);
};