import { useColorMode, IconButtonProps, IconButton } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

export type ColorModeSwitchAltProps = Omit<
  IconButtonProps,
  'children' | 'aria-label'
>;

function useThemeMeta() {
  const { toggleColorMode, colorMode } = useColorMode();

  const isLightMode = colorMode === 'light';

  const Icon = isLightMode ? FaMoon : FaSun;
  const checked = !isLightMode;
  const labelKey = isLightMode ? 'set-dark-theme' : 'set-light-theme';

  return {
    Icon,
    checked,
    labelKey,
    toggleColorMode,
  };
}

export function ColorModeSwitchAlt(props: ColorModeSwitchAltProps): JSX.Element {
  const { t } = useTranslation('theme');

  const { Icon, checked, labelKey, toggleColorMode } = useThemeMeta();

  return (
    <IconButton
      {...props}
      onClick={toggleColorMode}
      role="checkbox"
      aria-checked={checked}
      icon={<Icon />}
      color="yellow.500"
      background="none"
      aria-label={t(labelKey)}
    />
  );
}
