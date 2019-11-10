import React from 'react';
import { Title } from 'rbx';
import { ThemeSwitch } from '../../../../components';
import { useTranslation } from 'react-i18next';

export default function ChangeTheme() {
  const { t } = useTranslation('settings');

  return (
    <>
      <Title as="h3">{t('changeTheme')}</Title>
      <ThemeSwitch from="settings" />
    </>
  );
}
