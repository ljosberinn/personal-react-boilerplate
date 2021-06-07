import {
  Switch,
  useColorMode,
  Flex,
  forwardRef,
  Icon as ChakraIcon,
} from '@chakra-ui/react';
import type { FlexProps, IconProps } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useTranslation } from '../hooks/useTranslation';

const gray = 'gray.500';
const yellow = 'yellow.500';

function useThemeMeta() {
  const { t } = useTranslation('theme');
  const { colorMode, toggleColorMode } = useColorMode();

  const isLightTheme = colorMode === 'light';
  const isChecked = !isLightTheme;

  const switchLabel = isLightTheme ? 'set-dark-theme' : 'set-light-theme';

  const sunColor = isLightTheme ? yellow : gray;
  const moonColor = isLightTheme ? gray : yellow;

  return {
    isChecked,
    moonColor,
    sunColor,
    switchLabel,
    t,
    toggleColorMode,
  };
}

export type ColorModeSwitchAltProps = FlexProps;

export function ColorModeSwitchAlt(
  props: ColorModeSwitchAltProps
): JSX.Element {
  const { toggleColorMode, isChecked, sunColor, switchLabel, moonColor, t } =
    useThemeMeta();

  return (
    <Flex cursor="pointer" d="inline-flex" {...props}>
      <Icon
        as={FaSun}
        color={sunColor}
        data-testid="theme-switch-sun"
        onClick={toggleColorMode}
      />
      <Switch
        aria-label={t(switchLabel)}
        isChecked={isChecked}
        onChange={toggleColorMode}
        marginLeft="2"
        marginRight="2"
        d="flex"
        alignItems="center"
      />
      <Icon
        as={FaMoon}
        color={moonColor}
        data-testid="theme-switch-moon"
        onClick={toggleColorMode}
      />
    </Flex>
  );
}

const Icon = forwardRef<IconProps, 'svg'>((props, ref) => (
  <ChakraIcon height="6" focusable={false} ref={ref} {...props} />
));
