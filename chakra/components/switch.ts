import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

const sizes: ComponentTheme['sizes'] = {
  lg: {
    Thumb: {
      _checked: {
        transform: 'translateX(1.375rem)',
      },
      height: '1.5rem',
      width: '1.5rem',
    },
    Track: {
      height: '1.5rem',
      width: '2.875rem',
    },
  },
  md: {
    Thumb: {
      _checked: {
        transform: 'translateX(0.875rem)',
      },
      height: '1rem',
      width: '1rem',
    },
    Track: {
      height: '1rem',
      width: '1.875rem',
    },
  },
  sm: {
    Thumb: {
      _checked: {
        transform: 'translateX(0.625rem)',
      },
      height: '0.75rem',
      width: '0.75rem',
    },
    Track: {
      height: '0.75rem',
      width: '1.375rem',
    },
  },
};

export const Switch: ComponentTheme = {
  baseStyle: props => ({
    Thumb: {
      bg: 'white',
      borderRadius: 'full',
      transform: 'translateX(0)',
      transition: 'transform 250ms',
    },
    Track: {
      _checked: {
        bg: mode(`${props.colorScheme}.500`, `${props.colorScheme}.200`)(props),
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      _focus: {
        boxShadow: 'outline',
      },
      bg: mode('gray.300', 'whiteAlpha.400')(props),
      borderRadius: 'full',
      padding: '2px',
      transition: 'all 120ms',
    },
  }),
  defaultProps: {
    colorScheme: 'blue',
    size: 'md',
  },
  sizes,
};

export const SwitchSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};
