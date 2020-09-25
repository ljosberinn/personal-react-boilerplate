import { useColorModeValue, theme } from '@chakra-ui/core';
import Head from 'next/head';

export function MetaThemeColorSynchronizer(): JSX.Element {
  const color = useColorModeValue(theme.colors.white, theme.colors.gray[800]);

  return (
    <Head>
      <meta name="theme-color" content={color} />
    </Head>
  );
}
