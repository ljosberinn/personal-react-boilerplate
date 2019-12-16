import React from 'react';
import { Title } from 'rbx';
import { LanguageSwitch } from '../../../../components';
import { useTranslation } from 'react-i18next';

export default function ChangeLanguage() {
  const { t } = useTranslation('settings');

  return (
    <>
      <Title as="h3">{t('changeLanguage')}</Title>
      <LanguageSwitch from="settings" />
    </>
  );
}
