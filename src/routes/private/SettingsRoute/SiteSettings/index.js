import React from 'react';
import { Content, Column } from 'rbx';
import ChangeTheme from './ChangeTheme';
import ChangeLanguage from './ChangeLanguage';

/**
 * @returns {React.FC} SiteSettings
 */
export default function SiteSettings() {
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
