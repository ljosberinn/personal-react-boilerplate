import { BaseStyle, Sizes, DefaultProps } from '@chakra-ui/theme-tools';

import { Badge } from './badge';

const register = {
  parts: ['container', 'label', 'closeButton'],
  sizes: ['sm', 'md', 'lg'],
  variants: Badge.register.variants,
} as const;

const baseStyle: BaseStyle<typeof register> = {
  closeButton: {
    _active: { opacity: 1 },
    _disabled: { opacity: 0.4 },
    _focus: {
      bg: 'rgba(0, 0, 0, 0.14)',
      boxShadow: 'outline',
    },
    _hover: { opacity: 0.8 },
    borderRadius: 'sm',
    fontSize: '1em',
    height: '1.25rem',
    marginLeft: '0.375rem',
    opacity: 0.5,
    width: '1.25rem',
  },
  container: {
    _focus: {
      boxShadow: 'outline',
    },
    outline: 0,
  },
  label: { lineHeight: 1.2 },
};

const sizes: Sizes<typeof register> = {
  lg: {
    container: {
      borderRadius: 'md',
      fontSize: 'md',
      minHeight: 8,
      minWidth: 8,
      paddingX: 3,
    },
  },
  md: {
    container: {
      borderRadius: 'md',
      fontSize: 'sm',
      minHeight: '1.5rem',
      minWidth: '1.5rem',
      paddingX: 2,
    },
  },
  sm: {
    container: {
      borderRadius: 'sm',
      fontSize: 'xs',
      minHeight: '1.25rem',
      minWidth: '1.25rem',
      paddingX: 1,
    },
  },
};

const variants = Badge.variants;

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'gray',
  size: 'lg',
  variant: 'subtle',
};

export const Tag = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};
