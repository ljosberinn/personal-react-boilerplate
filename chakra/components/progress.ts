import { ComponentTheme, mode, getColor } from '@chakra-ui/theme-tools';

type ProgressTheme = ComponentTheme<{ isIndeterminate?: boolean }>;

const getProgressBg: ProgressTheme['baseStyle'] = props => {
  const { colorScheme: c, theme: t, isIndeterminate } = props;

  const bg = mode(`${c}.500`, `${c}.200`)(props);

  const gradient = `linear-gradient(
    to right,
    transparent 0%,
    ${getColor(t, bg)} 50%,
    transparent 100%
  )`;

  return {
    bg: isIndeterminate ? gradient : bg,
  };
};

const sizes: ProgressTheme['sizes'] = {
  lg: {
    Track: {
      height: '1rem',
    },
  },
  md: {
    Track: {
      height: '0.75rem',
    },
  },
  sm: {
    Track: {
      height: '0.5rem',
    },
  },
  xs: {
    Track: {
      height: '0.25rem',
    },
  },
};

export const Progress: ProgressTheme = {
  baseStyle: props => ({
    Indicator: {
      height: '100%',
      transition: 'all 0.3s',
      ...getProgressBg(props),
    },
    Label: {
      fontSize: '0.25em',
      lineHeight: '1',
    },
    Track: {
      bg: mode(`gray.100`, `whiteAlpha.300`)(props),
    },
  }),
  defaultProps: {
    colorScheme: 'blue',
    size: 'md',
  },
  sizes,
};

export const ProgressSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xs: 'xs',
};
