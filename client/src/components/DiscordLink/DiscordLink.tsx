import React from 'react';
import { FaDiscord } from 'react-icons/fa';

import { DISCORD_LINK } from '../../constants/env';
import { CustomIcon } from '../CustomIcon';
import { ExternalLink } from '../ExternalLink';

export default function DiscordLink() {
  if (!DISCORD_LINK) {
    return null;
  }

  return (
    <ExternalLink href={DISCORD_LINK} withIcon={false}>
      <CustomIcon icon={FaDiscord} mr={1} />
      Community
    </ExternalLink>
  );
}
