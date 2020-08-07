import { ChakraProvider, cookieStorageManager } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import React from 'react';

import { attachComponentBreadcrumb } from '../utils/sentry/client';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { MFC, WithChildren } from './types';

export interface ChakraProps extends WithChildren {
  cookies: string;
}

export const Chakra: MFC<ChakraProps> = ({ children, cookies }) => {
  attachComponentBreadcrumb('chakra');

  return (
    <ChakraProvider
      theme={theme}
      portalConfig={{ zIndex: 40 }}
      resetCSS
      storageManager={cookieStorageManager(cookies)}
    >
      <MetaThemeColorSynchronizer />
      {children}
    </ChakraProvider>
  );
};
