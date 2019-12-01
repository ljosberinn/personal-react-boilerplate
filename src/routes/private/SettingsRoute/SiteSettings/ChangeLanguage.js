import React from 'react';
import { Title, Box } from 'rbx';
import { LanguageSwitch } from '../../../../components';
import { useTranslation } from 'react-i18next';

export default function ChangeLanguage() {
  const { t } = useTranslation('settings');

  return (
    <Box>
      <Title as="h3">{t('changeLanguage')}</Title>
      <LanguageSwitch from="settings" />
    </Box>
  );
}
