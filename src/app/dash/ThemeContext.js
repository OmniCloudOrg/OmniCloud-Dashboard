"use client"
// ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const AVAILABLE_PALETTES = [
  'slate',
  'zinc',
  'gray',
  'neutral'
];

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [currentPalette, setCurrentPalette] = useState('slate');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentPalette);
  }, [currentPalette]);

  const swapPalette = (newPalette) => {
    setCurrentPalette(newPalette);
  };

  const value = {
    currentPalette,
    swapPalette,
    availablePalettes: AVAILABLE_PALETTES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}