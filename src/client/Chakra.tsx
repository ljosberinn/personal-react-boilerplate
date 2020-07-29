import {
  CSSReset,
  ThemeProvider,
  ColorModeProvider,
  PortalManager,
  GlobalStyle,
} from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry/client';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { withPersistedTheme, ColorMode } from './hooks/useThemePersistence';
import { MFC } from './types';

export interface ChakraProps {
  children: ReactNode;
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
