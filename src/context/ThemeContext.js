import React, { createContext, useState, useEffect, useCallback } from 'react';
import useDetectColorScheme, {
  THEME_NAMES,
} from '../hooks/useDetectColorScheme';
import hasLocalStorage from '../constants/localStorage';

/**
 * @description retrieves a previous `localStorage.themePreference` value or `null` if nonexistant/unavailable
 */
const getStoredTheme = () => {
  if (hasLocalStorage) {
    const themePreference = localStorage.getItem('themePreference');

    return themePreference ? THEME_NAMES[themePreference.toUpperCase()] : null;
  }

  return null;
};

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

const href = 'https://unpkg.com/bulmaswatch/superhero/bulmaswatch.min.css';

const getDarkThemeLink = () => document.querySelector(`link[href="${href}"]`);

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const detectedTheme = useDetectColorScheme();
  const storedTheme = getStoredTheme();

  const [theme, setTheme] = useState(
    storedTheme ? storedTheme : detectedTheme ? detectedTheme : 'light',
  );

  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(theme === THEME_NAMES.DARK);

  useEffect(() => {
    const darkThemeLink = getDarkThemeLink();

    if (theme === THEME_NAMES.DARK) {
      // previously switched to dark theme
      if (darkThemeLink) {
        // errored server side, prepare for retrying
        if (didError) {
          darkThemeLink.remove();
          setDidError(false);
        } else {
          // already exists, reuse it and bail
          darkThemeLink.disabled = false;
          changeThemeOnHTMLTag(theme);
          return;
        }
      }

      setIsLoading(true);

      document.querySelector('head').append(
        Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href,
          onload: () => {
            changeThemeOnHTMLTag(theme);
            setIsLoading(false);
          },
          onerror: () => {
            setTheme(THEME_NAMES.LIGHT);
            setDidError(true);
            setIsLoading(false);
          },
        }),
      );
      return;
    }

    // already exists, disable it
    if (darkThemeLink) {
      darkThemeLink.disabled = true;
      changeThemeOnHTMLTag(theme);
    }

    setIsLoading(false);
  }, [didError, theme]);

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
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ isLoading, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
