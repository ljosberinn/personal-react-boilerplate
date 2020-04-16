import { Flex } from '@chakra-ui/core';
import * as React from 'react';

import { lg } from '../../constants/breakpoints';
import { PROJECT_NAME } from '../../constants/env';
import { useAuth0 } from '../../hooks/useAuth0';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useNavigation } from '../../hooks/useNavigation';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';

export default function Navigation() {
  const breakpoint = useBreakpoint();
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
        {breakpoint === lg.name ? <Desktop /> : <Mobile />}
      </Flex>
    </Flex>
  );
}
