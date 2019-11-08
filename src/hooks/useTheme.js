import { useState, useEffect, useCallback } from 'react';
import useDetectColorScheme, { THEME_NAMES } from './useDetectColorScheme';

// via https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const hasLocalStorage = (() => {
  try {
    const x = '__storage_test__';

    localStorage.setItem(x, x);
    localStorage.removeItem(x);

    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (localStorage && localStorage.length !== 0)
    );
  }
})();

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

export default function useTheme() {
  const detectedTheme = useDetectColorScheme();
  const storedTheme = getStoredTheme();

  const [theme, setTheme] = useState(storedTheme ? storedTheme : detectedTheme);

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
  // but only if no preference was previuosly set
  useEffect(() => {
    if (detectedTheme && !storedTheme) {
      setTheme(detectedTheme);
    }
  }, [detectedTheme, storedTheme]);

  const toggleTheme = useCallback(
    event => {
      setTheme(currentTheme => {
        const upcomingTheme =
          currentTheme === THEME_NAMES.LIGHT
            ? THEME_NAMES.DARK
            : THEME_NAMES.LIGHT;

        storeTheme(upcomingTheme);

        return upcomingTheme;
      });
    },
    [setTheme],
  );

  return { theme, isLoading, toggleTheme };
}
