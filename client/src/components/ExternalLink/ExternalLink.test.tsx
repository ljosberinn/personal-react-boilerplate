import * as React from 'react';

import { render } from '../../testUtils';
import ExternalLink from './ExternalLink';

const defaultProps = { href: '//gerritalex.de' };

describe('<ExternalLink />', () => {
  it('should render without crasihng', () => {
    render(<ExternalLink {...defaultProps} />, { includeTranslation: false });
  });

  it('should have target="_blank" as default', () => {
    const { queryByText } = render(
      <ExternalLink {...defaultProps}>test</ExternalLink>,
      { includeTranslation: false }
    );

    const link = queryByText(/test/) as HTMLAnchorElement;

    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('should allow overriding target default', () => {
    const { queryByText } = render(
      <ExternalLink {...defaultProps} target={undefined}>
        test
      </ExternalLink>,
      { includeTranslation: false }
    );

    const link = queryByText(/test/) as HTMLAnchorElement;

    expect(link.getAttribute('target')).toBe(null);
  });

  it('should have rel="noreferrer noopener" as default', () => {
    const { queryByText } = render(
      <ExternalLink {...defaultProps}>test</ExternalLink>,
      { includeTranslation: false }
    );

    const link = queryByText(/test/) as HTMLAnchorElement;

    expect(link.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('should allow overriding rel defaults', () => {
    const { queryByText } = render(
      <ExternalLink {...defaultProps} rel={undefined}>
        test
      </ExternalLink>,
      { includeTranslation: false }
    );

    const link = queryByText(/test/) as HTMLAnchorElement;

    expect(link.getAttribute('rel')).toBe(null);
  });
});
