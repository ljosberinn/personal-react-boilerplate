import { ChakraProvider, CSSReset, Box } from '@chakra-ui/core';
import React, { ReactNode } from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry';
import { customTheme } from './theme';

export interface ChakraProps {
  children: ReactNode;
}

export default function Chakra({ children }: ChakraProps) {
  attachComponentBreadcrumb('chakra');

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <CSSReset />
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
