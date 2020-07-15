import { mode, BaseStyle } from '@chakra-ui/theme-tools';

const register = {
  parts: ['link'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    link: {
      _focus: {
        bg: mode('white', 'gray.700')(props),
        boxShadow: 'outline',
        left: '1.5rem',
        padding: '1rem',
        position: 'fixed',
        top: '1.5rem',
      },
      borderRadius: 'md',
      fontWeight: 'semibold',
    },
  };
};

export const SkipLink = {
  baseStyle,
  register,
};
