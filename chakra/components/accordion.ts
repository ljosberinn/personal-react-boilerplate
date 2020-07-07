import { ComponentTheme } from '@chakra-ui/theme-tools';

export const Accordion: ComponentTheme = {
  baseStyle: {
    Button: {
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      _focus: {
        boxShadow: 'outline',
      },
      _hover: {
        bg: 'blackAlpha.50',
      },
      fontSize: '1rem',
      paddingX: 4,
      paddingY: 2,
    },
    Item: {
      _last: {
        borderBottomWidth: '1px',
      },
      borderColor: 'inherit',
      borderTopWidth: '1px',
    },
    Panel: {
      paddingBottom: 5,
      paddingTop: 2,
      paddingX: 4,
    },
  },
};
