import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

export const Popover: ComponentTheme = {
  baseStyle: props => ({
    Body: {
      paddingX: 3,
      paddingY: 2,
    },
    Content: {
      _focus: {
        boxShadow: 'outline',
        outline: 0,
      },
      bg: mode('white', 'gray.700')(props),
      border: '1px solid',
      borderColor: 'inherit',
      borderRadius: 'md',
      boxShadow: 'sm',
      maxWidth: 'xs',
      width: '100%',
      zIndex: '1',
    },
    Footer: {
      borderTopWidth: '1px',
      paddingX: 3,
      paddingY: 2,
    },
    Header: {
      borderBottomWidth: '1px',
      paddingX: 3,
      paddingY: 2,
    },
  }),
};
