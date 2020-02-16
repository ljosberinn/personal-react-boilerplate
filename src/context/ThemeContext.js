import React, { createContext, useState, useEffect, useCallback } from 'react';

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
 * Toggles .theme--light | .theme--dark on HTML tag
 *
 * @param {string} theme
 */
const changeThemeOnHTMLTag = theme => {
  const thisTheme = `theme--${theme}`;
  const otherTheme = `theme--${
    theme === THEME_NAMES.LIGHT ? THEME_NAMES.DARK : THEME_NAMES.LIGHT
  }`;

  const htmlTagClassList = document.querySelector('html').classList;

  if (htmlTagClassList.contains(otherTheme)) {
    htmlTagClassList.replace(otherTheme, thisTheme);
    return;
  }

  htmlTagClassList.add(thisTheme);
};

const getDarkThemeLink = () => document.querySelector(`[data-theme="dark"]`);

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const detectedTheme = useDetectColorScheme();
  const storedTheme = getStoredTheme();

  const [theme, setTheme] = useState(storedTheme ? storedTheme : detectedTheme);

  useEffect(() => {
    const darkThemeLink = getDarkThemeLink();

    if (theme === THEME_NAMES.DARK) {
      darkThemeLink.disabled = false;
      changeThemeOnHTMLTag(theme);
      return;
    }

    darkThemeLink.disabled = true;
    changeThemeOnHTMLTag(theme);
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

      return upcomingTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
