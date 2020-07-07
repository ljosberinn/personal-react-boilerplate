import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

export const Kbd: ComponentTheme = {
  baseStyle: props => ({
    bg: mode('gray.100', 'whiteAlpha')(props),
    borderBottomWidth: '3px',
    borderRadius: 'md',
    borderWidth: '1px',
    fontSize: '0.8em',
    fontWeight: 'bold',
    lineHeight: 'normal',
    px: '0.4em',
    whiteSpace: 'nowrap',
  }),
};
