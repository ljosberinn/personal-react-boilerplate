import theme, { Theme } from '@chakra-ui/theme';

// see https://chakra-ui.com/theme for customization
export const customTheme: Theme = {
  ...theme,
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false, // overrides dark if system does not prefer dark
  },
};
