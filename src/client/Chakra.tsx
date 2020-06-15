import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Box,
} from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry';
import ServiceWorker from './ServiceWorker';
import theme from './theme';

export interface ChakraProps {
  children: ReactNode;
}

export default function Chakra({ children }: ChakraProps) {
  attachComponentBreadcrumb('chakra');

  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeProvider value="dark">
          <CSSReset />
          <ServiceWorker />
          <Box as="main" p={4}>
            {children}
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
      <style jsx global>
        {`
          html,
          div {
            transition: background-color 250ms ease-in-out;
          }
        `}
      </style>
    </>
  );
}
