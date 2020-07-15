import {
  BaseStyle,
  DefaultProps,
  mode,
  orient,
  Sizes,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['container', 'thumb', 'track', 'filledTrack'],
  sizes: ['sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    container: {
      _disabled: {
        cursor: 'default',
        opacity: 0.6,
        pointerEvents: 'none',
      },
      ...orient({
        horizontal: { width: '100%' },
        orientation: props.orientation,
        vertical: { height: '100%' },
      }),
    },
    filledTrack: {
      bg: mode(`${props.colorScheme}.500`, `${props.colorScheme}.200`)(props),
    },
    thumb: {
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
    track: {
      _disabled: {
        bg: mode('gray.300', 'whiteAlpha.300')(props),
      },
      bg: mode('gray.200', 'whiteAlpha.200')(props),
      borderRadius: 'sm',
    },
  };
};

const sizes: Sizes<typeof register> = {
  lg: function (props) {
    return {
      thumb: { height: '16px', width: '16px' },
      track: orient({
        horizontal: { height: '4px' },
        orientation: props.orientation,
        vertical: { width: '4px' },
      }),
    };
  },

  md: function (props) {
    return {
      thumb: { height: '14px', width: '14px' },
      track: orient({
        horizontal: { height: '4px' },
        orientation: props.orientation,
        vertical: { width: '4px' },
      }),
    };
  },

  sm: function (props) {
    return {
      thumb: { height: '10px', width: '10px' },
      track: orient({
        horizontal: { height: '2px' },
        orientation: props.orientation,
        vertical: { width: '2px' },
      }),
    };
  },
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'blue',
  size: 'md',
};

export const Slider = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
