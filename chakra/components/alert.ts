import {
  Props,
  ComponentTheme,
  mode,
  getColor,
  ink,
} from '@chakra-ui/theme-tools';

function getSubtleStyle(props: Props) {
  const { theme: t, colorScheme: c } = props;

  const light = getColor(t, `${c}.100`, c);
  const dark = ink(`${c}.200`, 'lowest')(t);

  const bg = mode(light, dark)(props);

  return {
    Icon: {
      color: mode(`${c}.500`, `${c}.200`)(props),
    },
    Root: { bg },
  };
}

function getLeftAccentStyle(props: Props) {
  const { colorScheme: c } = props;
  const subtleStyle = getSubtleStyle(props);
  return {
    Icon: {
      color: mode(`${c}.500`, `${c}.200`)(props),
    },
    Root: {
      borderColor: mode(`${c}.500`, `${c}.200`)(props),
      borderLeft: '4px solid',
      paddingLeft: 3,
      ...subtleStyle.Root,
    },
  };
}

function getTopAccentStyle(props: Props) {
  const { colorScheme: c } = props;
  const subtleStyle = getSubtleStyle(props);
  return {
    Icon: {
      color: mode(`${c}.500`, `${c}.200`)(props),
    },
    Root: {
      borderColor: mode(`${c}.500`, `${c}.200`)(props),
      borderTop: '4px solid',
      paddingTop: 2,
      ...subtleStyle.Root,
    },
  };
}

function getSolidStyle(props: Props) {
  const { colorScheme: c } = props;
  return {
    Root: {
      bg: mode(`${c}.500`, `${c}.200`)(props),
      color: mode(`white`, `gray.900`)(props),
    },
  };
}

const Alert: ComponentTheme = {
  baseStyle: {
    Icon: {
      boxSize: 5,
      marginRight: 3,
    },
    Root: {
      paddingX: 4,
      paddingY: 3,
    },
  },
  defaultProps: {
    variant: 'subtle',
  },
  variants: {
    'left-accent': getLeftAccentStyle,
    solid: getSolidStyle,
    subtle: getSubtleStyle,
    'top-accent': getTopAccentStyle,
  },
};

export const AlertVariants = {
  'left-accent': 'left-accent',
  solid: 'solid',
  subtle: 'subtle',
  'top-accent': 'top-accent',
};

export default Alert;
