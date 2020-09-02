import {
  render,
  screen,
  userEvent,
  testA11Y,
  validateHtml,
} from '../../../testUtils';
import type { WebShareButtonProps } from '../components/WebShareButton';
import { WebShareButton } from '../components/WebShareButton';

const defaultProps: WebShareButtonProps = {
  'aria-label': 'test-label',
};

describe('<WebShareButton /> without support', () => {
  it('renders nothing', () => {
    render(<WebShareButton {...defaultProps} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('<WebShareButton />', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: jest.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  });

  it('passes a11y test', async () => {
    await testA11Y(<WebShareButton {...defaultProps} />);
  });

  it('contains valid html', () => {
    validateHtml(<WebShareButton {...defaultProps} />);
  });

  it('renders an icon as only child', () => {
    render(<WebShareButton {...defaultProps} />);

    const button = screen.getByRole('button');

    expect(button.children).toHaveLength(1);
    expect(button.firstChild).toBeInstanceOf(SVGSVGElement);
  });

  it('calls the navigator.share API onClick', () => {
    render(<WebShareButton {...defaultProps} />);

    userEvent.click(screen.getByRole('button'));

    expect(navigator.share).toHaveBeenCalledTimes(1);
  });

  it('calls the navigator.share API with given title', () => {
    render(<WebShareButton {...defaultProps} />);

    userEvent.click(screen.getByRole('button'));

    expect(navigator.share).toHaveBeenCalledWith({
      text: undefined,
      title: undefined,
      url: expect.any(String),
    });
  });

  it('calls the navigator.share API with default url', () => {
    render(<WebShareButton {...defaultProps} />);

    userEvent.click(screen.getByRole('button'));

    expect(navigator.share).toHaveBeenCalledWith({
      text: undefined,
      title: undefined,
      url: window.location.origin,
    });
  });

  it('calls the navigator.share API with given values', () => {
    const shareData: ShareData = {
      text: 'next-karma',
      title: 'next-karma',
      url: 'https://github.com/ljosberinn/next-karma',
    };

    render(<WebShareButton {...defaultProps} {...shareData} />);

    userEvent.click(screen.getByRole('button'));

    expect(navigator.share).toHaveBeenCalledWith(shareData);
  });
});
