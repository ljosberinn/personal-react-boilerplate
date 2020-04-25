import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Box,
} from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

import { ThemeSwitch } from './common/ThemeSwitch';
import theme from './theme';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeProvider value="dark">
          <CSSReset />
          <header>
            <nav>
              <ThemeSwitch />
            </nav>
          </header>
          <Box as="main" p={4}>
            {children}
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
      <style jsx global>
        {`
          html {
            transition: background-color 300ms ease-in-out,
              color 300ms ease-in-out;
          }
        `}
      </style>
    </>
  );
}
