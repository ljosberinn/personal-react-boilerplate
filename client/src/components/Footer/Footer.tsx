import { SimpleGrid, Box, Text } from '@chakra-ui/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { PROJECT_NAME } from '../../constants/env';
import { useNavigation } from '../../hooks/useNavigation';
import { DiscordLink } from '../DiscordLink';
import { ExternalLink } from '../ExternalLink';
import { GithubLink } from '../GithubLink';
import { Heading } from './Heading';
import { Link } from './Link';

export default function Footer() {
  const { t } = useTranslation();
  const {
    routes: { PRIVACY_POLICY, TOS },
  } = useNavigation();

  return (
    <SimpleGrid as="footer" p={4} columns={[1, 1, 1, 2]} spacing={[8, 4, 4, 8]}>
      <Box>
        <Heading>{PROJECT_NAME}</Heading>
        <Text>
          The personal React boilerplate of{' '}
          <ExternalLink href="//github.com/ljosberinn">ljosberinn</ExternalLink>
        </Text>
        <Text>
          MIT <ExternalLink href="//gerritalex.de">Gerrit Alex</ExternalLink>
        </Text>
      </Box>
      <Box>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={[3, 3, 3, 6]}>
          <Box>
            <Heading>{t('legal')}</Heading>
            <Link to={PRIVACY_POLICY} />
            <Link to={TOS} />
          </Box>
          <Box>
            <Heading>{t('community')}</Heading>
            <GithubLink />
            <DiscordLink />
          </Box>
        </SimpleGrid>
      </Box>
    </SimpleGrid>
  );
}
