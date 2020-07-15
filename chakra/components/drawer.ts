import { BaseStyle, DefaultProps, mode, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['overlay', 'content', 'header', 'body', 'footer'],
  sizes: [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    'full',
  ],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    body: {
      flex: 1,
      overflow: 'auto',
      paddingX: 6,
      paddingY: 2,
    },

    content: {
      bg: mode('white', 'gray.700')(props),
      boxShadow: mode('lg', 'dark-lg')(props),
      color: 'inherit',
    },

    footer: {
      paddingX: 6,
      paddingY: 4,
    },

    header: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      paddingX: 6,
      paddingY: 4,
    },

    overlay: {
      bg: 'blackAlpha.600',
    },
  };
};

/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value: string) {
  return {
    content: { maxWidth: value },
  };
}

const sizes: Sizes<typeof register> = {
  '2xl': getSize('2xl'),
  '3xl': getSize('3xl'),
  '4xl': getSize('4xl'),
  '5xl': getSize('5xl'),
  '6xl': getSize('6xl'),
  full: getSize('full'),
  lg: getSize('lg'),
  md: getSize('md'),
  sm: getSize('sm'),
  xl: getSize('xl'),
  xs: getSize('xs'),
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
};

export const Drawer = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
