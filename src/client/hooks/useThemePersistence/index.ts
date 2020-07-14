import { ColorMode } from '@chakra-ui/core';
import { Theme } from '@chakra-ui/theme';
import { set } from 'js-cookie';
import { NextPageContext } from 'next';
import nextCookies from 'next-cookies';
import { useEffect } from 'react';

import { theme } from '../../../../chakra';

export const THEME_COOKIE_NAME = 'chakra-ui-color-mode';

/**
 * Detects the current color mode based on previous preference.
 * If none is present, uses the theme.
 * If theme.config.initialColorMode is missing, falls back to 'light'.
 */
export const detectInitialColorMode = (ctx: NextPageContext): ColorMode =>
  (nextCookies(ctx)[THEME_COOKIE_NAME] ||
    theme.config?.initialColorMode ||
    'light') as ColorMode;

/**
 *  Spreads the theme, overwriting `initialColorMode` key to `theme.config`.
 */
export const withPersistedTheme = (initialColorMode: ColorMode): Theme => ({
  ...theme,
  config: {
    ...theme.config,
    initialColorMode,
  },
});

export function useThemePersistence(colorMode: ColorMode) {
  useEffect(() => {
    set(THEME_COOKIE_NAME, colorMode);
  }, [colorMode]);
}
