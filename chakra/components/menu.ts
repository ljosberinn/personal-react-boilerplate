import { BaseStyle, mode } from '@chakra-ui/theme-tools';

const register = {
  parts: [
    'menuList',
    'menuItem',
    'menuButton',
    'groupTitle',
    'menuDivider',
    'icon',
    'command',
  ],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    command: {
      opacity: 0.6,
    },

    groupTitle: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      marginX: 4,
      marginY: 2,
    },

    menuItem: {
      _active: {
        bg: mode(`gray.200`, `whiteAlpha.200`)(props),
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      _expanded: {
        bg: mode(`gray.100`, `whiteAlpha.100`)(props),
      },
      _focus: {
        bg: mode(`gray.100`, `whiteAlpha.100`)(props),
      },
      paddingX: '0.8rem',
      paddingY: '0.4rem',
      transition: 'background 50ms ease-in 0s',
    },

    menuList: {
      bg: mode(`#fff`, `gray.700`)(props),
      borderRadius: 'md',
      borderWidth: '1px',
      boxShadow: mode(`sm`, `dark-lg`)(props),
      color: 'inherit',
      minWidth: '3xs',
      paddingY: '2',
      zIndex: 1,
    },
  };
};

export const Menu = {
  baseStyle,
  register,
};
