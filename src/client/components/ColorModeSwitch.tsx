import type { IconButtonProps } from '@chakra-ui/core';
import { useColorMode, IconButton, Icon } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

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
