import { BaseStyle, DefaultProps, mode, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['track', 'thumb'],
  sizes: ['sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  const { colorScheme: c } = props;
  return {
    thumb: {
      bg: 'white',
      borderRadius: 'full',
      transform: 'translateX(0)',
      transition: 'transform 250ms',
    },
    track: {
      _checked: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
      },
      _disabled: { cursor: 'not-allowed', opacity: 0.4 },
      _focus: { boxShadow: 'outline' },
      bg: mode('gray.300', 'whiteAlpha.400')(props),
      borderRadius: 'full',
      padding: '2px',
      transition: 'all 120ms',
    },
  };
};

const sizes: Sizes<typeof register> = {
  lg: {
    thumb: {
      _checked: {
        transform: 'translateX(1.375rem)',
      },
      height: '1.5rem',
      width: '1.5rem',
    },
    track: { height: '1.5rem', width: '2.875rem' },
  },
  md: {
    thumb: {
      _checked: {
        transform: 'translateX(0.875rem)',
      },
      height: '1rem',
      width: '1rem',
    },
    track: { height: '1rem', width: '1.875rem' },
  },
  sm: {
    thumb: {
      _checked: {
        transform: 'translateX(0.625rem)',
      },
      height: '0.75rem',
      width: '0.75rem',
    },
    track: { height: '0.75rem', width: '1.375rem' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'blue',
  size: 'md',
};

export const Switch = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
