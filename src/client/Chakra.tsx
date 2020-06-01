import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Box,
} from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

import theme from './theme';

export default function Chakra({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeProvider value="dark">
          <CSSReset />
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
