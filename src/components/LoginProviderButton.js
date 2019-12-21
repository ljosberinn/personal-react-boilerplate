import React from 'react';
import { Button, Icon as RBXIcon } from 'rbx';
import Icon from './Icon';
import { button } from './LoginProviderButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useIdentityContext } from 'react-netlify-identity';
import { upperCaseFirstCharacter } from '../utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('registration');

  return (
    <Button
      type="button"
      onClick={() => loginProvider(provider)}
      fullwidth
      className={button}
    >
      {iconMap[provider]}{' '}
      <span>
        {t('sign-in-via-provider', {
          provider: upperCaseFirstCharacter(provider),
        })}
      </span>
    </Button>
  );
}
