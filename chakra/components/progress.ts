import {
  BaseStyle,
  DefaultProps,
  generateStripe,
  getColor,
  mode,
  Sizes,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['track', 'filledTrack', 'label'],
  sizes: ['xs', 'sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    filledTrack: {
      transition: 'all 0.3s',
      ...getFilledTrackStyle(props),
    },
    label: {
      color: 'white',
      fontSize: '0.25em',
      fontWeight: 'bold',
      lineHeight: '1',
    },
    track: {
      bg: mode(`gray.100`, `whiteAlpha.300`)(props),
    },
  };
};

function getFilledTrackStyle(props: any) {
  const { colorScheme: c, theme: t, isIndeterminate, hasStripe } = props;

  const stripeStyle = mode(
    generateStripe(),
    generateStripe('1rem', 'rgba(0,0,0,0.1)')
  )(props);

  const bg = mode(`${c}.500`, `${c}.200`)(props);

  const gradient = `linear-gradient(
    to right,
    transparent 0%,
    ${getColor(t, bg)} 50%,
    transparent 100%
  )`;

  const shouldAddStripe = !isIndeterminate && hasStripe;

  return {
    ...(shouldAddStripe && stripeStyle),
    bg: isIndeterminate ? gradient : bg,
  };
}

const sizes: Sizes<typeof register> = {
  lg: {
    track: { height: '1rem' },
  },
  md: {
    track: { height: '0.75rem' },
  },
  sm: {
    track: { height: '0.5rem' },
  },
  xs: {
    track: { height: '0.25rem' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'blue',
  size: 'md',
};

export const Progress = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
