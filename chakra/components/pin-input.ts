import { ComponentTheme } from '@chakra-ui/theme-tools';

import Input, { InputProps, InputVariants } from './input';

const PinInput: ComponentTheme<InputProps> = {
  baseStyle: Input.baseStyle,
  defaultProps: Input.defaultProps,
  sizes: {
    lg: {
      borderRadius: 'md',
      fontSize: 'lg',
      height: 12,
      width: 12,
    },
    md: {
      borderRadius: 'md',
      fontSize: 'md',
      height: 10,
      width: 10,
    },
    sm: {
      borderRadius: 'sm',
      fontSize: 'sm',
      height: 8,
      width: 8,
    },
  },
  variants: Input.variants,
};

export const PinInputSizes = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
};

export const PinInputVariants = InputVariants;

export default PinInput;
