import React from 'react';
import { Title, Box } from 'rbx';
import { ThemeSwitch } from '../../../../components';
import { useTranslation } from 'react-i18next';

export default function ChangeTheme() {
  const { t } = useTranslation('settings');

  return (
    <Box>
      <Title as="h3">{t('changeTheme')}</Title>
      <ThemeSwitch from="settings" />
    </Box>
  );
}
