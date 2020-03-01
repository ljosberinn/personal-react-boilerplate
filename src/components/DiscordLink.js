import PropTypes from 'prop-types';
import { Navbar } from 'rbx';
import React from 'react';
import { FaDiscord } from 'react-icons/fa';

import { DISCORD_LINK } from '../constants/env';
import Icon from './Icon';

export default function DiscordLink({ from }) {
  if (!DISCORD_LINK) {
    return null;
  }

  const content = (
    <>
      <Icon svg={FaDiscord} />
      <span>Discord</span>
    </>
  );

  if (from === 'nav') {
    return (
      <Navbar.Item
        target="_blank"
        rel="noopener noreferrer"
        href={DISCORD_LINK}
      >
        {content}
      </Navbar.Item>
    );
  }

  return <li>{content}</li>;
}

DiscordLink.propTypes = {
  from: PropTypes.oneOf(['nav', 'footer']).isRequired,
};
