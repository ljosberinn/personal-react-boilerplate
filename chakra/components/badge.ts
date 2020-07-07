import {
  ComponentTheme,
  mode,
  Props,
  getColor,
  ink,
  transparentize,
} from '@chakra-ui/theme-tools';

function getSolidStyle(props: Props) {
  const { colorScheme: c, theme: t } = props;
  const dark = transparentize(`${c}.500`, 0.6)(t);

  return {
    bg: mode(`${c}.500`, dark)(props),
    color: mode(`white`, `whiteAlpha.800`)(props),
  };
}

function getSubtleStyle(props: Props) {
  const { colorScheme: c, theme: t } = props;
  const darkBg = ink(`${c}.200`, 'lowest')(t);

  return {
    bg: mode(`${c}.100`, darkBg)(props),
    color: mode(`${c}.800`, `${c}.200`)(props),
  };
}

function getOutlineStyle(props: Props) {
  const { colorScheme: c, theme: t } = props;

  const dark = transparentize(`${c}.200`, 0.8)(t);
  const light = getColor(t, `${c}.500`);

  const color = mode(light, dark)(props);

  return {
    boxShadow: `inset 0 0 0px 1px ` + color,
    color,
  };
}

export const Badge: ComponentTheme = {
  baseStyle: {
    borderRadius: 'sm',
    fontSize: 'xs',
    fontWeight: 'bold',
    paddingX: 1,
    textTransform: 'uppercase',
  },
  defaultProps: {
    colorScheme: 'gray',
    variant: 'subtle',
  },
  variants: {
    outline: getOutlineStyle,
    solid: getSolidStyle,
    subtle: getSubtleStyle,
  },
};

export const BadgeVariants = {
  outline: 'outline',
  solid: 'solid',
  subtle: 'subtle',
};
