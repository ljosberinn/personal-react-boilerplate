import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import ExternalLink from '.';

const defaultProps = { href: '//gerritalex.de' };

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => (
  <ExternalLink {...rest} />
);

describe('<ExternalLink />', () => {
  it('should render without crasihng', () => {
    render(<Intercepti18n {...defaultProps} />);
  });

  it('should have target="_blank" as default', () => {
    const { queryByText } = render(
      <Intercepti18n {...defaultProps}>test</Intercepti18n>,
    );

    const link = queryByText(/test/);

    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('should allow overriding target default', () => {
    const { queryByText } = render(
      <Intercepti18n {...defaultProps} target={undefined}>
        test
      </Intercepti18n>,
    );

    const link = queryByText(/test/);

    expect(link.getAttribute('target')).toBe(null);
  });

  it('should have rel="noreferrer noopener" as default', () => {
    const { queryByText } = render(
      <Intercepti18n {...defaultProps}>test</Intercepti18n>,
    );

    const link = queryByText(/test/);

    expect(link.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('should allow overriding rel defaults', () => {
    const { queryByText } = render(
      <Intercepti18n {...defaultProps} rel={undefined}>
        test
      </Intercepti18n>,
    );

    const link = queryByText(/test/);

    expect(link.getAttribute('rel')).toBe(null);
  });
});
