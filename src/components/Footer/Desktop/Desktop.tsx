import { SimpleGrid, Box, Text } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';

import { PROJECT_NAME } from '../../../constants/env';
import { useNavigation } from '../../../hooks/useNavigation';
import { RouteDefinition } from '../../../routes';
import { ExternalLink } from '../../ExternalLink';
import { ThemeSwitch } from '../../ThemeSwitch';

export default function Desktop() {
  const {
    routes: { PRIVACY_POLICY, TOS },
  } = useNavigation();

  return (
    <footer>
      <SimpleGrid columns={2} spacing={8} p={4}>
        <Box>
          <Text>
            The personal React boilerplate of{' '}
            <ExternalLink href="//github.com/ljosberinn">
              ljosberinn
            </ExternalLink>
          </Text>
          <Text>
            MIT <ExternalLink href="//gerritalex.de">Gerrit Alex</ExternalLink>
          </Text>
        </Box>
        <Box>
          <SimpleGrid columns={3} spacing={10}>
            <Box>
              <Heading>{PROJECT_NAME}</Heading>
            </Box>
            <Box>
              <Heading>Legal</Heading>
              <Link to={PRIVACY_POLICY} />
              <Link to={TOS} />
            </Box>
            <Box>
              <Heading>Other</Heading>
              <ThemeSwitch />
            </Box>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </footer>
  );
}

function Link({ to }: { to: RouteDefinition }) {
  const { PreloadingLink } = useNavigation();

  return (
    <Text mt={1} mb={1}>
      <PreloadingLink to={to}>
        <Box display="inline-block" as={to.icon} />{' '}
        <Box as="span" ml={2}>
          {to.title}
        </Box>
      </PreloadingLink>
    </Text>
  );
}

function Heading({ children }: PropsWithChildren<{}>) {
  return (
    <Text fontWeight="bold" pb={5}>
      {children}
    </Text>
  );
}
