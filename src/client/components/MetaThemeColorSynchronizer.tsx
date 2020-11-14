import { useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';

export function MetaThemeColorSynchronizer(): JSX.Element {
  const color = useColorModeValue('white', 'gray.800');

  return (
    <Head>
      <meta name="theme-color" content={color} />
    </Head>
  );
}
