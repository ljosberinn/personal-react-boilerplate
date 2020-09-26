import { screen, render, testA11Y, validateHtml } from '../../../testUtils';
import { InternalLink } from '../components/InternalLink';

describe('<InternalLink />', () => {
  it('passes a11y test given default props', async () => {
    await testA11Y(<InternalLink href="/docs">Docs</InternalLink>);
  });

  it('contains valid html', () => {
    validateHtml(<InternalLink href="/docs">Docs</InternalLink>, {
      htmlValidate: {
        rules: {
          // off due to the mock above nesting a in a
          'element-permitted-content': 'off',
        },
      },
    });
  });

  it('has aria-current="page" if href matches current pathname', () => {
    const pathname = '/docs';

    render(<InternalLink href={pathname}>Docs</InternalLink>, {
      router: {
        pathname,
      },
    });

    expect(screen.getByRole('link')).toHaveAttribute('aria-current');
  });

  it('does not have aria-current="page" if href matches does not match pathname', () => {
    render(<InternalLink href="/docs">Docs</InternalLink>);

    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });
});
