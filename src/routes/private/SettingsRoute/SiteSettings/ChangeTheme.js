import React from 'react';
import { Title } from 'rbx';
import { ThemeSwitch } from '../../../../components';

export default function ChangeTheme() {
  return (
    <>
      <Title as="h3">Change Theme</Title>
      <ThemeSwitch from="settings" />
    </>
  );
}
