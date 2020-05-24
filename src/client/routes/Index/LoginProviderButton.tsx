import { Button, ButtonGroup, Box, Code } from '@chakra-ui/core';
import React, { useState } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

import profileValidators from '../../../server/auth/provider/validators';
import { useAuth } from '../../context/AuthContext';
import { Provider } from '../../context/AuthContext/AuthContext';

interface LoginProviderButtonProps {
  provider: Provider;
}

export default function LoginProviderButton({
  provider,
}: LoginProviderButtonProps) {
  const { login, user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const validator = profileValidators[provider];

  async function handleRequestClick() {
    const start = Date.now();

    setLoading(true);

    let newResponse: object | null = null;

    try {
      const response = await fetch('/api/user/me');
      newResponse = await response.json();
    } catch (error) {
      console.error(error);
      newResponse = error;
    } finally {
      const diff = Date.now() - start;

      setTimeout(
        () => {
          setLoading(false);
          alert(JSON.stringify(newResponse));
        },
        diff >= 750 ? 0 : 750 - diff
      );
    }
  }

  return (
    <>
      <ButtonGroup>
        <Button
          type="button"
          variantColor="blue"
          onClick={isAuthenticated ? logout : () => login({ provider })}
        >
          {isAuthenticated ? (
            'Logout'
          ) : (
            <>
              Login via{' '}
              <Box ml={1} as={provider === 'google' ? FaGoogle : FaGithub} />
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          variantColor="grey"
          onClick={handleRequestClick}
          isLoading={loading}
        >
          auth-protected request to{' '}
          <Code ml={2} fontSize="1rem">
            /api/user/me
          </Code>
        </Button>
      </ButtonGroup>
      <br />
      profile:{' '}
      <Code w="100%" d="block" wordBreak="break-all">
        {user && validator(user)
          ? JSON.stringify(user)
          : `not authenticated via ${provider}`}
      </Code>
    </>
  );
}
