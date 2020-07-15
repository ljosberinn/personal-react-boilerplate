import {
  BaseStyle,
  DefaultProps,
  getColor,
  mode,
  Sizes,
  Variants,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['tablist', 'tab', 'tabpanel', 'indicator'],
  sizes: ['sm', 'md', 'lg'],
  variants: [
    'line',
    'enclosed',
    'soft-rounded',
    'enclosed-colored',
    'solid-rounded',
    'unstyled',
  ],
} as const;

const alignments = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};

interface Props {
  align?: keyof typeof alignments;
  isFitted?: boolean;
}

const baseStyle: BaseStyle<typeof register> = (props: Props) => {
  const { align = 'start', isFitted } = props;
  return {
    tab: {
      _focus: {
        boxShadow: 'outline',
        zIndex: 1,
      },
      flex: isFitted ? 1 : undefined,
      transition: 'all 0.2s',
    },
    tablist: { justifyContent: alignments[align] },
    tabpanel: {
      padding: 4,
    },
  };
};

const sizes: Sizes<typeof register> = {
  lg: {
    tab: {
      fontSize: '1.15rem',
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
  },
  md: {
    tab: {
      fontSize: '1rem',
      paddingX: '1rem',
      paddingY: '0.5rem',
    },
  },
  sm: {
    tab: {
      fontSize: '0.85rem',
      paddingX: '1rem',
      paddingY: '0.25rem',
    },
  },
};

const variants: Variants<typeof register> = {
  enclosed: function (props) {
    const { colorScheme: c } = props;
    return {
      tab: {
        _selected: {
          borderBottomColor: mode(`white`, `gray.800`)(props),
          borderColor: 'inherit',
          color: mode(`${c}.600`, `${c}.300`)(props),
        },
        border: '1px solid',
        borderColor: 'transparent',
        borderTopRadius: 'md',
        marginBottom: '-1px',
      },
      tablist: {
        borderBottom: '1px solid',
        borderColor: 'inherit',
        marginBottom: '-1px',
      },
    };
  },

  'enclosed-colored': function (props) {
    const { colorScheme: c } = props;
    return {
      tab: {
        _notLast: {
          mr: '-1px',
        },
        _selected: {
          bg: mode(`#fff`, 'gray.800')(props),
          borderBottomColor: 'transparent',
          borderColor: 'inherit',
          borderTopColor: 'currentColor',
          color: mode(`${c}.600`, `${c}.300`)(props),
        },
        bg: mode(`gray.50`, `whiteAlpha.50`)(props),
        border: '1px solid',
        borderColor: 'inherit',
        marginBottom: '-1px',
      },
      tablist: {
        borderBottom: '1px solid',
        borderColor: 'inherit',
        marginBottom: '-1px',
      },
    };
  },

  line: function (props) {
    const { colorScheme: c } = props;
    return {
      tab: {
        _active: {
          bg: mode('gray.200', 'whiteAlpha.300')(props),
        },
        _disabled: {
          cursor: 'not-allowed',
          opacity: 0.4,
        },
        _selected: {
          borderColor: 'currentColor',
          color: mode(`${c}.600`, `${c}.300`)(props),
        },
        borderBottom: '2px solid',
        borderColor: 'transparent',
        marginBottom: '-2px',
      },
      tablist: {
        borderBottom: '2px solid',
        borderColor: 'inherit',
      },
    };
  },

  'soft-rounded': function (props) {
    const { colorScheme: c, theme } = props;
    return {
      tab: {
        _selected: {
          bg: getColor(theme, `${c}.100`),
          color: getColor(theme, `${c}.700`),
        },
        borderRadius: 'full',
        color: 'gray.600',
        fontWeight: 'semibold',
      },
      tablist: {},
    };
  },

  'solid-rounded': function (props) {
    const { colorScheme: c } = props;
    return {
      tab: {
        _selected: {
          bg: mode(`${c}.600`, `${c}.300`)(props),
          color: mode(`#fff`, 'gray.800')(props),
        },
        borderRadius: 'full',
        color: mode('gray.600', 'inherit')(props),
        fontWeight: 'semibold',
      },
    };
  },

  unstyled: {},
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'blue',
  size: 'md',
  variant: 'line',
};

export const Tabs = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};
