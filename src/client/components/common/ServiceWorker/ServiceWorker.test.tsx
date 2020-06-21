import React from 'react';

import { render, waitFor, screen, fireEvent } from '../../../../../testUtils';
import ServiceWorker from './ServiceWorker';

interface MockRegisterArgs {
  shouldReject: boolean;
  registration: ReturnType<typeof jest.fn>;
  addEventListener: ReturnType<typeof jest.fn>;
}

const makeMockRegister = ({
  shouldReject,
  registration,
  addEventListener,
}: MockRegisterArgs) => {
  class Worker {
    addEventListener = addEventListener;
    state: ServiceWorkerState = 'installed';
  }

  class MockRegistration {
    registration = registration;
    addEventListener = addEventListener;
    installing = new Worker();
  }

  const mockRegister = jest.fn().mockImplementationOnce(
    (_swPath: string) =>
      new Promise((resolve, reject) => {
        if (shouldReject) {
          reject();
        } else {
          resolve(new MockRegistration());
        }
      })
  );

  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      controller: true,
      register: mockRegister,
    },
    writable: true,
  });

  return mockRegister;
};

const makeMockAddEventListener = () =>
  jest
    .fn()
    .mockImplementation((_event: string, listener: Function) => listener());

afterEach(() => {
  Object.defineProperty(navigator, 'serviceWorker', {
    value: undefined,
    writable: true,
  });
});

describe('<ServiceWorker />', () => {
  it('renders without crashing', () => {
    render(<ServiceWorker />);
  });

  it('does not crash if a registration fails', async () => {
    // eslint-disable-next-line no-console
    const realConsoleError = console.error;
    const mockConsoleError = jest.fn();
    // eslint-disable-next-line no-console
    console.error = mockConsoleError;

    const { addEventListener, registration, shouldReject } = {
      addEventListener: makeMockAddEventListener(),
      registration: jest.fn(),
      shouldReject: true,
    };

    const mockRegister = makeMockRegister({
      addEventListener,
      registration,
      shouldReject,
    });

    render(<ServiceWorker />);

    expect(mockRegister).toHaveBeenCalledWith(expect.any(String));

    await waitFor(() => expect(mockConsoleError).toHaveBeenCalledTimes(1));

    // eslint-disable-next-line no-console
    console.error = realConsoleError;
  });

  it('listens to a ServiceWorkerRegistration onupdatefound', async () => {
    const addEventListener = makeMockAddEventListener();
    const registration = jest.fn();

    const mockRegister = makeMockRegister({
      addEventListener,
      registration,
      shouldReject: false,
    });

    render(<ServiceWorker />);

    expect(mockRegister).toHaveBeenCalledWith(expect.any(String));

    await waitFor(() =>
      expect(addEventListener).toHaveBeenCalledWith(
        'updatefound',
        expect.any(Function)
      )
    );
  });

  it('listens to an installing workers statechange', async () => {
    const addEventListener = makeMockAddEventListener();
    const registration = jest.fn();

    const mockRegister = makeMockRegister({
      addEventListener,
      registration,
      shouldReject: false,
    });

    render(<ServiceWorker />);

    expect(mockRegister).toHaveBeenCalledWith(expect.any(String));

    await waitFor(() =>
      expect(addEventListener).toHaveBeenLastCalledWith(
        'statechange',
        expect.any(Function)
      )
    );
  });

  it('renders a toast onupdatefound triggering site reload on click', async () => {
    const mockReload = jest.fn();

    Object.defineProperty(window, 'location', {
      value: {
        reload: mockReload,
      },
      writable: true,
    });

    makeMockRegister({
      addEventListener: makeMockAddEventListener(),
      registration: jest.fn(),
      shouldReject: false,
    });

    render(<ServiceWorker />);

    const toast = await screen.findByRole('alert');

    fireEvent.click(toast);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
