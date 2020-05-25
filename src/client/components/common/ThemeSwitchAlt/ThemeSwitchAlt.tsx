import { useColorMode, Box, Button, ButtonProps } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeSwitchAlt(props: Omit<ButtonProps, 'children'>) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  const isLightMode = colorMode === 'light';

  return (
    <Button
      type="button"
      onClick={toggleColorMode}
      variant={isLightMode ? 'outline' : undefined}
      role="checkbox"
      aria-checked={!isLightMode}
      aria-label={t(isLightMode ? 'set-dark-theme' : 'set-light-theme')}
      {...props}
    >
      <Box
        as={isLightMode ? FaSun : FaMoon}
        aria-hidden="true"
        color="yellow.500"
      />
    </Button>
  );
}
