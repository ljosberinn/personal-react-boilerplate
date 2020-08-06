import {
  CSSReset,
  ThemeProvider,
  ColorModeProvider,
  PortalManager,
  GlobalStyle,
} from '@chakra-ui/core';
import React from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry/client';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { withPersistedTheme, ColorMode } from './hooks/useThemePersistence';
import { MFC, WithChildren } from './types';

export interface ChakraProps extends WithChildren {
  initialColorMode: ColorMode;
}

export const Chakra: MFC<ChakraProps> = ({ children, initialColorMode }) => {
  attachComponentBreadcrumb('chakra');

  return (
    <ThemeProvider theme={withPersistedTheme(initialColorMode)}>
      <ColorModeProvider defaultValue={initialColorMode}>
        <GlobalStyle />
        <CSSReset />
        <MetaThemeColorSynchronizer />
        <PortalManager zIndex={40}>{children}</PortalManager>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
