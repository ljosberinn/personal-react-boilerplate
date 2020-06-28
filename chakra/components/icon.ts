import { ComponentTheme } from '@chakra-ui/theme-tools';

const Icon: ComponentTheme = {
  defaultProps: {
    size: 'md',
  },
  sizes: {
    lg: { boxSize: '40px' },
    md: { boxSize: '32px' },
    sm: { boxSize: '24px' },
    xl: { boxSize: '48px' },
    xs: { boxSize: '16px' },
  },
};

export const IconSize = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xl: 'xl',
  xs: 'xs',
};

export default Icon;
