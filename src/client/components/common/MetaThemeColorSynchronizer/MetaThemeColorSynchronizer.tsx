import { useColorMode } from '@chakra-ui/core';
import Head from 'next/head';
import React from 'react';

import { theme } from '../../../../../chakra';

export default function MetaThemeColorSynchronizer() {
  const isLightTheme = useColorMode().colorMode === 'light';

  return (
    <Head>
      <meta
        name="theme-color"
        content={isLightTheme ? theme.colors.white : theme.colors.gray[800]}
      />
    </Head>
  );
}
