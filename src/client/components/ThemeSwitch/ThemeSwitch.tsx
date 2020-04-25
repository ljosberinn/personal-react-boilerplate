import { Switch, useColorMode, Flex } from '@chakra-ui/core';
import * as React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { CustomIcon } from '../CustomIcon';

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
      <CustomIcon
        icon={FaSun}
        height={6}
        color={colorMap.sun[colorMode]}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
      />
      <Switch
        data-testid="theme-switch"
        aria-label="toggle theme"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        ml={2}
        display="flex"
        alignItems="center"
      />
      <CustomIcon
        icon={FaMoon}
        height={6}
        color={colorMap.moon[colorMode]}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
        ml={2}
      />
    </Flex>
  );
}
