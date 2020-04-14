import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Box,
  Image,
  Button,
  Icon,
} from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt } from 'react-icons/fa';

import { useAuth0 } from '../../../../hooks/useAuth0';
import { useNavigation } from '../../../../hooks/useNavigation';

export default function Authenticated() {
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
        <Icon name="chevron-down" ml={2} />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Account">
          <MenuItem
            as={PreloadingLink}
            {...{ to: SETTINGS_ACCOUNT }}
            data-testid="link-account-settings"
          >
            <Box as={SETTINGS_ACCOUNT.icon} mr={2} /> {t('my-account')}
          </MenuItem>
          <MenuItem
            as={PreloadingLink}
            {...{ to: SETTINGS_SITE }}
            data-testid="link-site-settings"
          >
            <Box as={SETTINGS_SITE.icon} mr={2} /> {t('settings')}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem onClick={handleLogout} data-testid="logout">
          <Box as={FaSignOutAlt} mr={2} /> {t('logout')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
