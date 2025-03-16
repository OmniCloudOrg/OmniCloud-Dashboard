import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { CommandPaletteProps, SearchResult } from '../../types';
import useOutsideClick from '../../hooks/useOutsideClick';
import { sampleSearchResults, getIconForResultType } from '../../utils/navigation';

/**
 * Command palette for searching resources
 */
const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleResults, setVisibleResults] = useState(10);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  
  const paletteRef = useOutsideClick(() => {
    if (isOpen) onClose();
  });

  // Reset selection and visible items when query changes
  useEffect(() => {
    setSelectedIndex(0);
    setVisibleResults(10);
  }, [searchQuery]);

  // Clean up when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setVisibleResults(10);
    }
  }, [isOpen]);
  
  // Filter results based on query
  const getFilteredResults = (): SearchResult[] => {
    if (!searchQuery) return sampleSearchResults;
    
    const query = searchQuery.toLowerCase();
    return sampleSearchResults.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      (item.environment && item.environment.toLowerCase().includes(query)) ||
      (item.status && item.status.toLowerCase().includes(query)) ||
      (item.role && item.role.toLowerCase().includes(query)) ||
      (item.target && item.target.toLowerCase().includes(query))
    );
  };

  const filteredResults = getFilteredResults();
  const results = filteredResults.slice(0, visibleResults);

  // Handle infinite scroll to load more results
  const handleScroll = () => {
    if (!resultsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = resultsContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;
    
    if (isNearBottom && visibleResults < filteredResults.length) {
      setVisibleResults(prev => Math.min(prev + 10, filteredResults.length));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        scrollToSelected();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        scrollToSelected();
        break;
      case 'Enter':
        if (results.length > 0) {
          selectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  };

  // Scroll to keep selected item in view
  const scrollToSelected = () => {
    if (!resultsContainerRef.current) return;
    
    const container = resultsContainerRef.current;
    const selectedElement = container.querySelector(`[data-index="${selectedIndex}"]`);
    
    if (selectedElement) {
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elementTop = (selectedElement as HTMLElement).offsetTop;
      const elementBottom = elementTop + (selectedElement as HTMLElement).clientHeight;
      
      if (elementTop < containerTop) {
        container.scrollTop = elementTop;
      } else if (elementBottom > containerBottom) {
        container.scrollTop = elementBottom - container.clientHeight;
      }
    }
  };

  // Handle result selection
  const selectResult = (result: SearchResult) => {
    router.push(`/${result.id}`);
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center pt-32 animate-[fadeIn_0.2s_ease-in-out]">
      <div 
        ref={paletteRef} 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={20} />
          <input
            type="text"
            className="w-full px-12 py-4 bg-transparent text-white border-b border-slate-800 focus:outline-none"
            placeholder="Search for apps, instances, users, or commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close command palette"
          >
            <X size={20} />
          </button>
        </div>

        <div 
          ref={resultsContainerRef} 
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
          onScroll={handleScroll}
        >
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = getIconForResultType(result.type);
                
                return (
                  <button
                    key={result.id}
                    data-index={index}
                    className={`
                      w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors
                      ${selectedIndex === index ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800/70'}
                    `}
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`
                      p-2 rounded-lg 
                      ${result.type === 'app' ? 'bg-blue-500/10 text-blue-400' :
                        result.type === 'instance' ? 'bg-green-500/10 text-green-400' :
                        result.type === 'user' ? 'bg-purple-500/10 text-purple-400' :
                        result.type === 'route' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-500/10 text-slate-400'
                      }
                    `}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-slate-400">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)} • {result.environment || result.status || result.role || result.target}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {visibleResults < filteredResults.length && (
                <div className="p-2 text-center text-slate-400 text-sm">
                  Scroll for more results
                </div>
              )}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center text-slate-400">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
                <Search size={24} className="text-slate-500" />
              </div>
              <p>No results found for "<span className="text-white">{searchQuery}</span>"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
                <Search size={24} className="text-slate-500" />
              </div>
              <p>Start typing to search across resources</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
          <div>
            <span className="mr-2">Navigate:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 mr-1">↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd>
          </div>
          <div>
            <span className="mr-2">Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd>
          </div>
          <div>
            <span className="mr-2">Close:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;