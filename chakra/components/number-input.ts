import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

function getSizeStyle(size: 'sm' | 'md' | 'lg') {
  return {
    Stepper: {
      _first: {
        borderTopRightRadius: size === 'lg' ? 3 : 1,
      },
      _last: {
        borderBottomRightRadius: size === 'lg' ? 3 : 1,
        borderTopWidth: 1,
        marginTop: '-1px',
      },
      fontSize: size === 'lg' ? '14px' : '10px',
    },
  };
}

export const NumberInput: ComponentTheme = {
  baseStyle: props => ({
    Stepper: {
      _active: {
        bg: mode('gray.200', 'whiteAlpha.300')(props),
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      borderColor: mode('inherit', 'whiteAlpha.300')(props),
      borderLeft: '1px solid',
      color: mode('inherit', 'whiteAlpha.800')(props),
    },
    StepperGroup: {
      height: 'calc(100% - 2px)',
      margin: '1px',
      position: 'absolute',
      right: '0px',
      width: '24px',
    },
  }),
  defaultProps: {
    size: 'md',
  },
  sizes: {
    lg: getSizeStyle('lg'),
    md: getSizeStyle('md'),
    sm: getSizeStyle('sm'),
  },
};

export const NumberInputSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};
