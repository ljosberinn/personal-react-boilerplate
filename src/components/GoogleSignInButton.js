import React from 'react';
import { Button, Icon } from 'rbx';
import { button } from './SignInButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';
import { useIdentityContext } from 'react-netlify-identity';
import LogRocket from 'logrocket';

/**
 * @returns {React.FC} GoogleSignInButton
 */
export default function GoogleSignInButton() {
  const { loginProvider } = useIdentityContext();

  async function handleLogin() {
    const user = await loginProvider('google');

    LogRocket.identify(user.id, {
      provider: 'google',
      createdAt: user.created_at,
      confirmedAt: user.confirmed_at,
    });
  }

  return (
    <Button type="button" onClick={handleLogin} fullwidth className={button}>
      <Icon>
        <GoogleSvg />
      </Icon>
      <span>Sign in with Google</span>
    </Button>
  );
}
