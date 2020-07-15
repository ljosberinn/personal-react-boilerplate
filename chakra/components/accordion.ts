import { BaseStyle } from '@chakra-ui/theme-tools';

const register = {
  parts: ['container', 'item', 'button', 'panel'],
} as const;

const baseStyle: BaseStyle<typeof register> = {
  button: {
    _disabled: { cursor: 'not-allowed', opacity: 0.4 },
    _focus: { boxShadow: 'outline' },
    _hover: { bg: 'blackAlpha.50' },
    fontSize: '1rem',
    paddingX: 4,
    paddingY: 2,
  },
  item: {
    _last: {
      borderBottomWidth: '1px',
    },
    borderColor: 'inherit',
    borderTopWidth: '1px',
  },
  panel: {
    paddingBottom: 5,
    paddingTop: 2,
    paddingX: 4,
  },
};

export const Accordion = {
  baseStyle,
  register,
};
