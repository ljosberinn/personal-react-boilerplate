import {
  Flex,
  Box,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Code,
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
} from '@chakra-ui/core';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React, {
  useState,
  useRef,
  MutableRefObject,
  FormEvent,
  useEffect,
} from 'react';
import {
  FaGithub,
  FaGoogle,
  FaFacebook,
  FaDiscord,
  FaSignInAlt,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

import { ENABLED_PROVIDER } from '../../../constants';
import { Provider } from '../../context/AuthContext/AuthContext';
import { useAuth } from '../../hooks/useAuth';

type ProviderIconMap = {
  [key in Provider]: IconType;
};

const providerIconMap: ProviderIconMap = {
  discord: FaDiscord,
  facebook: FaFacebook,
  github: FaGithub,
  google: FaGoogle,
  local: FaSignInAlt,
};

export default function AuthDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const { login, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setIsOpen(false);
    }
  }, [isAuthenticated, isOpen]);

  function toggle() {
    setIsOpen(!isOpen);
  }

  const providerButtonProps = {
    colorScheme: 'teal',
    width: ['initial', 'initial', '100%', '100%'],
  };

  return (
    <Flex
      justifyContent="space-between"
      flexDirection={['row', 'row', 'column', 'column']}
    >
      <Box>
        {isAuthenticated ? (
          <Button {...providerButtonProps} onClick={logout}>
            Logout
          </Button>
        ) : (
          <Menu>
            <MenuButton as={Button} {...providerButtonProps}>
              Choose an external provider
              <ChevronDownIcon ml={2} />
            </MenuButton>
            <MenuList>
              {ENABLED_PROVIDER.filter(provider => provider !== 'local').map(
                provider => (
                  <MenuItem
                    key={provider}
                    onClick={
                      isAuthenticated ? logout : () => login({ provider })
                    }
                  >
                    Login via{' '}
                    <Box as={providerIconMap[provider]} ml={2} mr={1} />
                    {provider.charAt(0).toUpperCase()}
                    {provider.slice(1)}
                  </MenuItem>
                )
              )}
            </MenuList>
          </Menu>
        )}

        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={toggle}
          onClose={toggle}
          placement="auto"
        >
          <PopoverTrigger>
            <Button
              d={['initial', 'initial', 'block', 'block']}
              ml={[2, 2, 0, 0]}
              mt={[0, 0, 2, 2]}
              width={['initial', 'initial', '100%', '100%']}
              colorScheme="teal"
              isDisabled={isAuthenticated}
            >
              or login via <Box d="inline" as={providerIconMap.local} mr={1} />{' '}
              your own API
            </Button>
          </PopoverTrigger>
          <PopoverContent zIndex={4} p={5}>
            <PopoverArrow bg="white" />
            <PopoverCloseButton />
            <Form firstFieldRef={firstFieldRef} onCancel={toggle} />
          </PopoverContent>
        </Popover>
      </Box>
      <Box mt={[0, 0, 2, 2]} mb={2}>
        <AuthenticatedDummyRequest />
      </Box>
    </Flex>
  );
}

interface FormProps {
  firstFieldRef: MutableRefObject<HTMLInputElement | null>;
  onCancel: () => void;
}

function Form({ firstFieldRef, onCancel }: FormProps) {
  const { login } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      await login({
        password: 'next-with-batteries!',
        username: 'ljosberinn',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack as="fieldset" spacing={4}>
        <Box as="legend">This showcase uses hardcoded credentials.</Box>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            ref={firstFieldRef}
            value="ljosberinn"
            isReadOnly
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            value="next-with-batteries!"
            isReadOnly
          />
        </FormControl>

        <ButtonGroup justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="teal">
            Login
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}

function AuthenticatedDummyRequest() {
  const [loading, setLoading] = useState(false);
  const count = useRef(0);

  async function handleRequestClick() {
    if (count.current >= 10) {
      // eslint-disable-next-line no-alert
      return alert("Sorry, you're doing this too often.");
    }

    count.current += 1;

    const start = Date.now();

    setLoading(true);

    let newResponse: object | null = null;

    try {
      const response = await fetch('/api/v1/user/me');
      newResponse = await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      newResponse = error;
    } finally {
      const diff = Date.now() - start;

      setTimeout(
        () => {
          setLoading(false);
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(newResponse));
        },
        diff >= 750 ? 0 : 750 - diff
      );
    }
  }

  return (
    <Button
      variant="outline"
      colorScheme="teal"
      width={['initial', '100%', '100%', 'initial']}
      onClick={handleRequestClick}
      isLoading={loading}
    >
      fire an auth-protected request to{' '}
      <Code ml={2} fontSize="1rem">
        /api/user/me
      </Code>
    </Button>
  );
}
