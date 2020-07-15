import { DefaultProps, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['spinner'],
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
} as const;

const sizes: Sizes<typeof register> = {
  lg: {
    spinner: { height: '2rem', width: '2rem' },
  },
  md: {
    spinner: { height: '1.5rem', width: '1.5rem' },
  },
  sm: {
    spinner: { height: '1rem', width: '1rem' },
  },
  xl: {
    spinner: { height: '3rem', width: '3rem' },
  },
  xs: {
    spinner: { height: '0.75rem', width: '0.75rem' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
};

export const Spinner = {
  defaultProps,
  register,
  sizes,
};
