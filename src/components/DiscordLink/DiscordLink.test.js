import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { DISCORD_LINK } from '../../constants/env';
import { render } from '../../utils/testUtils';

import DiscordLink, { validOrigins } from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<DiscordLink />', () => {
  validOrigins.forEach(origin => {
    it('should render without crashing', () => {
      render(<DiscordLink from={origin} />);
    });

    if (DISCORD_LINK) {
      it('should contain the Discord logo', () => {
        const { getByTestId } = render(<DiscordLink from={origin} />);

        expect(getByTestId('discord-link-svg')).toBeInTheDocument();
      });
    } else {
      it('should return null without a link via env', () => {
        const { container } = render(<DiscordLink from={origin} />);

        expect(container.innerHTML).toBe('');
      });
    }
  });
});
