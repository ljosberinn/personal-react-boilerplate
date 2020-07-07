import { ComponentTheme } from '@chakra-ui/theme-tools';

export const Link: ComponentTheme = {
  baseStyle: {
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.4,
      textDecoration: 'none',
    },
    _focus: {
      boxShadow: 'outline',
    },
    _hover: {
      textDecoration: 'underline',
    },
    color: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    textDecoration: 'none',
    transition: `all 0.15s ease-out`,
  },
};
