import {
  Props,
  mode,
  ComponentTheme,
  StyleObject,
  getColor,
} from '@chakra-ui/theme-tools';

function getLineStyle(props: Props) {
  const { colorScheme: c } = props;
  return {
    Tab: {
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
    TabList: {
      borderBottom: '2px solid',
      borderColor: 'inherit',
    },
  };
}

function getEnclosedStyle(props: Props) {
  const { colorScheme: c } = props;
  return {
    Tab: {
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
    TabList: {
      borderBottom: '1px solid',
      borderColor: 'inherit',
      marginBottom: '-1px',
    },
  };
}

function getEnclosedColoredStyle(props: Props) {
  const { colorScheme: c } = props;
  return {
    Tab: {
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
    TabList: {
      borderBottom: '1px solid',
      borderColor: 'inherit',
      marginBottom: '-1px',
    },
  };
}

function getSoftRoundedStyle(props: any): StyleObject {
  const { colorScheme: c, theme: t } = props;
  return {
    Tab: {
      _selected: {
        bg: getColor(t, `${c}.100`),
        color: getColor(t, `${c}.700`),
      },
      borderRadius: 'full',
      color: 'gray.600',
      fontWeight: 'semibold',
    },
    TabList: {},
  };
}

function getSolidRoundedStyle(props: Props): StyleObject {
  const { colorScheme: c } = props;
  return {
    Tab: {
      _selected: {
        bg: mode(`${c}.600`, `${c}.300`)(props),
        color: mode(`#fff`, 'gray.800')(props),
      },
      borderRadius: 'full',
      color: mode('gray.600', 'inherit')(props),
      fontWeight: 'semibold',
    },
    TabList: {},
  };
}

export const Tabs: ComponentTheme = {
  baseStyle: {
    Tab: {
      _focus: {
        boxShadow: 'outline',
        zIndex: 1,
      },
      transition: 'all 0.2s',
    },
    TabList: {
      display: 'flex',
    },
    TabPanel: {
      padding: 4,
    },
  },
  defaultProps: {
    colorScheme: 'blue',
    size: 'md',
    variant: 'line',
  },
  sizes: {
    lg: {
      Tab: {
        fontSize: '1.15rem',
        paddingX: '1rem',
        paddingY: '0.75rem',
      },
    },
    md: {
      Tab: {
        fontSize: '1rem',
        paddingX: '1rem',
        paddingY: '0.5rem',
      },
    },
    sm: {
      Tab: {
        fontSize: '0.85rem',
        paddingX: '1rem',
        paddingY: '0.25rem',
      },
    },
  },
  variants: {
    enclosed: getEnclosedStyle,
    'enclosed-colored': getEnclosedColoredStyle,
    line: getLineStyle,
    'soft-rounded': getSoftRoundedStyle,
    'solid-rounded': getSolidRoundedStyle,
    unstyled: {},
  },
};

export const TabSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export const TabVariants = {
  enclosed: 'enclosed',
  'enclosed-colored': 'enclosed-colored',
  line: 'line',
  'soft-rounded': 'soft-rounded',
  'solid-rounded': 'solid-rounded',
  unstyled: 'unstyled',
};
