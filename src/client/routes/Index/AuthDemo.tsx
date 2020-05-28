import {
  Flex,
  Box,
  Menu,
  MenuButton,
  Button,
  Icon,
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
import React, {
  useState,
  useRef,
  MutableRefObject,
  FormEvent,
  useEffect,
} from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { ENABLED_PROVIDER } from '../../../constants';
import { useAuth } from '../../hooks/useAuth';

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
    variantColor: 'teal',
    width: ['initial', '100%', '100%', 'initial'],
  };

  return (
    <Flex
      justifyContent="space-between"
      flexDirection={['row', 'column', 'column', 'row']}
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
              <Icon ml={2} name="chevron-down" />
            </MenuButton>
            <MenuList>
              {ENABLED_PROVIDER.map(provider => (
                <MenuItem
                  key={provider}
                  onClick={isAuthenticated ? logout : () => login({ provider })}
                >
                  Login via{' '}
                  <Box
                    as={provider === 'github' ? FaGithub : FaGoogle}
                    ml={2}
                    mr={1}
                  />
                  {provider.charAt(0).toUpperCase()}
                  {provider.substr(1)}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}

        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={toggle}
          onClose={toggle}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button
              d={['initial', 'block', 'block', 'initial']}
              ml={[2, 0, 0, 2]}
              mt={[0, 2, 2, 0]}
              width={['initial', '100%', '100%', 'initial']}
              variantColor="teal"
              isDisabled={isAuthenticated}
            >
              or login via your own API
            </Button>
          </PopoverTrigger>
          <PopoverContent zIndex={4} p={5}>
            <PopoverArrow bg="white" />
            <PopoverCloseButton />
            <Form firstFieldRef={firstFieldRef} onCancel={toggle} />
          </PopoverContent>
        </Popover>
      </Box>
      <Box mt={[0, 2, 2, 0]} mb={2}>
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const start = Date.now();
    setLoading(true);

    try {
      await login({
        password: 'next-with-batteries!',
        username: 'ljosberinn',
      });
    } catch (error) {
      console.error(error);
    } finally {
      const diff = Date.now() - start;

      setTimeout(
        () => {
          setLoading(false);
        },
        diff >= 750 ? 0 : 750 - diff
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack as="fieldset" spacing={4} {...{ disabled: loading }}>
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

        <ButtonGroup d="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variantColor="teal" isLoading={loading}>
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
      variantColor="teal"
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
