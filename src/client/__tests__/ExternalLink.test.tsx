import { render, screen, testA11Y, validateHtml } from '../../../testUtils';
import type { ExternalLinkProps } from '../components/ExternalLink';
import { ExternalLink } from '../components/ExternalLink';

const defaultProps: ExternalLinkProps = {
  children: 'test',
  href: '//github.com/ljosberinn',
};

describe('<ExternalLink />', () => {
  it('passes a11y test given default props', async () => {
    await testA11Y(<ExternalLink {...defaultProps} />);
  });

  it('contains valid html', () => {
    validateHtml(<ExternalLink {...defaultProps} />);
  });

  it('has a default icon after its text', () => {
    const { container } = render(<ExternalLink {...defaultProps} />);

    const link = screen.getByRole('link');
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg!.parentElement).toBe(link);
  });

  it('optionally omits its default icon after its text', () => {
    const { container } = render(<ExternalLink {...defaultProps} omitIcon />);

    expect(container.querySelector('svg')).toBeNull();
  });
});
