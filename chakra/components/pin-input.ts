import { Sizes } from '@chakra-ui/theme-tools';

import { Input } from './input';

const register = {
  parts: ['field'],
  sizes: Input.register.sizes,
  variants: Input.register.variants,
} as const;

const baseStyle = Input.baseStyle;

const variants = Input.variants;

const sizes: Sizes<typeof register> = {
  lg: {
    field: {
      borderRadius: 'md',
      fontSize: 'lg',
      height: 12,
      width: 12,
    },
  },
  md: {
    field: {
      borderRadius: 'md',
      fontSize: 'md',
      height: 10,
      width: 10,
    },
  },
  sm: {
    field: {
      borderRadius: 'sm',
      fontSize: 'sm',
      height: 8,
      width: 8,
    },
  },
};

const defaultProps = Input.defaultProps;

export const PinInput = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};
