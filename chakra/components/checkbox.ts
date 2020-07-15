import { BaseStyle, DefaultProps, mode, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['control', 'label', 'description', 'icon'],
  sizes: ['sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  const { colorScheme: c } = props;
  return {
    control: {
      _checked: {
        _disabled: {
          bg: mode('gray.200', 'whiteAlpha.300')(props),
          borderColor: mode('gray.200', 'transparent')(props),
          color: mode('gray.500', 'whiteAlpha.500')(props),
        },
        _hover: {
          bg: mode(`${c}.600`, `${c}.300`)(props),
          borderColor: mode(`${c}.600`, `${c}.300`)(props),
        },
        bg: mode(`${c}.500`, `${c}.200`)(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        color: mode('white', 'gray.900')(props),
      },
      _disabled: {
        bg: mode('gray.100', 'whiteAlpha.100')(props),
        borderColor: mode('gray.100', 'transparent')(props),
      },
      _focus: { boxShadow: 'outline' },
      _indeterminate: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        color: mode('white', 'gray.900')(props),
      },
      _invalid: { borderColor: mode('red.500', 'red.300')(props) },
      border: '2px solid',
      borderColor: 'inherit',
      borderRadius: 'sm',
      color: 'white',
      transition: 'box-shadow 250ms, background-color 250ms',
      width: '100%',
    },
    icon: {
      fontSize: '0.625rem',
    },
    label: {
      _disabled: { opacity: 0.4 },
      userSelect: 'none',
    },
  };
};

const sizes: Sizes<typeof register> = {
  lg: {
    control: { height: 5, width: 5 },
    label: { fontSize: 'lg' },
  },
  md: {
    control: { height: 4, width: 4 },
    label: { fontSize: 'md' },
  },
  sm: {
    control: { height: 3, width: 3 },
    label: { fontSize: 'sm' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  colorScheme: 'blue',
  size: 'md',
};

export const Checkbox = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
