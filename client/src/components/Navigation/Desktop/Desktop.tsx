import { Flex } from '@chakra-ui/core';
import React from 'react';

import { PROJECT_NAME } from '../../../constants/env';
import { useAuth0 } from '../../../hooks/useAuth0';
import { useNavigation } from '../../../hooks/useNavigation';
import { LanguageSwitch } from '../../LanguageSwitch';
import { ThemeSwitch } from '../../ThemeSwitch';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

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
