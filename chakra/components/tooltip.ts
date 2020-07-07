import { mode, ComponentTheme } from '@chakra-ui/theme-tools';

export const Tooltip: ComponentTheme = {
  baseStyle: props => ({
    bg: mode(`gray.700`, `gray.300`)(props),
    borderRadius: 'sm',
    boxShadow: 'md',
    color: mode(`whiteAlpha.900`, `gray.900`)(props),
    fontSize: 'sm',
    fontWeight: 'medium',
    maxWidth: '320px',
    paddingX: '8px',
    paddingY: '2px',
    pointerEvents: 'none',
  }),
};
