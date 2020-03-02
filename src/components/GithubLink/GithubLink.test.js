import React from 'react';

import { REPO_LINK } from '../../constants/env';
import render from '../../utils/testUtils';

import GithubLink, { validOrigins } from '.';

describe('<GithubLink />', () => {
  validOrigins.forEach(origin => {
    it('should render without crashing', () => {
      render(<GithubLink from={origin} />);
    });

    if (REPO_LINK) {
      it('should contain the Github logo', () => {
        const { getByTestId } = render(<GithubLink from={origin} />);

        expect(getByTestId('github-link-svg')).toBeInTheDocument();
      });
    } else {
      it('should return null without a link via env', () => {
        const { container } = render(<GithubLink from={origin} />);

        expect(container.innerHTML).toBe('');
      });
    }
  });
});
