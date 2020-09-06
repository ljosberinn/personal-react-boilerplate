import type { LinkProps } from 'next/link';
import { cloneElement as mockCloneElement } from 'react';

import type { WithChildren } from '../../../karma/client/Karma';
import { screen, render, testA11Y, validateHtml } from '../../../testUtils';
import { createUseRouterMock } from '../../../testUtils/router';
import type { InternalLinkProps } from '../components/InternalLink';
import { InternalLink } from '../components/InternalLink';

jest.mock('next/link', () => {
  const nextLink = jest.requireActual('next/link');

  return {
    ...nextLink,
    default: ({
      as,
      passHref,
      prefetch,
      replace,
      scroll,
      shallow,
      children,
      ...rest
    }: Omit<LinkProps, 'href'> & WithChildren & { href: string }) => (
      // @ts-expect-error guaranteed valid children in this test
      <div data-testid="next-link">{mockCloneElement(children, rest)}</div>
    ),
  };
});

const defaultProps: InternalLinkProps = {
  children: 'Docs',
  href: '/docs',
};

describe('<InternalLink />', () => {
  it('passes a11y test given default props', async () => {
    createUseRouterMock();

    await testA11Y(<InternalLink {...defaultProps} />);
  });

  it('contains valid html', () => {
    createUseRouterMock();

    validateHtml(<InternalLink {...defaultProps} />, {
      htmlValidate: {
        rules: {
          // off due to the mock above nesting a in a
          'element-permitted-content': 'off',
        },
      },
    });
  });

  it('has aria-current="page" if href matches current pathname', () => {
    createUseRouterMock({
      pathname: defaultProps.href as string,
    });

    render(<InternalLink {...defaultProps} />);

    expect(screen.getByRole('link')).toHaveAttribute('aria-current');
  });

  it('does not have aria-current="page" if href matches does not match pathname', () => {
    createUseRouterMock();

    render(<InternalLink {...defaultProps} />);

    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });
});
