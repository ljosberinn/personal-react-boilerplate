import React from 'react';
import { Title } from 'rbx';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../../../../components';

export default function ChangeLanguage() {
  const { t } = useTranslation('settings');

  return (
    <>
      <Title as="h3">{t('changeLanguage')}</Title>
      <LanguageSwitch from="settings" />
    </>
  );
}
