import { Button } from 'rbx';
import React from 'react';

import { ENABLED_PROVIDER } from '../../constants/env';
import LoginProviderButton from './LoginProviderButton';
import styles from './LoginProviderGroup.module.scss';

export default function LoginProviderGroup() {
  return (
    <Button.Group className={styles.buttons}>
      {ENABLED_PROVIDER.map(provider => (
        <LoginProviderButton provider={provider} key={provider} />
      ))}
    </Button.Group>
  );
}
