import React, { createContext } from 'react';
import { useTheme } from '../hooks';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const { isLoading, setTheme, theme } = useTheme();

  return (
    <ThemeContext.Provider value={{ isLoading, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
