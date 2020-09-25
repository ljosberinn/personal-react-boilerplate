import { render, waitFor, screen, userEvent } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import { ServiceWorker } from '../components/ServiceWorker';

describe('<ServiceWorker />', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  });

  it('does not crash if a registration fails', async () => {
    const { restoreConsole } = mockConsoleMethods('error');

    const errorMessage = 'rejected';

    const registerSpy = jest.fn().mockRejectedValueOnce(errorMessage);

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: registerSpy,
      },
      writable: true,
    });

    render(<ServiceWorker />);

    await waitFor(() =>
      expect(registerSpy).toHaveBeenCalledWith(expect.any(String))
    );

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(errorMessage);

    restoreConsole();
  });

  it('listens to a ServiceWorkerRegistration onupdatefound', async () => {
    const addEventListenerSpy = jest.fn();

    const registerSpy = jest.fn().mockResolvedValueOnce({
      addEventListener: addEventListenerSpy,
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: registerSpy,
      },
      writable: true,
    });

    render(<ServiceWorker />);

    await waitFor(() =>
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'updatefound',
        expect.any(Function)
      )
    );
  });

  it('listens to an installing workers statechange', async () => {
    const addEventListenerSpy = jest
      .fn()
      .mockImplementationOnce((_event: string, listener: Function) =>
        listener()
      );

    const registerSpy = jest.fn().mockResolvedValueOnce({
      addEventListener: addEventListenerSpy,
      installing: {
        addEventListener: addEventListenerSpy,
      },
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: registerSpy,
      },
      writable: true,
    });

    render(<ServiceWorker />);

    await waitFor(() =>
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'statechange',
        expect.any(Function)
      )
    );
  });

  it('renders a toast onupdatefound', async () => {
    const addEventListenerSpy = jest
      .fn()
      .mockImplementation((_event: string, listener: Function) => listener());

    const registerSpy = jest.fn().mockResolvedValueOnce({
      addEventListener: addEventListenerSpy,
      installing: {
        addEventListener: addEventListenerSpy,
        state: 'installed',
      },
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: true,
        register: registerSpy,
      },
      writable: true,
    });

    render(<ServiceWorker />);

    await screen.findByRole('alert');
  });

  it('reloads the page on toast click', async () => {
    const { restoreConsole } = mockConsoleMethods('error');

    const addEventListenerSpy = jest
      .fn()
      .mockImplementation((_event: string, listener: Function) => listener());

    const registerSpy = jest.fn().mockResolvedValueOnce({
      addEventListener: addEventListenerSpy,
      installing: {
        addEventListener: addEventListenerSpy,
        state: 'installed',
      },
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: true,
        register: registerSpy,
      },
      writable: true,
    });

    render(<ServiceWorker />);

    const toast = await screen.findByRole('alert');

    userEvent.click(toast);

    // window.location.reload can't be spied on
    expect(
      // @ts-expect-error its mocked
      // eslint-disable-next-line no-console
      console.error.mock.calls[0][0].startsWith(
        'Error: Not implemented: navigation (except hash changes)'
      )
    ).toBeTruthy();

    restoreConsole();
  });
});
