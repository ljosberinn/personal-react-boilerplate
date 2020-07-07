import { ComponentTheme } from '@chakra-ui/theme-tools';

export const Spinner: ComponentTheme = {
  defaultProps: {
    size: 'md',
  },
  sizes: {
    lg: {
      height: '2rem',
      width: '2rem',
    },
    md: {
      height: '1.5rem',
      width: '1.5rem',
    },
    sm: {
      height: '1rem',
      width: '1rem',
    },
    xl: {
      height: '3rem',
      width: '3rem',
    },
    xs: {
      height: '0.75rem',
      width: '0.75rem',
    },
  },
};

export const SpinnerSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xl: 'xl',
  xs: 'xs',
};
