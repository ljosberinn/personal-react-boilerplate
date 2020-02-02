import { Content, Column } from 'rbx';
import React from 'react';

import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';

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
