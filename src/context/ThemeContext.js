import React, { createContext } from 'react';
import { useTheme } from '../hooks';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ ...useTheme() }}>
      {children}
    </ThemeContext.Provider>
  );
}
