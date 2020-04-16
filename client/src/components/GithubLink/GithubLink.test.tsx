import * as React from 'react';
import { FaGithub } from 'react-icons/fa';

import { REPO_LINK } from '../../constants/env';
import { render } from '../../testUtils';
import GithubLink from './GithubLink';

describe('<GithubLink />', () => {
  it('should render without crashing', () => {
    render(<GithubLink />);
  });

  if (!REPO_LINK) {
    it('should render as anchor tag', () => {
      const { container } = render(<GithubLink />);

      expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('should link to env.REPO_LINK', () => {
      const { container } = render(<GithubLink />);

      expect(container.querySelector('a')!.getAttribute('href')).toBe(
        REPO_LINK
      );
    });

    it('should be accompanied by the Github icon', () => {
      const { container } = render(<GithubLink />);

      const { container: iconContainer } = render(<FaGithub />);

      expect(container.querySelector('svg path')).toStrictEqual(
        iconContainer.querySelector('path')
      );
    });
  }
});
