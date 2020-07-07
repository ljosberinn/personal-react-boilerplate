import { SystemProps } from '@chakra-ui/system';
import { ComponentTheme, mode, Props } from '@chakra-ui/theme-tools';

function getOutlineStyle(props: Props): SystemProps {
  return {
    bg: mode('gray.100', 'whiteAlpha.300')(props),
    border: '1px solid',
    borderColor: mode('inherit', 'whiteAlpha.50')(props),
  };
}

function getFilledStyle(props: Props): SystemProps {
  return {
    bg: mode('gray.100', 'whiteAlpha.50')(props),
    border: '2px solid',
    borderColor: 'transparent',
  };
}

function getFlushedStyle(): SystemProps {
  return {
    bg: 'transparent',
    borderBottom: '2px solid',
    borderColor: 'inherit',
    borderRadius: 0,
    paddingX: 0,
  };
}

const unstyled = {
  bg: 'transparent',
  height: 'auto',
  paddingX: 0,
};

const sizes: ComponentTheme['sizes'] = {
  lg: {
    borderRadius: 'md',
    fontSize: 'lg',
    paddingX: 4,
    paddingY: 2,
  },
  md: {
    borderRadius: 'md',
    fontSize: 'md',
    paddingX: 4,
    paddingY: 2,
  },
  sm: {
    borderRadius: 'sm',
    fontSize: 'sm',
    paddingX: 3,
    paddingY: 1,
  },
};

export const InputAddon: ComponentTheme = {
  sizes,
  variants: {
    filled: getFilledStyle,
    flushed: getFlushedStyle,
    outline: getOutlineStyle,
    unstyled,
  },
};

export const InputAddonVariants = {
  filled: 'filled',
  flushed: 'flushed',
  outline: 'outline',
  unstyled: 'unstyled',
};
