import {
  BaseStyle,
  DefaultProps,
  isDark,
  mode,
  randomColor,
  Sizes,
} from '@chakra-ui/theme-tools';

import { sizes as themeSizes } from '../foundations/sizes';

const register = {
  parts: ['container', 'excessLabel', 'badge', 'label'],
  sizes: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
} as const;

const baseStyle: BaseStyle<typeof register> = function (props) {
  const { name, theme } = props;
  const bg = name ? randomColor({ string: name }) : 'gray.400';
  const color = name ? (isDark(bg)(theme) ? 'white' : 'gray.800') : 'white';
  const borderColor = mode('white', 'gray.800')(props);

  return {
    badge: {
      border: '0.2em solid',
      borderColor: mode('white', 'gray.800')(props),
      borderRadius: 'full',
      transform: 'translate(25%, 25%)',
    },
    container: {
      bg,
      borderColor,
      color,
      verticalAlign: 'top',
    },
    excessLabel: {
      bg: mode('gray.200', 'whiteAlpha.400')(props),
    },
  };
};

const sizes: Sizes<typeof register> = {
  '2xl': getSize('32'),
  '2xs': getSize('4'),
  full: getSize('100%'),
  lg: getSize('16'),
  md: getSize('12'),
  sm: getSize('8'),
  xl: getSize('24'),
  xs: getSize('6'),
};

function getSize(size: string) {
  const themeSize = themeSizes[size as keyof typeof sizes];
  const styles = { height: size, width: size };
  return {
    container: {
      fontSize: `calc(${themeSize ?? size} / 2.5)`,
      ...styles,
    },
    excessLabel: styles,
    label: {
      fontSize: `calc(${themeSize ?? size} / 2.5)`,
      lineHeight: size !== '100%' ? themeSize ?? size : undefined,
    },
  };
}

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
};

export const Avatar = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
