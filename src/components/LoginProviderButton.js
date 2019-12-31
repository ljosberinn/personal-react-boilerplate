import React from 'react';
import { Button } from 'rbx';
import Icon from './Icon';
import { button } from './LoginProviderButton.module.scss';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useIdentityContext } from 'react-netlify-identity';
import { upperCaseFirstCharacter } from '../utils';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks';

/**
 * @returns {React.FC<{
 * provider: 'google' | 'github'
 * }>} LoginProviderButton
 */
export default function LoginProviderButton({ provider }) {
  const { loginProvider } = useIdentityContext(provider);
  const { t } = useTranslation('registration');
  const { theme } = useTheme();

  return (
    <Button
      type="button"
      color={theme === 'light' ? 'info' : 'success'}
      onClick={() => loginProvider(provider)}
      fullwidth
      className={button}
    >
      <Icon icon={provider === 'google' ? faGoogle : faGithub} />{' '}
      <span>
        {t('sign-in-via-provider', {
          provider: upperCaseFirstCharacter(provider),
        })}
      </span>
    </Button>
  );
}
