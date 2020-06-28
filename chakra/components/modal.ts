import { ComponentTheme, mode } from '@chakra-ui/theme-tools';

/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value: string) {
  return {
    Content: {
      maxWidth: value,
    },
  };
}

export interface Props {
  scrollBehavior?: 'inside' | 'outside';
}

const Modal: ComponentTheme<Props> = {
  baseStyle: props => ({
    Body: {
      paddingX: 6,
      paddingY: 2,
    },
    Content: {
      bg: mode('white', 'gray.700')(props),
      borderRadius: 'md',
      boxShadow: mode(
        '0 7px 14px 0 rgba(0,0,0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)',
        'dark-lg'
      )(props),
      color: 'inherit',
      marginY: '3.75rem',
      maxHeight:
        props.scrollBehavior === 'inside' ? 'calc(100vh - 7.5rem)' : undefined,
    },
    Footer: {
      paddingX: 6,
      paddingY: 4,
    },
    Header: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      paddingX: 6,
      paddingY: 4,
    },
    Overlay: {
      bg: 'rgba(0,0,0,0.4)',
    },
  }),
  defaultProps: {
    size: 'md',
  },
  sizes: {
    '2xl': getSize('2xl'),
    '3xl': getSize('3xl'),
    '4xl': getSize('4xl'),
    '5xl': getSize('5xl'),
    '6xl': getSize('6xl'),
    full: getSize('full'),
    lg: getSize('lg'),
    md: getSize('md'),
    sm: getSize('sm'),
    xl: getSize('xl'),
    xs: getSize('xs'),
  },
};

export const ModalSizes = {
  '2xl': '2xl',
  '3xl': '3xl',
  '4xl': '4xl',
  '5xl': '5xl',
  '6xl': '6xl',
  full: 'full',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xl: 'xl',
  xs: 'xs',
};

export default Modal;
