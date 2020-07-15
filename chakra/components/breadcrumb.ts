import { BaseStyle } from '@chakra-ui/theme-tools';

const register = {
  parts: ['container', 'link', 'separator'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  link: {
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
    transition: 'all 0.15s ease-out',
  },
  separator: {},
};

export const Breadcrumb = {
  baseStyle,
  register,
};
