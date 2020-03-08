import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';

import { hasLocalStorage } from '../constants/browserAPIs';
import useDetectColorScheme, {
  THEME_NAMES,
} from '../hooks/useDetectColorScheme';

/**
 * @description retrieves a previous `localStorage.themePreference` value or `null` if nonexistant/unavailable
 * @returns {string|null}
 */
const getStoredTheme = () => {
  if (hasLocalStorage) {
    const themePreference = localStorage.getItem('themePreference');

    return themePreference ? THEME_NAMES[themePreference.toUpperCase()] : null;
  }

  return null;
};

/**
 *
 * @param {'dark' | 'light'} theme
 */
const storeTheme = theme =>
  hasLocalStorage && localStorage.setItem('themePreference', theme);

/**
 * Toggles [data-theme=theme] on root
 *
 * @param {string} theme
 */
const changeThemeOnRoot = theme => {
  document.documentElement.dataset.theme = theme;
};

const ThemeContext = createContext();

/**
 * @returns {{
 * theme: 'light' | 'dark',
 * toggleTheme: () => void,
 * }}
 */
export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const detectedTheme = useDetectColorScheme();
  const storedTheme = getStoredTheme();

  const [theme, setTheme] = useState(storedTheme ?? detectedTheme);

  useEffect(() => {
    changeThemeOnRoot(theme);
  }, [theme]);

  // change theme when device theme changed
  // but only if no preference was previously set
  useEffect(() => {
    if (detectedTheme && !storedTheme) {
      setTheme(detectedTheme);
    }
  }, [detectedTheme, storedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => {
      const upcomingTheme =
        currentTheme === THEME_NAMES.LIGHT
          ? THEME_NAMES.DARK
          : THEME_NAMES.LIGHT;

      storeTheme(upcomingTheme);
      changeThemeOnRoot(upcomingTheme);

      return upcomingTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
