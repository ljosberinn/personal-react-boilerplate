import { render, act, screen } from '../../../testUtils';
import { CustomPWAInstallPrompt } from '../components/CustomPWAInstallPrompt';

describe('<CustomPWAInstallPrompt />', () => {
  it('renders no UI by default', () => {
    render(<CustomPWAInstallPrompt />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders UI once "beforeinstallprompt" was dispatched', () => {
    render(<CustomPWAInstallPrompt />);

    act(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
    });

    expect(screen.queryAllByRole('button')).not.toHaveLength(0);
  });
});
