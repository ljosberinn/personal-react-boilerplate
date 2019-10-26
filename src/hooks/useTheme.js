import { useState, useEffect } from 'react';
import useDetectColorScheme, { THEME_NAMES } from './useDetectColorScheme';

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
  const theme = useDetectColorScheme() || THEME_NAMES.LIGHT;
  const [usedTheme, setTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const relevantTheme = usedTheme || theme;

  useEffect(() => {
    const darkThemeLink = getDarkThemeLink();

    if (relevantTheme === THEME_NAMES.DARK) {
      // previously switched to dark theme
      if (darkThemeLink) {
        // errored server side
        if (didError) {
          darkThemeLink.remove();
        }

        // already exists, reuse it
        darkThemeLink.disabled = false;
        changeThemeOnHTMLTag(relevantTheme);
        return;
      }

      setIsLoading(true);

      document.querySelector('head').append(
        Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href,
          onload: () => {
            changeThemeOnHTMLTag(relevantTheme);
            setTimeout(() => {
              setIsLoading(false);
            }, 350);
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
      changeThemeOnHTMLTag(relevantTheme);
    }

    setIsLoading(false);
  }, [didError, relevantTheme]);

  return { theme: relevantTheme, isLoading, setTheme };
}
