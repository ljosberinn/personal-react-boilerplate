import { Button } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';

import { ENABLED_PROVIDER } from '../../constants/env';
import { useTheme } from '../../context';
import { upperCaseFirstCharacter } from '../../utils';
import Icon from '../Icon';
import styles from './LoginProviderGroup.module.scss';

export default function LoginProviderGroup() {
  const { loginProvider } = useIdentityContext();
  const { t } = useTranslation('registration');
  const { theme } = useTheme();

  return (
    <Button.Group className={styles.buttons}>
      {ENABLED_PROVIDER.map(provider => (
        <Button
          type="button"
          color={theme === 'light' ? 'info' : undefined}
          onClick={() => loginProvider(provider)}
          fullwidth
          key={provider}
        >
          <Icon
            svg={provider === 'github' ? FaGithub : FaGoogle}
            className={styles.icon}
          />
          <span>
            {t('signInViaProvider', {
              provider: upperCaseFirstCharacter(provider),
            })}
          </span>
        </Button>
      ))}
    </Button.Group>
  );
}
