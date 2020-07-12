import {
  CSSReset,
  ThemeProvider,
  ColorModeProvider,
  PortalManager,
  GlobalStyle,
} from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { theme } from '../../chakra';
import { attachComponentBreadcrumb } from '../utils/sentry';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';

export interface ChakraProps {
  children: ReactNode;
}

export function Chakra({ children }: ChakraProps) {
  attachComponentBreadcrumb('chakra');

  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <GlobalStyle />
          <CSSReset />
          <MetaThemeColorSynchronizer />
          <PortalManager zIndex={40}>{children}</PortalManager>
        </ColorModeProvider>
      </ThemeProvider>
      <style jsx global>
        {`
          body,
          div {
            transition: background-color 150ms ease-in-out;
          }
        `}
      </style>
    </>
  );
}
