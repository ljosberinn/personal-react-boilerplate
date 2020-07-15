import { BaseStyle, DefaultProps, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['heading'],
  sizes: ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  heading: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    lineHeight: 'shorter',
  },
};

const sizes: Sizes<typeof register> = {
  '2xl': {
    heading: { fontSize: ['4xl', null, '5xl'] },
  },
  lg: {
    heading: { fontSize: ['xl', null, '2xl'] },
  },
  md: { heading: { fontSize: 'xl' } },
  sm: { heading: { fontSize: 'md' } },
  xl: {
    heading: { fontSize: ['3xl', null, '4xl'] },
  },
  xs: { heading: { fontSize: 'sm' } },
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'xl',
};

export const Heading = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
