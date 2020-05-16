import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Box,
} from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

import { LanguageSwitch } from './common/LanguageSwitch';
import { ThemeSwitch } from './common/ThemeSwitch';
import theme from './theme';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {/* @ts-ignore */}
      <ThemeProvider theme={theme}>
        <ColorModeProvider value="dark">
          <CSSReset />
          <header>
            <nav>
              <ThemeSwitch />
              <LanguageSwitch />
            </nav>
          </header>
          <Box as="main" p={4}>
            {children}
          </Box>
          <footer>
            Build Time: {process.env.BUILD_TIME} - Build Timestamp:{' '}
            {process.env.BUILD_TIMESTAMP}
          </footer>
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
