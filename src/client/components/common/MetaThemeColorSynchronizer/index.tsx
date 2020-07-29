import { useColorMode } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import Head from 'next/head';
import React from 'react';

import { MFC } from '../../../types';

export const MetaThemeColorSynchronizer: MFC = () => {
  const isLightTheme = useColorMode().colorMode === 'light';

  return (
    <Head>
      <meta
        name="theme-color"
        content={isLightTheme ? theme.colors.white : theme.colors.gray[800]}
      />
    </Head>
  );
};
