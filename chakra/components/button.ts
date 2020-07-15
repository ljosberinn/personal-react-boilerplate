import {
  BaseStyle,
  DefaultProps,
  mode,
  Props,
  Sizes,
  transparentize,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['container', 'icon', 'spinner'],
  sizes: ['sm', 'md', 'lg', 'xs'],
  variants: ['solid', 'outline', 'ghost', 'unstyled'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  container: {
    _disabled: {
      boxShadow: 'none',
      cursor: 'not-allowed',
      opacity: 0.4,
    },
    _focus: {
      boxShadow: 'outline',
    },
    borderRadius: 'md',
    fontWeight: 'semibold',
    lineHeight: '1.2',
  },
  spinner: {
    fontSize: '1em',
    lineHeight: 'normal',
  },
};

/**
 * Variants Style
 */

function grayGhost(props: Props) {
  return {
    container: {
      _active: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
      },
      _hover: {
        bg: mode(`gray.100`, `whiteAlpha.200`)(props),
      },
      color: mode(`inherit`, `whiteAlpha.900`)(props),
    },
  };
}

function ghost(props: Props) {
  const { colorScheme: c, theme } = props;
  if (c === 'gray') return grayGhost(props);

  const darkHover = transparentize(`${c}.200`, 0.12)(theme);
  const darkActive = transparentize(`${c}.200`, 0.24)(theme);

  return {
    container: {
      _active: {
        bg: mode(`${c}.100`, darkActive)(props),
      },
      _hover: {
        bg: mode(`${c}.50`, darkHover)(props),
      },
      bg: 'transparent',
      color: mode(`${c}.500`, `${c}.200`)(props),
    },
  };
}

function outline(props: Props) {
  const { colorScheme: c } = props;
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);

  return {
    container: {
      border: '1px solid',
      borderColor: c === 'gray' ? borderColor : 'currentColor',
      ...ghost(props).container,
    },
  };
}

function graySolid(props: Props) {
  return {
    container: {
      _active: {
        bg: mode(`gray.300`, `whiteAlpha.400`)(props),
      },
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
      },
      bg: mode(`gray.100`, `whiteAlpha.200`)(props),
    },
  };
}

function solid(props: Props) {
  const { colorScheme: c } = props;

  if (c === 'gray') return graySolid(props);

  return {
    container: {
      _active: { bg: mode(`${c}.700`, `${c}.400`)(props) },
      _hover: { bg: mode(`${c}.600`, `${c}.300`)(props) },
      bg: mode(`${c}.500`, `${c}.200`)(props),
      color: mode(`white`, `gray.800`)(props),
    },
  };
}

function link(props: Props) {
  const { colorScheme: c } = props;
  return {
    container: {
      _active: {
        color: mode(`${c}.700`, `${c}.500`)(props),
      },
      _hover: {
        textDecoration: 'underline',
      },
      color: mode(`${c}.500`, `${c}.200`)(props),
      height: 'auto',
      lineHeight: 'normal',
      padding: 0,
    },
  };
}

const unstyled = {
  container: {
    bg: 'none',
    border: 0,
    color: 'inherit',
    display: 'inline',
    font: 'inherit',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },
};

const sizes: Sizes<typeof register> = {
  lg: {
    container: {
      fontSize: 'lg',
      height: 12,
      minWidth: 12,
      paddingX: 6,
    },
  },
  md: {
    container: {
      fontSize: 'md',
      height: 10,
      minWidth: 10,
      paddingX: 4,
    },
  },
  sm: {
    container: {
      fontSize: 'sm',
      height: 8,
      minWidth: 8,
      paddingX: 3,
    },
  },
  xs: {
    container: {
      fontSize: 'xs',
      height: 6,
      minWidth: 6,
      paddingX: 2,
    },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'gray',
  size: 'md',
  variant: 'solid',
};

export const Button = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants: {
    ghost,
    link,
    outline,
    solid,
    unstyled,
  },
};
