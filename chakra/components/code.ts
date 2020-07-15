import { BaseStyle } from '@chakra-ui/theme-tools';

import { Badge } from './badge';

const register = {
  parts: ['container'],
  variants: Badge.register.variants,
} as const;

const baseStyle: BaseStyle<typeof register> = {
  container: {
    borderRadius: 'sm',
    fontFamily: 'mono',
    fontSize: 'sm',
    paddingX: '0.2em',
  },
};

const variants = Badge.variants;

const defaultProps = Badge.defaultProps;

export const Code = {
  baseStyle,
  defaultProps,
  register,
  variants,
};
