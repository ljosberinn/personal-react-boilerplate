import React from 'react';

import { render } from '../../../../../testUtils';
import ExternalLink, { ExternalLinkProps } from './ExternalLink';

const defaultProps: ExternalLinkProps = {
  children: 'test',
  href: '//github.com/ljosberinn',
};

describe('<ExternalLink />', () => {
  it('should render without crashing given default props', () => {
    render(<ExternalLink {...defaultProps} />);
  });

  it('should optionally render an icon after its text', () => {
    const { getByRole } = render(<ExternalLink {...defaultProps} withIcon />);

    const link = getByRole('link');
    const svg = getByRole('presentation');

    expect(svg).toBeInTheDocument();
    expect(svg.parentElement).toBe(link);
  });
});
