import { ComponentTheme } from '@chakra-ui/theme-tools';

const Heading: ComponentTheme = {
  baseStyle: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    lineHeight: 'shorter',
  },
  defaultProps: {
    size: 'xl',
  },
  sizes: {
    '2xl': { fontSize: ['4xl', null, '5xl'] },
    lg: { fontSize: ['xl', null, '2xl'] },
    md: { fontSize: 'xl' },
    sm: { fontSize: 'md' },
    xl: { fontSize: ['3xl', null, '4xl'] },
    xs: { fontSize: 'sm' },
  },
};

export const HeadingSizes = {
  '2xl': '2xl',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xl: 'xl',
  xs: 'xs',
};

export default Heading;
