import PropTypes from 'prop-types';
import { Navbar } from 'rbx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';

import { REPO_LINK } from '../constants/env';
import ExternalLink from './ExternalLink';
import Icon from './Icon';

export default function GithubLink({ from }) {
  const { t } = useTranslation('navigation');

  if (!REPO_LINK) {
    return null;
  }

  if (from === 'nav') {
    return (
      <Navbar.Item target="_blank" rel="noopener noreferrer" href={REPO_LINK}>
        <Icon svg={FaGithub} />
        <span>{t('contribute')}</span>
      </Navbar.Item>
    );
  }

  return (
    <li>
      <ExternalLink href={REPO_LINK}>
        <Icon svg={FaGithub} />
        <span>{t('contribute')}</span>
      </ExternalLink>
    </li>
  );
}

GithubLink.propTypes = {
  from: PropTypes.oneOf(['footer', 'nav']).isRequired,
};
