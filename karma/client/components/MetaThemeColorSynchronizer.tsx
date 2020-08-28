import { useColorModeValue } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import Head from 'next/head';

export function MetaThemeColorSynchronizer(): JSX.Element {
  const color = useColorModeValue(theme.colors.white, theme.colors.gray[800]);

  return (
    <Head>
      <meta name="theme-color" content={color} />
    </Head>
  );
}
