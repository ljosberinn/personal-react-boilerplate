import {
  BaseStyle,
  mode,
  TransitionStyle,
  scaleFade,
} from '@chakra-ui/theme-tools';

const register = {
  parts: ['content', 'header', 'body', 'footer'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    body: {
      paddingX: 3,
      paddingY: 2,
    },
    content: {
      _focus: {
        boxShadow: 'outline',
        outline: 0,
      },
      bg: mode('white', 'gray.700')(props),
      border: '1px solid',
      borderColor: 'inherit',
      borderRadius: 'md',
      boxShadow: 'sm',
      maxWidth: 'xs',
      width: '100%',
      zIndex: '1',
    },
    footer: {
      borderTopWidth: '1px',
      paddingX: 3,
      paddingY: 2,
    },
    header: {
      borderBottomWidth: '1px',
      paddingX: 3,
      paddingY: 2,
    },
  };
};

const transition: TransitionStyle<typeof register> = {
  content: scaleFade,
};

export const Popover = {
  baseStyle,
  register,
  transition,
};
