import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

const Form: ComponentTheme = {
  baseStyle: props => ({
    ErrorIcon: {
      color: mode('red.500', 'red.300')(props),
      marginRight: '0.5em',
    },
    ErrorText: {
      color: mode('red.500', 'red.300')(props),
      fontSize: 'sm',
      marginTop: 2,
    },
    HelperText: {
      color: mode('gray.500', 'whiteAlpha.600')(props),
      fontSize: 'sm',
      lineHeight: 'normal',
      marginTop: 2,
    },
    Label: {
      _disabled: {
        opacity: 0.4,
      },
      fontSize: 'md',
      fontWeight: 'medium',
      marginBottom: 2,
      marginRight: 3,
      opacity: 1,
      transition: 'all 0.2s',
    },
    RequiredIndicator: {
      color: mode('red.500', 'red.300')(props),
      marginLeft: 1,
    },
  }),
};

export default Form;
