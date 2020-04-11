import React from 'react';
import { FaGithub } from 'react-icons/fa';

import { REPO_LINK } from '../../constants/env';
import { CustomIcon } from '../CustomIcon';
import { ExternalLink } from '../ExternalLink';

export default function GithubLink() {
  if (!REPO_LINK) {
    return null;
  }

  return (
    <ExternalLink href={REPO_LINK} withIcon={false}>
      <CustomIcon icon={FaGithub} mr={1} />
      Contribute
    </ExternalLink>
  );
}
