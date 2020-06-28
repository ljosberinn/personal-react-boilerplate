import { ColorMode } from '@chakra-ui/core';

import components from './components';
import foundations from './foundations';
import styles from './styles';

interface ChakraConfig {
  initialColorMode: ColorMode;
  useSystemColorMode: boolean;
}

const config: ChakraConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = {
  ...foundations,
  components,
  config,
  styles,
};
