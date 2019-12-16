import React from 'react';
import { Content, Title, Column } from 'rbx';
import ChangeTheme from './ChangeTheme';
import ChangeLanguage from './ChangeLanguage';
import { useTranslation } from 'react-i18next';

export default function SiteSettings() {
  const { t } = useTranslation('settings');

  return (
    <Content>
      <Column.Group centered>
        <Column size="half">
          <ChangeLanguage />
        </Column>

        <Column size="half">
          <ChangeTheme />
        </Column>
      </Column.Group>
    </Content>
  );
}
