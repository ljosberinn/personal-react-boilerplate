import { BaseStyle, mode } from '@chakra-ui/theme-tools';

const register = {
  parts: ['kbd'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    kbd: {
      bg: mode('gray.100', 'whiteAlpha')(props),
      borderBottomWidth: '3px',
      borderRadius: 'md',
      borderWidth: '1px',
      fontSize: '0.8em',
      fontWeight: 'bold',
      lineHeight: 'normal',
      px: '0.4em',
      whiteSpace: 'nowrap',
    },
  };
};

export const Kbd = {
  baseStyle,
  register,
};
