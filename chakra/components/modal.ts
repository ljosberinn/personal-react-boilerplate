import {
  BaseStyle,
  DefaultProps,
  mode,
  Sizes,
  TransitionStyle,
} from '@chakra-ui/theme-tools';

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
  const { isCentered, scrollBehavior } = props;

  return {
    body: {
      flex: 1,
      overflow: scrollBehavior === 'inside' ? 'auto' : undefined,
      paddingX: 6,
      paddingY: 2,
    },

    content: {
      bg: mode('white', 'gray.700')(props),
      borderRadius: 'md',
      boxShadow: mode('lg', 'dark-lg')(props),
      color: 'inherit',
      marginY: '3.75rem',
      maxHeight:
        scrollBehavior === 'inside' ? 'calc(100vh - 7.5rem)' : undefined,
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
      alignItems: isCentered ? 'center' : 'flex-start',
      bg: 'blackAlpha.600',
      display: 'flex',
      justifyContent: 'center',
      overflow: scrollBehavior === 'inside' ? 'hidden' : 'auto',
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

const transition: TransitionStyle<typeof register> = {
  content: {
    addAppearStyles: true,
    enter: {
      from: { opacity: 0.01, transform: 'scale(0.97)' },
      to: { opacity: 1, transform: 'scale(1)' },
      transition: {
        duration: '150ms',
        easing: 'cubic-bezier(0,0,.2,1)',
        property: 'opacity, transform',
      },
    },
    exit: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0.01, transform: 'scale(0.97)' },
      transition: {
        duration: '100ms',
        easing: 'cubic-bezier(.4,0,1,1)',
        property: 'opacity, transform',
      },
    },
    timeout: { enter: 150, exit: 100 },
  },
  overlay: {
    enter: {
      from: { opacity: 0.01 },
      to: { opacity: 1 },
      transition: {
        duration: '150ms',
        easing: 'cubic-bezier(0,0,.2,1)',
        property: 'opacity',
      },
    },
    exit: {
      from: { opacity: 1 },
      to: { opacity: 0.01 },
      transition: {
        duration: '100ms',
        easing: 'cubic-bezier(.4,0,1,1)',
        property: 'opacity',
      },
    },
    timeout: { enter: 150, exit: 100 },
  },
};

export const Modal = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  transition,
};
