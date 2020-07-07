import { mode, Styles } from '@chakra-ui/theme-tools';

export const styles: Styles = {
  global: props => ({
    '*, *::before, &::after': {
      borderColor: mode('gray.200', 'whiteAlpha.300')(props),
      wordWrap: 'break-word',
    },
    '*::placeholder': {
      color: mode('gray.400', 'whiteAlpha.400')(props),
    },
    bg: mode('white', 'gray.800')(props),
    color: mode('gray.800', 'whiteAlpha.900')(props),
    fontFamily: 'body',
    fontFeatureSettings: `"pnum"`,
    fontVariantNumeric: 'proportional-nums',
    lineHeight: 'base',
  }),
};
