import { render, act, screen } from '../../../testUtils';
import { CustomPWAInstallPrompt } from '../components/CustomPWAInstallPrompt';

describe('<CustomPWAInstallPrompt />', () => {
  it('renders no UI by default', () => {
    render(<CustomPWAInstallPrompt />);

    // false positive
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders UI once "beforeinstallprompt" was dispatched', () => {
    render(<CustomPWAInstallPrompt />);

    act(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
    });

    // false positive
    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(screen.queryAllByRole('button')).not.toHaveLength(0);
  });
});
