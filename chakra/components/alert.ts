import {
  BaseStyle,
  DefaultProps,
  getColor,
  ink,
  mode,
  Variants,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['container', 'title', 'icon'],
  variants: ['subtle', 'left-accent', 'top-accent', 'solid'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  container: {
    paddingX: 4,
    paddingY: 3,
  },
  icon: {
    height: 5,
    marginRight: 3,
    width: 5,
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 'normal',
  },
};

function getBg(props: any) {
  const { theme: t, colorScheme: c } = props;
  const lightBg = getColor(t, `${c}.100`, c);
  const darkBg = ink(`${c}.200`, 'lowest')(t);
  return mode(lightBg, darkBg)(props);
}

const variants: Variants<typeof register> = {
  'left-accent': function (props) {
    const { colorScheme: c } = props;
    return {
      container: {
        bg: getBg(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        borderLeft: '4px solid',
        paddingLeft: 3,
      },
      icon: {
        color: mode(`${c}.500`, `${c}.200`)(props),
      },
    };
  },

  solid: function (props) {
    const { colorScheme: c } = props;
    return {
      container: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        color: mode(`white`, `gray.900`)(props),
      },
    };
  },

  subtle: function (props) {
    const { colorScheme: c } = props;
    return {
      container: { bg: getBg(props) },
      icon: { color: mode(`${c}.500`, `${c}.200`)(props) },
    };
  },

  'top-accent': function (props) {
    const { colorScheme: c } = props;
    return {
      container: {
        bg: getBg(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        borderTop: '4px solid',
        paddingTop: 2,
      },
      icon: {
        color: mode(`${c}.500`, `${c}.200`)(props),
      },
    };
  },
};

const defaultProps: DefaultProps<typeof register> = {
  variant: 'subtle',
};

export const Alert = {
  baseStyle,
  defaultProps,
  register,
  variants,
};
