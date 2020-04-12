import { SimpleGrid, Box, Text } from '@chakra-ui/core';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { PROJECT_NAME } from '../../../constants/env';
import { useNavigation } from '../../../hooks/useNavigation';
import { RouteDefinition } from '../../../routes';
import { CustomIcon } from '../../CustomIcon';
import { DiscordLink } from '../../DiscordLink';
import { ExternalLink } from '../../ExternalLink';
import { GithubLink } from '../../GithubLink';

export default function Desktop() {
  const { t } = useTranslation();
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
              <Heading>{t('legal')}</Heading>
              <Link to={PRIVACY_POLICY} />
              <Link to={TOS} />
            </Box>
            <Box>
              <Heading>{t('links')}</Heading>
              <GithubLink />
              <DiscordLink />
            </Box>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </footer>
  );
}

function Link({ to }: { to: RouteDefinition }) {
  const { t } = useTranslation();
  const { PreloadingLink } = useNavigation();

  return (
    <Text mt={1} mb={1}>
      <PreloadingLink to={to}>
        <CustomIcon icon={to.icon} mr={2} />
        <Box as="span">{t(to.title as string)}</Box>
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
