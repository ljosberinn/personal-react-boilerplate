import {
  BaseStyle,
  mode,
  runIfFn,
  Sizes,
  Variants,
  VariantType,
} from '@chakra-ui/theme-tools';

import { Input } from './input';

const register = {
  parts: ['field', 'stepper', 'stepperGroup'],
  sizes: Input.register.sizes,
  variants: Input.register.variants,
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  return {
    field: Input.baseStyle.field,
    stepper: {
      _active: {
        bg: mode('gray.200', 'whiteAlpha.300')(props),
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      borderColor: mode('inherit', 'whiteAlpha.300')(props),
      borderLeft: '1px solid',
      color: mode('inherit', 'whiteAlpha.800')(props),
    },
    stepperGroup: {
      width: '24px',
    },
  };
};

const sizes: Sizes<typeof register> = {
  lg: getSizeStyle('lg'),
  md: getSizeStyle('md'),
  sm: getSizeStyle('sm'),
};

function getSizeStyle(size: 'sm' | 'md' | 'lg') {
  const inputPartsStyle = Input.sizes[size];
  const inputStyle =
    typeof inputPartsStyle !== 'function' ? inputPartsStyle?.field : {};

  const radius = {
    lg: 'md',
    md: 'md',
    sm: 'sm',
  };

  return {
    field: inputStyle,
    stepper: {
      _first: {
        borderTopRightRadius: radius[size],
      },
      _last: {
        borderBottomRightRadius: radius[size],
        borderTopWidth: 1,
        marginTop: '-1px',
      },
      fontSize: size === 'lg' ? '14px' : '10px',
    },
  };
}

const variants: Variants<typeof register> = {
  filled: props => ({ field: getVariantStyle('filled', props) }),
  flushed: props => ({ field: getVariantStyle('flushed', props) }),
  outline: props => ({ field: getVariantStyle('outline', props) }),
  unstyled: props => ({ field: getVariantStyle('unstyled', props) }),
};

function getVariantStyle(variant: VariantType<typeof register>, props: any) {
  const partsStyle = runIfFn(Input.variants[variant], props);
  return partsStyle?.field ?? {};
}

const defaultProps = Input.defaultProps;

export const NumberInput = {
  baseStyle,
  defaultProps,
  register,
  sizes,
  variants,
};
