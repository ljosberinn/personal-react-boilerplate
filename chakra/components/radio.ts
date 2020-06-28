import { ComponentTheme } from '@chakra-ui/theme-tools';

import Checkbox, { CheckboxSizes } from './checkbox';

const baseStyle = Checkbox.baseStyle as any;

const Radio: ComponentTheme = {
  baseStyle: props => ({
    Control: {
      ...baseStyle(props).Control,
      _checked: {
        ...baseStyle(props).Control['_checked'],
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
    Label: baseStyle(props).Label,
  }),
  defaultProps: Checkbox.defaultProps,
  sizes: {
    ...Checkbox.sizes,
    sm: {
      Control: {
        height: 3,
        width: 3,
      },
    },
  },
};

export const RadioSizes = CheckboxSizes;

export default Radio;
