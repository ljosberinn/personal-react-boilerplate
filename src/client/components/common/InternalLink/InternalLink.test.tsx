import React from 'react';

import { render, testA11Y } from '../../../../../testUtils';

import { InternalLink, InternalLinkProps } from '.';

const defaultProps: InternalLinkProps = {
  children: 'Docs',
  href: '/docs',
};

describe('<InternalLink />', () => {
  it('renders without crashing given default props', () => {
    render(<InternalLink {...defaultProps} />);
  });

  it('passes a11y test', async () => {
    await testA11Y(<InternalLink {...defaultProps} />);
  });
});
