import { ComponentTheme } from '@chakra-ui/theme-tools';

import Badge, { BadgeVariants } from './badge';

const Tag: ComponentTheme = {
  baseStyle: {
    _focus: {
      boxShadow: 'outline',
    },
    outline: 0,
  },
  defaultProps: {
    colorScheme: 'gray',
    size: 'lg',
    variant: 'subtle',
  },
  sizes: {
    lg: {
      borderRadius: 'md',
      fontSize: 'md',
      minHeight: 8,
      minWidth: 8,
      paddingX: 3,
    },
    md: {
      borderRadius: 'md',
      fontSize: 'sm',
      minHeight: '1.5rem',
      minWidth: '1.5rem',
      paddingX: 2,
    },
    sm: {
      borderRadius: 'sm',
      fontSize: 'xs',
      minHeight: '1.25rem',
      minWidth: '1.25rem',
      paddingX: 1,
    },
  },
  variants: Badge.variants,
};

export const TagSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export const TagVariants = BadgeVariants;

export default Tag;
