import {
  ComponentTheme,
  mode,
  Props,
  getColor,
  StyleObject,
} from '@chakra-ui/theme-tools';

export interface InputProps {
  focusBorderColor?: string;
  errorBorderColor?: string;
}

type VariantProps = Props & Required<InputProps>;

const getDefaults = (props: VariantProps) => ({
  errorBorderColor: props.errorBorderColor || mode('red.500', 'red.300')(props),
  focusBorderColor:
    props.focusBorderColor || mode('blue.500', 'blue.300')(props),
});

function getOutlineStyle(props: VariantProps): StyleObject {
  const { theme: t } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
    _focus: {
      borderColor: getColor(t, fc),
      boxShadow: `0 0 0 1px ${getColor(t, fc)}`,
      zIndex: 1,
    },
    _hover: {
      borderColor: mode('gray.300', 'whiteAlpha.200')(props),
    },
    _invalid: {
      borderColor: getColor(t, ec),
      boxShadow: `0 0 0 1px ${getColor(t, ec)}`,
    },
    bg: mode('white', 'whiteAlpha.100')(props),
    border: '1px solid',
    borderColor: mode('inherit', 'whiteAlpha.50')(props),
  };
}

function getFilledStyle(props: VariantProps): StyleObject {
  const { theme: t } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
    _focus: {
      bg: 'transparent',
      borderColor: getColor(t, fc),
      zIndex: 1,
    },
    _hover: {
      bg: mode('gray.200', 'whiteAlpha.100')(props),
    },
    _invalid: {
      borderColor: getColor(t, ec),
    },
    bg: mode('gray.100', 'whiteAlpha.50')(props),
    border: '2px solid',
    borderColor: 'transparent',
  };
}

function getFlushedStyle(props: VariantProps): StyleObject {
  const { theme: t } = props;

  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    _focus: {
      borderColor: getColor(t, fc),
      zIndex: 1,
    },
    _invalid: {
      borderColor: getColor(t, ec),
    },
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

const sizes: InputTheme['sizes'] = {
  lg: {
    borderRadius: 'md',
    fontSize: 'lg',
    minHeight: 12,
    paddingX: 4,
    paddingY: 2,
  },
  md: {
    borderRadius: 'md',
    fontSize: 'md',
    minHeight: 10,
    paddingX: 4,
    paddingY: 2,
  },
  sm: {
    borderRadius: 'sm',
    fontSize: 'sm',
    minHeight: 8,
    paddingX: 3,
    paddingY: 1,
  },
};

export type InputTheme = ComponentTheme<InputProps>;

const Input: InputTheme = {
  baseStyle: {
    lineHeight: 1,
    outline: 0,
    transitionDuration: '0.2s',
    transitionProperty: 'box-shadow, border, color, background-color',
    width: '100%',
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
  sizes,
  variants: {
    filled: getFilledStyle,
    flushed: getFlushedStyle,
    outline: getOutlineStyle,
    unstyled,
  },
};

export const InputSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export const InputVariants = {
  filled: 'filled',
  flushed: 'flushed',
  outline: 'outline',
  unstyled: 'unstyled',
};

export default Input;
