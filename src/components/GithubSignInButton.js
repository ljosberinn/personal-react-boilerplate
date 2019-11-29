import React from 'react';
import { Button } from 'rbx';
import { button } from './SignInButton.module.scss';
import { useIdentityContext } from 'react-netlify-identity';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Icon from './Icon';

export default function GithubSignInButton() {
  const { loginProvider } = useIdentityContext();

  return (
    <Button
      type="button"
      onClick={() => loginProvider('github')}
      fullwidth
      className={button}
    >
      <Icon icon={faGithub} />
      <span>Sign in with GitHub</span>
    </Button>
  );
}
