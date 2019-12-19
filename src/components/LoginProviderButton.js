import React from 'react';
import { Button, Icon as RBXIcon } from 'rbx';
import Icon from './Icon';
import { button } from './LoginProviderButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useIdentityContext } from 'react-netlify-identity';
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

  return (
    <Button
      type="button"
      onClick={() => loginProvider('google')}
      fullwidth
      className={button}
    >
      {iconMap[provider]}{' '}
      <span>Sign in with {upperCaseFirstCharacter(provider)}</span>
    </Button>
  );
}
