import { ComponentTheme } from '@chakra-ui/theme-tools';

import { Input, InputVariants, InputSizes, InputProps } from './input';

export const Select: ComponentTheme<InputProps> = {
  ...Input,
  baseStyle: {
    ...Input.baseStyle,
    appearance: 'none',
    lineHeight: 'normal',
    paddingBottom: '1px',
    paddingRight: '2rem',
  },
};

export const SelectSizes = InputSizes;
export const SelectVariants = InputVariants;
