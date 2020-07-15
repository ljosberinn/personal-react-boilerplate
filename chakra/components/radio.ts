import { BaseStyle, runIfFn, Sizes } from '@chakra-ui/theme-tools';

import { Checkbox } from './checkbox';

const register = {
  parts: ['control', 'label'],
  sizes: Checkbox.register.sizes,
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  const { label, control } = runIfFn(Checkbox.baseStyle, props);
  return {
    control: {
      ...control,
      _checked: {
        // @ts-expect-error
        ...control?.['_checked'],
        _before: {
          bg: 'currentColor',
          borderRadius: '50%',
          content: `""`,
          display: 'inline-block',
          height: '50%',
          position: 'relative',
          width: '50%',
        },
      },
      borderRadius: 'full',
    },
    label,
  };
};

const sizes: Sizes<typeof register> = {
  ...Checkbox.sizes,
  sm: {
    control: { height: 3, width: 3 },
  },
};

const defaultProps = Checkbox.defaultProps;

export const Radio = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
