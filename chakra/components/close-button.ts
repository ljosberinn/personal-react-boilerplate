import { BaseStyle, DefaultProps, mode, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['icon', 'container'],
  sizes: ['sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    container: {
      _active: {
        bg: mode(`blackAlpha.200`, `whiteAlpha.200`)(props),
      },
      _disabled: {
        boxShadow: 'none',
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      _focus: {
        boxShadow: 'outline',
      },
      _hover: {
        bg: mode(`blackAlpha.100`, `whiteAlpha.100`)(props),
      },
      borderRadius: 'md',
      transition: 'all 0.2s',
    },
    icon: {},
  };
};

const sizes: Sizes<typeof register> = {
  lg: {
    container: { height: '40px', width: '40px' },
    icon: { fontSize: '16px' },
  },
  md: {
    container: { height: '32px', width: '32px' },
    icon: { fontSize: '12px' },
  },
  sm: {
    container: { height: '24px', width: '24px' },
    icon: { fontSize: '10px' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
};

export const CloseButton = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
