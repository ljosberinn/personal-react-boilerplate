import { BaseStyle } from '@chakra-ui/theme-tools';

import { Input } from './input';

const register = {
  parts: ['field', 'icon'],
  sizes: Input.register.sizes,
  variants: Input.register.variants,
} as const;

const baseStyle: BaseStyle<typeof register> = {
  field: {
    ...Input.baseStyle.field,
    appearance: 'none',
    lineHeight: 'normal',
    paddingBottom: '1px',
    paddingRight: '2rem',
  },
  icon: {
    _disabled: { opacity: 0.5 },
    color: 'currentColor',
    fontSize: '1.25rem',
  },
};

const sizes = Input.sizes;
const variants = Input.variants;
const defaultProps = Input.defaultProps;

export const Select = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};
