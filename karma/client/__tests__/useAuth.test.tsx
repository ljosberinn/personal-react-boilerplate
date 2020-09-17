import { renderHook, act } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { ENABLED_PROVIDER } from '../../../src/constants';
import { waitFor } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import {
  OK,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} from '../../utils/statusCodes';
import { AuthContextProvider, endpoints } from '../context/AuthContext';
import type { Provider } from '../context/AuthContext/AuthContext';
import { useAuth } from '../hooks/useAuth';

const password = 'next-karma!';

describe('hooks/useAuth', () => {
  const server = setupServer();

  const realLocation = window.location;

  beforeAll(() => {
    server.listen();
    // @ts-expect-error jest does not support location to be spied on
    delete window.location;
    window.location = { ...realLocation, assign: jest.fn() };
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
    window.location = realLocation;
  });

  test('throws outside of context', () => {
    const { result } = renderHook(useAuth);

    expect(result.error.message).toBe(
      'useAuth was called outside of an AuthContextProvider.'
    );
  });

  test('defaults to null given no user', () => {
    const {
      result: { current },
    } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    expect(current.user).toBeNull();
    expect(current.isAuthenticated).toBeFalsy();
  });

  test('exposes user when passed', () => {
    const user = { id: '1', name: 'ljosberinn' };

    const {
      result: { current },
    } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={user}>{children}</AuthContextProvider>
      ),
    });

    expect(current.user).toBe(user);
    expect(current.isAuthenticated).toBeTruthy();
  });

  test(`on logout, dispatches a ${endpoints.logout.method} request`, async () => {
    const { url, method } = endpoints.logout;

    const fetchSpy = jest.spyOn(window, 'fetch');

    server.use(rest.delete(url, (_, res, ctx) => res(ctx.status(OK))));

    const user = { id: '1', name: 'ljosberinn' };

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={user}>{children}</AuthContextProvider>
      ),
    });

    expect(result.current.user).toBe(user);

    await act(result.current.logout);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      method,
    });

    await waitFor(() => expect(result.current.user).toBeNull());
  });

  test(`on register, dispatches a ${endpoints.register.method} request`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };
    const { url, method } = endpoints.register;

    server.use(rest.post(url, (_req, res, ctx) => res(ctx.json(user))));

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.register(userWithPassword);
    });

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });

    expect(response).toMatchObject(user);

    await waitFor(() => expect(result.current.user).toMatchObject(user));
  });

  test(`on register, fails gracefully given invalid response data`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const { restoreConsole } = mockConsoleMethods('error');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };
    const { url, method } = endpoints.register;

    server.use(
      rest.post(url, (_req, res, ctx) => res(ctx.body('invalid json')))
    );

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.register(userWithPassword);
    });

    expect(response).toBe(INTERNAL_SERVER_ERROR);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  test('on register, fails gracefully when rejected', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };

    const { url, method } = endpoints.register;

    server.use(
      rest.post(url, (_req, res, ctx) => res(ctx.status(UNPROCESSABLE_ENTITY)))
    );

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.register(userWithPassword);
    });

    expect(response).toBe(UNPROCESSABLE_ENTITY);

    expect(result.current.user).toBeNull();

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });
  });

  test('on provider login, does nothing given an invalid provider', async () => {
    jest.spyOn(window.location, 'assign');

    const provider = 'reddit';

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.login({
        provider: (provider as unknown) as Provider,
      });
    });

    expect(response).toBeNull();

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  ENABLED_PROVIDER.filter((provider) => provider !== 'local').forEach(
    (provider) => {
      test(`on provider login, redirects to a provider when demanded (provider: ${provider})`, async () => {
        jest.spyOn(window.location, 'assign');

        const { result } = renderHook(useAuth, {
          wrapper: ({ children }) => (
            <AuthContextProvider session={null}>{children}</AuthContextProvider>
          ),
        });

        let response;

        await act(async () => {
          response = await result.current.login({ provider });
        });

        expect(response).toBeNull();

        expect(window.location.assign).toHaveBeenCalledWith(
          endpoints.provider.url.replace('provider', provider)
        );
      });
    }
  );

  test(`on local login, dispatches a ${endpoints.login.method} request`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };

    const { url, method } = endpoints.login;

    server.use(rest.post(url, (_req, res, ctx) => res(ctx.json(user))));

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.login(userWithPassword);
    });

    expect(response).toMatchObject(user);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });

    await waitFor(() => expect(result.current.user).toMatchObject(user));
  });

  test(`on local login, fails gracefully given invalid response data`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const { restoreConsole } = mockConsoleMethods('error');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };

    const { url, method } = endpoints.login;

    server.use(
      rest.post(url, (_req, res, ctx) => res(ctx.body('invalid json')))
    );

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.login(userWithPassword);
    });

    expect(response).toBe(INTERNAL_SERVER_ERROR);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  test(`on local login, fails gracefully given invalid login data`, async () => {
    const fetchSpy = jest.spyOn(window, 'fetch');

    const user = { username: 'ljosberinn' };
    const userWithPassword = { ...user, password };

    const { url, method } = endpoints.login;

    server.use(
      rest.post(url, (_req, res, ctx) => res(ctx.status(UNPROCESSABLE_ENTITY)))
    );

    const { result } = renderHook(useAuth, {
      wrapper: ({ children }) => (
        <AuthContextProvider session={null}>{children}</AuthContextProvider>
      ),
    });

    let response;

    await act(async () => {
      response = await result.current.login(userWithPassword);
    });

    expect(response).toBe(UNPROCESSABLE_ENTITY);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      body: JSON.stringify(userWithPassword),
      method,
    });
  });
});
