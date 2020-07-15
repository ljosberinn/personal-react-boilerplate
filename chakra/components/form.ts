import { BaseStyle, mode } from '@chakra-ui/theme-tools';

const register = {
  parts: ['label', 'errorText', 'requiredIndicator', 'helperText', 'errorIcon'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    errorIcon: {
      color: mode('red.500', 'red.300')(props),
      marginRight: '0.5em',
    },
    errorText: {
      color: mode('red.500', 'red.300')(props),
      fontSize: 'sm',
      marginTop: 2,
    },
    helperText: {
      color: mode('gray.500', 'whiteAlpha.600')(props),
      fontSize: 'sm',
      lineHeight: 'normal',
      marginTop: 2,
    },
    label: {
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
    requiredIndicator: {
      color: mode('red.500', 'red.300')(props),
      marginLeft: 1,
    },
  };
};

export const Form = {
  baseStyle,
  register,
};
