"use client"
import { useTheme } from "./ThemeContext";

export function ThemeSwitcher() {
    const { currentPalette, swapPalette, availablePalettes } = useTheme();
    
    return (
      <select 
        value={currentPalette}
        onChange={(e) => swapPalette(e.target.value)}
        className="px-3 py-1 rounded border border-current"
      >
        {availablePalettes.map((palette) => (
          <option key={palette} value={palette}>
            {palette}
          </option>
        ))}
      </select>
    );
}