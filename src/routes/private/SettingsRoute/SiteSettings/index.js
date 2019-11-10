import React from 'react';
import { Content, Title, Column } from 'rbx';
import ChangeTheme from './ChangeTheme';
import ChangeLanguage from './ChangeLanguage';
import { useTranslation } from 'react-i18next';

export default function SiteSettings() {
  const { t } = useTranslation('settings');

  return (
    <Content>
      <Title as="h2">{t('siteSettings')}</Title>

      <Column.Group centered>
        <Column size={6}>
          <ChangeLanguage />
        </Column>

        <Column>
          <ChangeTheme />
        </Column>
      </Column.Group>
    </Content>
  );
}
