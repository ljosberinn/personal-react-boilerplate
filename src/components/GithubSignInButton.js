import React from 'react';
import { Button } from 'rbx';
import { button } from './SignInButton.module.scss';
import { useIdentityContext } from 'react-netlify-identity';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Icon from './Icon';
import LogRocket from 'logrocket';

/**
 * @returns {React.FC} GithubSignInButton
 */
export default function GithubSignInButton() {
  const { loginProvider } = useIdentityContext();

  async function handleLogin() {
    const user = await loginProvider('github');

    LogRocket.identify(user.id, {
      provider: 'github',
      createdAt: user.created_at,
      confirmedAt: user.confirmed_at,
    });
  }

  return (
    <Button type="button" onClick={handleLogin} fullwidth className={button}>
      <Icon icon={faGithub} />
      <span>Sign in with GitHub</span>
    </Button>
  );
}
