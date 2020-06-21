import { Switch, useColorMode, Flex, FlexProps, Box } from '@chakra-ui/core';
import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

import { customTheme } from '../../../theme';

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

export default function ThemeSwitch(props: ThemeSwitchProps) {
  const [colorMode, toggleColorMode] = useColorMode();
  const { t } = useTranslation('theme');

  const isLightTheme = colorMode === 'light';

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={
            isLightTheme
              ? customTheme.colors.white
              : customTheme.colors.gray[800]
          }
        />
      </Head>
      <Flex cursor="pointer" d="inline-flex" {...props}>
        <Box
          d="inline-block"
          as={FaSun}
          height={6}
          color={colorMap.sun[colorMode]}
          data-testid="theme-switch-sun"
          onClick={toggleColorMode}
          aria-label={t(isLightTheme ? 'is-light-theme' : 'set-light-theme')}
          mr={2}
        />
        <Switch
          aria-label="toggle theme"
          isChecked={!isLightTheme}
          onChange={toggleColorMode}
          display="flex"
          alignItems="center"
          sx={undefined}
        />
        <Box
          d="inline-block"
          as={FaMoon}
          height={6}
          color={colorMap.moon[colorMode]}
          data-testid="theme-switch-moon"
          onClick={toggleColorMode}
          aria-label={t(isLightTheme ? 'set-dark-theme' : 'is-dark-theme')}
          ml={2}
        />
      </Flex>
    </>
  );
}
