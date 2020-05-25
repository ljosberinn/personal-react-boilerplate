import { Switch, useColorMode, Flex, FlexProps, Box } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

const gray = 'gray.500';
const yellow = 'yellow.500';

const colorMap = {
  sun: {
    light: yellow,
    dark: gray,
  },
  moon: {
    light: gray,
    dark: yellow,
  },
};

export type ThemeSwitchProps = FlexProps;

export default function ThemeSwitch(props: ThemeSwitchProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Flex cursor="pointer" d="inline-flex" {...props}>
      <Box
        d="inline-block"
        as={FaSun}
        height={6}
        color={colorMap.sun[colorMode]}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
        aria-label={t(
          colorMode === 'dark' ? 'set-light-theme' : 'is-light-theme'
        )}
        mr={2}
      />
      <Switch
        aria-label="toggle theme"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        display="flex"
        alignItems="center"
      />
      <Box
        d="inline-block"
        as={FaMoon}
        height={6}
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
        aria-label={t(
          colorMode === 'light' ? 'set-dark-theme' : 'is-dark-theme'
        )}
        ml={2}
      />
    </Flex>
  );
}
