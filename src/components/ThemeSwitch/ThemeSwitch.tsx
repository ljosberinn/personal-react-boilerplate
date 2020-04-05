import { Switch, useColorMode, Box, Flex } from '@chakra-ui/core';
import React from 'react';
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

export default function ThemeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex cursor="pointer" pt={2} pb={2}>
      <Box
        height={6}
        d="inline-block"
        as={FaSun}
        color={colorMap.sun[colorMode]}
        ml={2}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
      />
      <Switch
        data-testid="theme-switch"
        aria-label="toggle theme"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        ml={2}
        mr={2}
        display="flex"
        alignItems="center  "
      />
      <Box
        height={6}
        d="inline-block"
        as={FaMoon}
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
      />
    </Flex>
  );
}
