import React from 'react';
import { Content, Title, Column, Box } from 'rbx';
import ChangeTheme from './ChangeTheme';
import ChangeLanguage from './ChangeLanguage';
import { useTranslation } from 'react-i18next';

export default function SiteSettings() {
  const { t } = useTranslation('settings');

  return (
    <Content>
      <Box>
        <Title as="h2">{t('siteSettings')}</Title>
      </Box>

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
