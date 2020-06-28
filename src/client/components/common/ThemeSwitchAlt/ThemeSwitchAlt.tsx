import {
  useColorMode,
  Box,
  Button,
  ButtonProps,
  useColorModeValue,
} from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

export type ThemeSwitchAltProps = Omit<ButtonProps, 'children'>;

export default function ThemeSwitchAlt(props: ButtonProps) {
  const { t } = useTranslation('theme');
  const { colorMode, toggleColorMode } = useColorMode();
  const hoverBackgroundColor = useColorModeValue('gray.300', 'gray.600');

  const isLightTheme = colorMode === 'light';

  return (
    <Button
      type="button"
      onClick={toggleColorMode}
      variant={isLightTheme ? 'outline' : undefined}
      role="checkbox"
      aria-checked={!isLightTheme}
      aria-label={t(isLightTheme ? 'set-dark-theme' : 'set-light-theme')}
      border="none"
      background="none"
      _hover={{ backgroundColor: hoverBackgroundColor }}
      {...props}
    >
      <Box
        as={isLightTheme ? FaSun : FaMoon}
        aria-hidden="true"
        color="yellow.500"
      />
    </Button>
  );
}
