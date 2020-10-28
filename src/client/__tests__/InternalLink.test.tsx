import type { LinkProps } from 'next/link';

import { screen, render, testA11Y, validateHtml } from '../../../testUtils';
import { InternalLink } from '../components/InternalLink';

const ariaAttr = 'aria-current';
const pathname: LinkProps['href'] = 'docs';

const href: LinkProps['href'] = {
  pathname,
};

describe('<InternalLink />', () => {
  it('passes a11y test given default props', async () => {
    await testA11Y(<InternalLink href={pathname}>Docs</InternalLink>);
  });

  it('contains valid html', () => {
    validateHtml(<InternalLink href={pathname}>Docs</InternalLink>, {
      htmlValidate: {
        rules: {
          // off due to the mock above nesting a in a
          'element-permitted-content': 'off',
        },
      },
    });
  });

  describe(`${ariaAttr}`, () => {
    it(`has ${ariaAttr}="page" if href matches current pathname`, () => {
      render(<InternalLink href={pathname}>Docs</InternalLink>, {
        router: {
          pathname,
        },
      });

      expect(screen.getByRole('link')).toHaveAttribute(ariaAttr);
    });

    it(`has ${ariaAttr}="page" if href is an object and matches current pathname`, () => {
      render(<InternalLink href={href}>Docs</InternalLink>, {
        router: {
          pathname,
        },
      });

      expect(screen.getByRole('link')).toHaveAttribute(ariaAttr);
    });

    it(`does not have ${ariaAttr}="page" if href matches does not match pathname`, () => {
      render(<InternalLink href="/docs">Docs</InternalLink>);

      expect(screen.getByRole('link')).not.toHaveAttribute(ariaAttr);
    });
  });
});
