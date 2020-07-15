import {
  BaseStyle,
  DefaultProps,
  getColor,
  mode,
  Sizes,
  Variants,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['field', 'addon'],
  sizes: ['sm', 'md', 'lg'],
  variants: ['outline', 'flushed', 'filled', 'unstyled'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  field: {
    appearance: 'none',
    outline: 0,
    position: 'relative',
    transition: 'all 0.2s',
    width: '100%',
  },
};

const commonSizeStyle = {
  lg: {
    borderRadius: 'md',
    fontSize: 'lg',
    height: 12,
    paddingLeft: 4,
    paddingRight: 4,
  },

  md: {
    borderRadius: 'md',
    fontSize: 'md',
    height: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },

  sm: {
    borderRadius: 'sm',
    fontSize: 'sm',
    height: 8,
    paddingLeft: 3,
    paddingRight: 3,
  },
};

const sizes: Sizes<typeof register> = {
  lg: {
    addon: commonSizeStyle.lg,
    field: commonSizeStyle.lg,
  },
  md: {
    addon: commonSizeStyle.md,
    field: commonSizeStyle.md,
  },
  sm: {
    addon: commonSizeStyle.sm,
    field: commonSizeStyle.sm,
  },
};

const variants: Variants<typeof register> = {
  filled(props) {
    const { theme } = props;
    const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

    return {
      addon: {
        bg: mode('gray.100', 'whiteAlpha.50')(props),
        border: '2px solid',
        borderColor: 'transparent',
      },
      field: {
        _disabled: { cursor: 'not-allowed', opacity: 0.4 },
        _focus: {
          bg: 'transparent',
          borderColor: getColor(theme, fc),
          zIndex: 1,
        },
        _hover: { bg: mode('gray.200', 'whiteAlpha.100')(props) },
        _invalid: { borderColor: getColor(theme, ec) },
        _readOnly: { boxShadow: 'none !important', userSelect: 'all' },
        bg: mode('gray.100', 'whiteAlpha.50')(props),
        border: '2px solid',
        borderColor: 'transparent',
      },
    };
  },

  flushed(props) {
    const { theme } = props;
    const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

    return {
      addon: {
        bg: 'transparent',
        borderBottom: '2px solid',
        borderColor: 'inherit',
        borderRadius: 0,
        paddingX: 0,
      },
      field: {
        _focus: {
          borderColor: getColor(theme, fc),
          zIndex: 1,
        },
        _invalid: {
          borderColor: getColor(theme, ec),
        },
        _readOnly: {
          boxShadow: 'none !important',
          userSelect: 'all',
        },
        bg: 'transparent',
        borderBottom: '2px solid',
        borderColor: 'inherit',
        borderRadius: 0,
        paddingX: 0,
      },
    };
  },

  outline(props) {
    const { theme } = props;
    const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

    return {
      addon: {
        bg: mode('gray.100', 'whiteAlpha.300')(props),
        border: '1px solid',
        borderColor: mode('inherit', 'whiteAlpha.50')(props),
      },
      field: {
        _disabled: { cursor: 'not-allowed', opacity: 0.4 },
        _focus: {
          borderColor: getColor(theme, fc),
          boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
          zIndex: 1,
        },
        _hover: { borderColor: mode('gray.300', 'whiteAlpha.200')(props) },
        _invalid: {
          borderColor: getColor(theme, ec),
          boxShadow: `0 0 0 1px ${getColor(theme, ec)}`,
        },
        _readOnly: { boxShadow: 'none !important', userSelect: 'all' },
        bg: mode('white', 'whiteAlpha.100')(props),
        border: '1px solid',
        borderColor: mode('inherit', 'whiteAlpha.50')(props),
      },
    };
  },

  unstyled: {
    addon: {
      bg: 'transparent',
      height: 'auto',
      paddingX: 0,
    },
    field: {
      bg: 'transparent',
      height: 'auto',
      paddingX: 0,
    },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
  variant: 'outline',
};

export const Input = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};

interface InputOptions {
  focusBorderColor?: string;
  errorBorderColor?: string;
}

function getDefaults(props: InputOptions) {
  const { focusBorderColor: fc, errorBorderColor: ec } = props;
  return {
    errorBorderColor: ec || mode('red.500', 'red.300')(props),
    focusBorderColor: fc || mode('blue.500', 'blue.300')(props),
  };
}
