import { keyframes } from '@chakra-ui/system';
import { BaseStyle, getColor, mode } from '@chakra-ui/theme-tools';

const register = {
  parts: ['skeleton'],
} as const;

const baseStyle: BaseStyle<typeof register> = props => {
  const {
    startColor = mode('gray.100', 'gray.800')(props),
    endColor = mode('gray.400', 'gray.600')(props),
    speed,
    theme,
  } = props;

  const start = getColor(theme, startColor);
  const end = getColor(theme, endColor);

  return {
    skeleton: {
      animation: `${speed}s linear infinite alternate ${frame(start, end)}`,
      background: end,
      borderColor: start,
      borderRadius: '2px',
      opacity: 0.7,
    },
  };
};

export const Skeleton = {
  baseStyle,
  register,
};

export function frame(startColor: string, endColor: string) {
  return keyframes({
    from: { background: startColor, borderColor: startColor },
    to: { background: endColor, borderColor: endColor },
  });
}
