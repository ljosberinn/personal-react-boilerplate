import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

const CloseButton: ComponentTheme = {
  baseStyle: props => ({
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
  }),
  defaultProps: {
    size: 'md',
  },
  sizes: {
    lg: {
      fontSize: '16px',
      height: '40px',
      width: '40px',
    },
    md: {
      fontSize: '12px',
      height: '32px',
      width: '32px',
    },
    sm: {
      fontSize: '10px',
      height: '24px',
      width: '24px',
    },
  },
};

export const CloseButtonSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export default CloseButton;
