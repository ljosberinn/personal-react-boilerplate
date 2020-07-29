import { ColorModeOptions } from '@chakra-ui/core';
import theme, { Theme } from '@chakra-ui/theme';
import { CookieAttributes, set } from 'js-cookie';
import { NextPageContext } from 'next';
import nextCookies from 'next-cookies';
import { useEffect } from 'react';

export const THEME_COOKIE_NAME = 'chakra-ui-color-mode';

export type ColorMode = NonNullable<ColorModeOptions['initialColorMode']>;

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

const cookieOptions: CookieAttributes = {
  sameSite: 'lax',
};

export const useThemePersistence = (colorMode: ColorMode) => {
  useEffect(() => {
    set(THEME_COOKIE_NAME, colorMode, cookieOptions);
  }, [colorMode]);
};
