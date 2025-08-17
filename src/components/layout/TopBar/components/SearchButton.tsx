import React from 'react';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onOpenCommandPalette: (pages?: any[]) => void;
  pages: any[];
}

const SearchButton: React.FC<SearchButtonProps> = ({ onOpenCommandPalette, pages }) => {
  return (
    <button
      onClick={() => onOpenCommandPalette(pages)}
      className="flex items-center gap-1 sm:gap-2 text-sm px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
      aria-label="Search resources"
    >
      <Search size={16} />
      <span className="hidden sm:inline">Search resources...</span>
      <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">⌘</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">K</kbd>
      </div>
    </button>
  );
};

export default SearchButton;