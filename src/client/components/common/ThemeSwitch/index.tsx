import { Switch, useColorMode, Flex, FlexProps, Box } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

const gray = 'gray.500';
const yellow = 'yellow.500';

const colorMap = {
  moon: {
    dark: yellow,
    light: gray,
  },
  sun: {
    dark: gray,
    light: yellow,
  },
};

export type ThemeSwitchProps = FlexProps;

export function ThemeSwitch(props: ThemeSwitchProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation('theme');

  const isLightTheme = colorMode === 'light';

  return (
    <Flex cursor="pointer" d="inline-flex" {...props}>
      <Box
        d="inline-block"
        as={FaSun}
        focusable={false}
        height="6"
        color={colorMap.sun[colorMode]}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
        aria-label={t(isLightTheme ? 'is-light-theme' : 'set-light-theme')}
      />
      <Flex
        as={Switch}
        aria-label={t(isLightTheme ? 'set-dark-theme' : 'set-light-theme')}
        isChecked={!isLightTheme}
        onChange={toggleColorMode}
        alignItems="center"
        marginLeft="2"
        marginRight="2"
      />
      <Box
        d="inline-block"
        as={FaMoon}
        focusable={false}
        height="6"
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
        aria-label={t(isLightTheme ? 'set-dark-theme' : 'is-dark-theme')}
      />
    </Flex>
  );
}
