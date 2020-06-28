import {
  Props,
  mode,
  ComponentTheme,
  transparentize,
} from '@chakra-ui/theme-tools';

const grayGhostStyle = (props: Props) => ({
  _active: {
    bg: mode(`gray.200`, `whiteAlpha.300`)(props),
  },
  _hover: {
    bg: mode(`gray.100`, `whiteAlpha.200`)(props),
  },
  color: mode(`inherit`, `whiteAlpha.900`)(props),
});

function getGhostStyle(props: Props) {
  const { colorScheme: c, theme: t } = props;
  if (c === 'gray') {
    return grayGhostStyle(props);
  }

  const darkHover = transparentize(`${c}.200`, 0.12)(t);
  const darkActive = transparentize(`${c}.200`, 0.24)(t);

  return {
    _active: {
      bg: mode(`${c}.100`, darkActive)(props),
    },
    _hover: {
      bg: mode(`${c}.50`, darkHover)(props),
    },
    bg: 'transparent',
    color: mode(`${c}.500`, `${c}.200`)(props),
  };
}

function getOutlineStyle(props: Props) {
  const { colorScheme: c } = props;
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);

  return {
    border: '1px solid',
    borderColor: c === 'gray' ? borderColor : 'currentColor',
    ...getGhostStyle(props),
  };
}

const graySolidStyle = (props: Props) => ({
  _active: {
    bg: mode(`gray.300`, `whiteAlpha.400`)(props),
  },
  _hover: {
    bg: mode(`gray.200`, `whiteAlpha.300`)(props),
  },
  bg: mode(`gray.100`, `whiteAlpha.200`)(props),
});

function getSolidStyle(props: Props) {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    return graySolidStyle(props);
  }

  return {
    _active: { bg: mode(`${c}.700`, `${c}.400`)(props) },
    _hover: { bg: mode(`${c}.600`, `${c}.300`)(props) },
    bg: mode(`${c}.500`, `${c}.200`)(props),
    color: mode(`white`, `gray.800`)(props),
  };
}

function getLinkStyle(props: Props) {
  const { colorScheme: c } = props;

  return {
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
  };
}

const sizes = {
  lg: {
    fontSize: 'lg',
    height: 12,
    minWidth: 12,
    paddingX: 6,
  },
  md: {
    fontSize: 'md',
    height: 10,
    minWidth: 10,
    paddingX: 4,
  },
  sm: {
    fontSize: 'sm',
    height: 8,
    minWidth: 8,
    paddingX: 3,
  },
  xs: {
    fontSize: 'xs',
    height: 6,
    minWidth: 6,
    paddingX: 2,
  },
};

const unstyled = {
  bg: 'none',
  border: 0,
  color: 'inherit',
  display: 'inline',
  font: 'inherit',
  lineHeight: 'inherit',
  margin: 0,
  padding: 0,
};

const Button: ComponentTheme = {
  baseStyle: {
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
  defaultProps: {
    colorScheme: 'gray',
    size: 'md',
    variant: 'solid',
  },
  sizes,
  variants: {
    ghost: getGhostStyle,
    link: getLinkStyle,
    outline: getOutlineStyle,
    solid: getSolidStyle,
    unstyled,
  },
};

export const ButtonSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xs: 'xs',
};

export const ButtonVariants = {
  outline: 'outline',
  solid: 'solid',
  subtle: 'subtle',
};

export default Button;
