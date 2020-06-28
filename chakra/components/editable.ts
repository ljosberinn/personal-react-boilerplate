import { SystemProps } from '@chakra-ui/system';
import { ComponentTheme } from '@chakra-ui/theme-tools';

const base: SystemProps = {
  bg: 'transparent',
  borderRadius: 'md',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  marginX: '-3px',
  paddingX: '3px',
  textAlign: 'inherit',
  transition: 'all 0.2s',
};

const Editable: ComponentTheme = {
  baseStyle: {
    Input: {
      ...base,
      _focus: {
        boxShadow: 'outline',
      },
      _placeholder: {
        opacity: 0.6,
      },
      outline: 0,
      width: 'full',
    },
    Preview: {
      ...base,
      cursor: 'text',
      display: 'inline-block',
    },
  },
};

export default Editable;
