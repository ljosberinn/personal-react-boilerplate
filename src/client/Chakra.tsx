import {
  CSSReset,
  ThemeProvider,
  ColorModeProvider,
  PortalManager,
  GlobalStyle,
} from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { withPersistedTheme, ColorMode } from './hooks/useThemePersistence';

export interface ChakraProps {
  children: ReactNode;
  initialColorMode: ColorMode;
}

export function Chakra({ children, initialColorMode }: ChakraProps) {
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
}
