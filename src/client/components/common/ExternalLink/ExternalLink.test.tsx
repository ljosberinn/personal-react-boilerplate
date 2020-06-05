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

  it('should have target="_blank" as default', () => {
    const { getByRole } = render(<ExternalLink {...defaultProps} />);

    expect(getByRole('link').getAttribute('target')).toBe('_blank');
  });

  it('should allow overriding target default', () => {
    const { getByRole } = render(
      <ExternalLink {...defaultProps} target={undefined} />
    );

    expect(getByRole('link').getAttribute('target')).toBe(null);
  });

  it('should have rel="noreferrer noopener" as default', () => {
    const { getByRole } = render(<ExternalLink {...defaultProps} />);

    expect(getByRole('link').getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('should allow overriding rel defaults', () => {
    const { getByRole } = render(
      <ExternalLink {...defaultProps} rel={undefined} />
    );

    expect(getByRole('link').getAttribute('rel')).toBe(null);
  });

  it('should optionally render an icon after its text', () => {
    const { getByRole } = render(<ExternalLink {...defaultProps} withIcon />);

    const link = getByRole('link');
    const svg = getByRole('presentation');

    expect(svg).toBeInTheDocument();
    expect(svg.parentElement).toBe(link);
  });
});
