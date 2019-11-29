import React from 'react';
import { Button, Icon } from 'rbx';
import { button } from './SignInButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';
import { useIdentityContext } from 'react-netlify-identity';

export default function GoogleSignInButton() {
  const { loginProvider } = useIdentityContext();

  return (
    <Button
      type="button"
      onClick={() => loginProvider('google')}
      fullwidth
      className={button}
    >
      <Icon>
        <GoogleSvg />
      </Icon>
      <span>Sign in with Google</span>
    </Button>
  );
}
