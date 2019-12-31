// via https://github.com/neo4j/neo4j-browser/blob/master/src/browser/hooks/useDetectColorScheme.js
import { useState, useEffect } from 'react';

export const THEME_NAMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

// Define available themes
const colorSchemes = {
  DARK: `(prefers-color-scheme: ${THEME_NAMES.DARK})`,
  LIGHT: `(prefers-color-scheme: ${THEME_NAMES.LIGHT})`,
};

const getInitialScheme = () => {
  if (window.matchMedia && window.matchMedia(colorSchemes.DARK).matches) {
    return THEME_NAMES.DARK;
  }

  return THEME_NAMES.LIGHT;
};

export default function useDetectColorScheme() {
  const [scheme, setScheme] = useState(getInitialScheme());

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    /**
     *
     * @param {MediaQueryListEvent} e
     */
    const listener = e => {
      if (!e || !e.matches) {
        return;
      }

      const schemeNames = Object.keys(colorSchemes);

      for (let i = 0; i < schemeNames.length; i++) {
        const schemeName = schemeNames[i];
        if (e.media === colorSchemes[schemeName]) {
          setScheme(schemeName.toLowerCase());
          break;
        }
      }
    };

    // Add listener for all themes
    let activeMatches = Object.keys(colorSchemes).map(schemeName => {
      const mq = window.matchMedia(colorSchemes[schemeName]);

      mq.addListener(listener);
      listener(mq);

      return mq;
    });

    // Remove listeners, no memory leaks
    return () => {
      activeMatches.forEach(mq => void mq.removeListener(listener));
      activeMatches = [];
    };
  }, []);

  return scheme;
}
