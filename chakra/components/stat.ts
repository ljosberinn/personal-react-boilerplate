import { BaseStyle, DefaultProps, Sizes } from '@chakra-ui/theme-tools';

const register = {
  parts: ['label', 'helpText', 'number', 'container', 'icon'],
  sizes: ['sm', 'md', 'lg'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  container: {
    flex: '1',
    paddingRight: 4,
  },
  helpText: {
    marginBottom: 2,
    opacity: 0.8,
  },
  icon: {
    height: '14px',
    marginRight: 1,
    verticalAlign: 'middle',
    width: '14px',
  },
  label: {
    fontWeight: 'medium',
  },
  number: {
    fontWeight: 'semibold',
    verticalAlign: 'baseline',
  },
};

const sizes: Sizes<typeof register> = {
  md: {
    helpText: { fontSize: 'sm' },
    label: { fontSize: 'sm' },
    number: { fontSize: '2xl' },
  },
};

const defaultProps: DefaultProps<typeof register> = {
  size: 'md',
};

export const Stat = {
  baseStyle,
  defaultProps,
  register,
  sizes,
};
