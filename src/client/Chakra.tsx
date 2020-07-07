import { ChakraProvider, CSSReset, Box } from '@chakra-ui/core';
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
      <ChakraProvider theme={theme}>
        <CSSReset />
        <MetaThemeColorSynchronizer />
        <Box as="main" p={4}>
          {children}
        </Box>
      </ChakraProvider>
      <style jsx global>
        {`
          body,
          div {
            transition: background-color 250ms ease-in-out;
          }
        `}
      </style>
    </>
  );
}
