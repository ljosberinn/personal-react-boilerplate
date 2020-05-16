import { theme } from '@chakra-ui/core';

// see https://chakra-ui.com/theme for customization
// removes default icons as well as brand colors
const { icons, colors: completeColors, ...rest } = theme;
const {
  twitter,
  messenger,
  linkedin,
  whatsapp,
  telegram,
  facebook,
  ...remainingColors
} = completeColors;

export default {
  ...rest,
  colors: remainingColors,
};
