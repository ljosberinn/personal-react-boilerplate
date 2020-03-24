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
    <Flex pr="0" pb="0">
      <Box
        height="22px"
        d="inline-block"
        as={FaSun}
        color={colorMap.sun[colorMode]}
        ml="8px"
        data-testid="theme-switch-sun"
      />
      <Switch
        data-testid="theme-switch"
        aria-label="toggle theme"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        ml="8px"
        mr="8px"
      />
      <Box
        height="22px"
        d="inline-block"
        as={FaMoon}
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
      />
    </Flex>
  );
}
