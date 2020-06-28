import { ComponentTheme, mode, orient } from '@chakra-ui/theme-tools';

const Slider: ComponentTheme = {
  baseStyle: props => ({
    FilledTrack: {
      bg: mode(`${props.colorScheme}.500`, `${props.colorScheme}.200`)(props),
    },
    Root: {
      _disabled: {
        cursor: 'default',
        opacity: 0.6,
        pointerEvents: 'none',
      },
      ...orient({
        horizontal: {
          width: '100%',
        },
        orientation: props.orientation,
        vertical: {
          height: '100%',
        },
      }),
    },
    Thumb: {
      _disabled: {
        bg: 'gray.300',
      },
      _focus: {
        boxShadow: 'outline',
      },
      bg: 'white',
      border: '1px solid',
      borderColor: 'transparent',
      borderRadius: 'full',
      boxShadow: 'sm',
      transition: 'transform 0.2s',
      zIndex: 1,
      ...orient({
        horizontal: {
          _active: {
            transform: `translateY(-50%) scale(1.15)`,
          },
          top: '50%',
          transform: `translateY(-50%)`,
        },
        orientation: props.orientation,
        vertical: {
          _active: {
            transform: `translateX(-50%) scale(1.15)`,
          },
          left: '50%',
          transform: `translateX(-50%)`,
        },
      }),
    },
    Track: {
      _disabled: {
        bg: mode('gray.300', 'whiteAlpha.300')(props),
      },
      bg: mode('gray.200', 'whiteAlpha.200')(props),
      borderRadius: 'sm',
    },
  }),
  defaultProps: {
    colorScheme: 'blue',
    size: 'md',
  },
  sizes: {
    lg: props => ({
      Thumb: {
        height: '16px',
        width: '16px',
      },
      Track: orient({
        horizontal: {
          height: '4px',
        },
        orientation: props.orientation,
        vertical: {
          width: '4px',
        },
      }),
    }),
    md: props => ({
      Thumb: {
        height: '14px',
        width: '14px',
      },
      Track: orient({
        horizontal: { height: '4px' },
        orientation: props.orientation,
        vertical: { width: '4px' },
      }),
    }),
    sm: props => ({
      Thumb: {
        height: '10px',
        width: '10px',
      },
      Track: orient({
        horizontal: { height: '2px' },
        orientation: props.orientation,
        vertical: { width: '2px' },
      }),
    }),
  },
};

export const SliderSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export default Slider;
