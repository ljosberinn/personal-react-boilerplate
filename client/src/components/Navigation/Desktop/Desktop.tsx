import {
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  MenuDivider,
  MenuGroup,
  Box,
} from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

import { PROJECT_NAME } from '../../../constants/env';
import { useAuth0 } from '../../../hooks/useAuth0';
import { useNavigation } from '../../../hooks/useNavigation';
import { LanguageSwitch } from '../../LanguageSwitch';
import { ThemeSwitch } from '../../ThemeSwitch';

export default function Desktop() {
  const { isAuthenticated } = useAuth0();
  const {
    PreloadingLink,
    routes: { DASHBOARD, INDEX },
  } = useNavigation();

  return (
    <Flex justify="space-between" px={4} py={4}>
      <Flex align="start">
        <PreloadingLink to={isAuthenticated ? DASHBOARD : INDEX}>
          {PROJECT_NAME}
        </PreloadingLink>
      </Flex>
      <Flex align="end">
        <ThemeSwitch />
        <LanguageSwitch ml={2} mr={2} />
        {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
      </Flex>
    </Flex>
  );
}

function Authenticated() {
  const { t } = useTranslation();
  const { user, logout } = useAuth0();
  const {
    PreloadingLink,
    routes: { SETTINGS_ACCOUNT, SETTINGS_SITE },
  } = useNavigation();

  function handleLogout() {
    logout();
  }

  return (
    <Menu>
      <MenuButton as={Button}>
        {user?.picture && (
          <Image
            size={6}
            rounded="full"
            src={user.picture}
            alt={user?.name}
            mr={3}
          />
        )}
        <span>{user?.name}</span>
      </MenuButton>
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem as={PreloadingLink} {...{ to: SETTINGS_ACCOUNT }}>
            <Box as={SETTINGS_ACCOUNT.icon} mr={2} /> {t('my-account')}
          </MenuItem>
          <MenuItem as={PreloadingLink} {...{ to: SETTINGS_SITE }}>
            <Box as={SETTINGS_SITE.icon} mr={2} /> {t('settings')}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem onClick={handleLogout}>
          <Box as={FaSignOutAlt} mr={2} /> {t('logout')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function Unauthenticated() {
  const { t } = useTranslation();
  const { loginWithPopup } = useAuth0();

  return (
    <Button ml={2} onClick={loginWithPopup}>
      <Box as={FaSignInAlt} mr={2} /> {t('login')}
    </Button>
  );
}
