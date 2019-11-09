import React from 'react';
import { Content, Title } from 'rbx';
import ChangeTheme from './ChangeTheme';

export default function SiteSettings() {
  return (
    <Content>
      <Title as="h2">Site Settings</Title>

      <ChangeTheme />
    </Content>
  );
}
