import { Column } from 'rbx';
import React from 'react';

import { ENABLED_PROVIDER } from '../constants/env';

import LoginProviderButton from './LoginProviderButton';
import styles from './LoginProviderGroup.module.scss';

export default function LoginProviderGroup() {
  return (
    <Column.Group multiline>
      {ENABLED_PROVIDER.map(provider => (
        <Column key={provider} className={styles.column}>
          <LoginProviderButton provider={provider} />
        </Column>
      ))}
    </Column.Group>
  );
}
