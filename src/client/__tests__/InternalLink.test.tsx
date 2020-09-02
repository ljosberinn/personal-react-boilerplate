import type { WithChildren } from '../../../karma/client/Karma';
import { testA11Y, validateHtml } from '../../../testUtils';
import type { InternalLinkProps } from '../components/InternalLink';
import { InternalLink } from '../components/InternalLink';

jest.mock('next/link', () => {
  const nextLink = jest.requireActual('next/link');

  return {
    ...nextLink,
    default: ({ children }: WithChildren) => children,
  };
});

const defaultProps: InternalLinkProps = {
  children: 'Docs',
  href: '/docs',
};

describe('<InternalLink />', () => {
  it('passes a11y test given default props', async () => {
    await testA11Y(<InternalLink {...defaultProps} />);
  });

  it('contains valid html', () => {
    validateHtml(<InternalLink {...defaultProps} />);
  });
});
