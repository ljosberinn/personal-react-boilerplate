import { ComponentTheme, mode, Props } from '@chakra-ui/theme-tools';

function getCheckedStyle(props: Props) {
  const { colorScheme: c } = props;
  return {
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
  };
}

const baseStyle = (props: Props) => {
  const { colorScheme: c } = props;

  return {
    Control: {
      _checked: getCheckedStyle(props),
      _disabled: {
        bg: mode('gray.100', 'whiteAlpha.100')(props),
        borderColor: mode('gray.100', 'transparent')(props),
      },
      _focus: {
        boxShadow: 'outline',
      },
      _indeterminate: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
        borderColor: mode(`${c}.500`, `${c}.200`)(props),
        color: mode('white', 'gray.900')(props),
      },
      _invalid: {
        borderColor: mode('red.500', 'red.300')(props),
      },
      border: '2px solid',
      borderColor: 'inherit',
      borderRadius: 'sm',
      color: 'white',
      transition: 'box-shadow 250ms',
    },
    Label: {
      _disabled: { opacity: 0.4 },
    },
  };
};

const sizes = {
  lg: {
    Control: { height: 5, width: 5 },
    Label: { fontSize: 'lg' },
  },
  md: {
    Control: { height: 4, width: 4 },
    Label: { fontSize: 'md' },
  },
  sm: {
    Control: { height: 3, width: 3 },
    Label: { fontSize: 'sm' },
  },
};

export const Checkbox: ComponentTheme = {
  baseStyle,
  defaultProps: {
    colorScheme: 'blue',
    size: 'md',
  },
  sizes,
};

export const CheckboxSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};
