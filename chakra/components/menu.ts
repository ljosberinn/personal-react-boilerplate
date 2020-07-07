import { SystemProps } from '@chakra-ui/system';
import { Props, mode, ComponentTheme, copy } from '@chakra-ui/theme-tools';

import { Button } from './button';

const getMenuListStyle = (props: Props): SystemProps => {
  return {
    bg: mode(`#fff`, `gray.700`)(props),
    border: '1px solid',
    borderColor: 'inherit',
    borderRadius: 'md',
    boxShadow: mode(`sm`, `dark-lg`)(props),
    color: 'inherit',
    minWidth: '3xs',
    outline: 0,
    paddingY: '2',
    zIndex: '1',
  };
};

const getMenuItemStyle = (props: Props): SystemProps => ({
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
  outline: 0,
  paddingX: '0.8rem',
  paddingY: '0.4rem',
  textDecoration: 'none',
  transition: 'background 50ms ease-in 0s',
  width: '100%',
});

export const Menu: ComponentTheme = {
  baseStyle: props => ({
    MenuButton: Button.baseStyle as SystemProps,
    MenuGroupTitle: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      marginX: 4,
      marginY: 2,
    },
    MenuItem: getMenuItemStyle(props),
    MenuList: getMenuListStyle(props),
  }),
  defaultProps: Button.defaultProps,
  sizes: {
    /**
     * We're using `copy` function to copy all button sizes
     * under the key `MenuButton`.
     */
    ...copy(Button.sizes, 'MenuButton'),
  },
  variants: {
    /**
     * We're using `copy` function to copy all button variants
     * under the key `MenuButton`.
     *
     * You can ignore this copy and write your own variant styles
     * for the different sub-components.
     *
     * @example
     *
     * variants: {
     *   simple: {
     *     MenuButton: {...}
     *   },
     *   extended: {
     *      MenuButton: {...}
     *   }
     * }
     */
    ...copy(Button.variants, 'MenuButton'),
  },
};
