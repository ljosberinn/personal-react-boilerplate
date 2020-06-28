import { ComponentTheme } from '@chakra-ui/theme-tools';

const Divider: ComponentTheme = {
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

export default Divider;
