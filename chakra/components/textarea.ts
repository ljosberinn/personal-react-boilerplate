import { BaseStyle } from '@chakra-ui/theme-tools';

import { Input } from './input';

const register = {
  parts: ['field'],
  sizes: Input.register.sizes,
  variants: Input.register.variants,
} as const;

const baseStyle: BaseStyle<typeof register> = {
  field: {
    ...Input.baseStyle.field,
    lineHeight: 'short',
    minHeight: '80px',
    paddingY: '8px',
  },
};

export const Textarea = {
  ...Input,
  baseStyle,
  register,
};
