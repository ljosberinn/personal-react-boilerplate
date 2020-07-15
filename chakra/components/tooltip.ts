import { BaseStyle, mode, TransitionStyle } from '@chakra-ui/theme-tools';

const register = {
  parts: ['arrow', 'container'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    container: {
      bg: mode('gray.700', 'gray.300')(props),
      borderRadius: 'sm',
      boxShadow: 'md',
      color: mode('whiteAlpha.900', 'gray.900')(props),
      fontSize: 'sm',
      fontWeight: 'medium',
      maxWidth: '320px',
      paddingX: '8px',
      paddingY: '2px',
      pointerEvents: 'none',
    },
  };
};

const transition: TransitionStyle<typeof register> = {
  container: {
    enter: {
      from: { opacity: 0.01, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    exit: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0.01, transform: 'scale(0.9)' },
    },
    timeout: 120,
    transition: {
      duration: '120ms',
      easing: 'ease-in-out',
      property: 'common',
    },
  },
};

export const Tooltip = {
  baseStyle,
  register,
  transition,
};
