import { ComponentTheme } from '@chakra-ui/theme-tools';

import Badge, { BadgeVariants } from './badge';

const Code: ComponentTheme = {
  baseStyle: {
    borderRadius: 'sm',
    fontFamily: 'mono',
    fontSize: 'sm',
    paddingX: '0.2em',
  },
  defaultProps: Badge.defaultProps,
  variants: Badge.variants,
};

export const CodeVariants = BadgeVariants;

export default Code;
