import { ComponentTheme } from '@chakra-ui/theme-tools';

export const Divider: ComponentTheme = {
  defaultProps: {
    variant: 'horizontal',
  },
  variants: {
    horizontal: {
      borderBottomWidth: '1px',
      width: '100%',
    },
    vertical: {
      borderLeftWidth: '1px',
      height: '100%',
    },
  },
};
