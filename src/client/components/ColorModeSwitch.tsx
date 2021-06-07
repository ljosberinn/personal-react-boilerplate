import { useColorMode, IconButton, Icon } from '@chakra-ui/react';
import type { IconButtonProps } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useTranslation } from '../hooks/useTranslation';

export type ColorModeSwitchProps = Omit<
  IconButtonProps,
  'children' | 'aria-label'
>;

function useThemeMeta() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { t } = useTranslation('theme');

  const isLightMode = colorMode === 'light';

  const icon = isLightMode ? FaMoon : FaSun;
  const checked = !isLightMode;
  const labelKey = isLightMode ? 'set-dark-theme' : 'set-light-theme';

  return {
    checked,
    icon: <Icon as={icon} boxSize="5" />,
    labelKey,
    t,
    toggleColorMode,
  };
}

export function ColorModeSwitch(props: ColorModeSwitchProps): JSX.Element {
  const { icon, checked, labelKey, toggleColorMode, t } = useThemeMeta();

  return (
    <IconButton
      {...props}
      onClick={toggleColorMode}
      role="checkbox"
      aria-checked={checked}
      icon={icon}
      color="yellow.500"
      background="none"
      aria-label={t(labelKey)}
    />
  );
}
