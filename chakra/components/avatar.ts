import { SystemProps } from '@chakra-ui/system';
import {
  randomColor,
  isDark,
  ComponentTheme,
  mode,
  Props,
} from '@chakra-ui/theme-tools';

import { sizes } from '../foundations/sizes';

function getSize(size: string) {
  const themeSize = sizes[size as keyof typeof sizes];

  const styles: SystemProps = {
    fontSize: `calc(${themeSize || size} / 2.5)`,
    height: size,
    width: size,
  };

  if (size !== '100%') {
    styles.lineHeight = themeSize || size;
  }

  return {
    ExcessLabel: styles,
    Root: styles,
  };
}

function getRootStyle(props: Props & { name?: string }) {
  const { name, theme: t } = props;

  const bg = name ? randomColor({ string: name }) : 'gray.400';
  const isBgDark = isDark(bg)(t);

  const color = name ? (isBgDark ? 'white' : 'gray.800') : 'white';
  const borderColor = mode('white', 'gray.800')(props);

  return {
    bg,
    borderColor,
    color,
  };
}

type AvatarProps = { name?: string };

export const Avatar: ComponentTheme<AvatarProps> = {
  baseStyle: props => ({
    Badge: {
      border: '0.2em solid',
      borderColor: mode('white', 'gray.800')(props),
      borderRadius: 'full',
      transform: 'translate(25%, 25%)',
    },
    ExcessLabel: {
      bg: mode('gray.200', 'whiteAlpha.400')(props),
    },
    Root: {
      verticalAlign: 'top',
      ...getRootStyle(props),
    },
  }),
  defaultProps: {
    size: 'md',
  },
  sizes: {
    '2xl': getSize('32'),
    '2xs': getSize('4'),
    full: getSize('100%'),
    lg: getSize('16'),
    md: getSize('12'),
    sm: getSize('8'),
    xl: getSize('24'),
    xs: getSize('6'),
  },
};

export const AvatarSizes = {
  '2xl': '2xl',
  '2xs': '2xs',
  full: 'full',
  lg: 'lg',
  md: 'md',
  sm: 'sm',
  xl: 'xl',
  xs: 'xs',
};
