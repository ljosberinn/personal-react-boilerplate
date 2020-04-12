import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaDiscord } from 'react-icons/fa';

import { DISCORD_LINK } from '../../constants/env';
import { CustomIcon } from '../CustomIcon';
import { ExternalLink } from '../ExternalLink';

export default function DiscordLink() {
  const { t } = useTranslation();

  if (!DISCORD_LINK) {
    return null;
  }

  return (
    <ExternalLink href={DISCORD_LINK} withIcon={false}>
      <CustomIcon icon={FaDiscord} mr={1} />
      {t('discord-link')}
    </ExternalLink>
  );
}
