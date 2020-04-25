import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Box,
} from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <ThemeProvider>
        <ColorModeProvider value="dark">
          <CSSReset />

          <header>
            <nav></nav>
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
