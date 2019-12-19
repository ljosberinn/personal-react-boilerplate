import React from 'react';
import { Button, Icon as RBXIcon } from 'rbx';
import Icon from './Icon';
import { button } from './LoginProviderButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useIdentityContext } from 'react-netlify-identity';
import LogRocket from 'logrocket';
import { upperCaseFirstCharacter } from '../utils';

const iconMap = {
  google: (
    <RBXIcon>
      <GoogleSvg />
    </RBXIcon>
  ),
  github: <Icon icon={faGithub} />,
};

/**
 * @returns {React.FC<{
 * provider: 'google' | 'github'
 * }>} LoginProviderButton
 */
export default function LoginProviderButton({ provider }) {
  const { loginProvider } = useIdentityContext(provider);

  function handleLogin() {
    const { id, created_at, confirmed_at } = loginProvider('google');

    LogRocket.identify(id, {
      provider,
      created_at,
      confirmed_at,
    });
  }

  return (
    <Button type="button" onClick={handleLogin} fullwidth className={button}>
      {iconMap[provider]}{' '}
      <span>Sign in with {upperCaseFirstCharacter(provider)}</span>
    </Button>
  );
}
