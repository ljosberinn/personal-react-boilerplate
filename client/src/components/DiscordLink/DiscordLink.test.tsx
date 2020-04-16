import * as React from 'react';
import { FaDiscord } from 'react-icons/fa';

import { DISCORD_LINK } from '../../constants/env';
import { render } from '../../testUtils';
import DiscordLink from './DiscordLink';

describe('<DiscordLink />', () => {
  it('should render without crashing', () => {
    render(<DiscordLink />);
  });

  if (DISCORD_LINK) {
    it('should render as anchor tag', () => {
      const { container } = render(<DiscordLink />);

      expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('should link to env.DISCORD_LINK', () => {
      const { container } = render(<DiscordLink />);

      expect(container.querySelector('a')!.getAttribute('href')).toBe(
        DISCORD_LINK
      );
    });

    it('should be accompanied by the Discord icon', () => {
      const { container } = render(<DiscordLink />);

      const { container: iconContainer } = render(<FaDiscord />);

      expect(container.querySelector('svg path')).toStrictEqual(
        iconContainer.querySelector('path')
      );
    });
  }
});
