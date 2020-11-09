import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { ENABLED_PROVIDER } from '../../../src/constants';
import { hookAct, renderHook, waitFor } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
} from '../../utils/statusCodes';
import { endpoints } from '../context/AuthContext';
import type { Provider, User } from '../context/AuthContext/types';
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

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
    window.location = realLocation;
  });

  test('throws outside of context', () => {
    const { result } = renderHook(useAuth, {
      omitKarmaProvider: true,
    });

    expect(result.error.message).toBe(
      '[Karma/useAuth] was called outside of an AuthContextProvider.'
    );
  });

  test('defaults to null given no user', () => {
    const {
      result: { current },
    } = renderHook(useAuth);

    expect(current.user).toBeNull();
    expect(current.isAuthenticated).toBeFalsy();
  });

  test('exposes user when passed', () => {
    const user: User = { id: '1', name: 'ljosberinn' };

    const {
      result: { current },
    } = renderHook(useAuth, {
      session: user,
    });

    expect(current.user).toBe(user);
    expect(current.isAuthenticated).toBeTruthy();
  });

  test(`on logout, dispatches a ${endpoints.logout.method} request`, async () => {
    const { url, method } = endpoints.logout;

    const fetchSpy = jest.spyOn(window, 'fetch');

    server.use(rest.delete(url, (_, res, ctx) => res(ctx.status(OK))));

    const user: User = { id: '1', name: 'ljosberinn' };

    const { result } = renderHook(useAuth, {
      session: user,
    });

    expect(result.current.user).toBe(user);

    await hookAct(result.current.logout);

    expect(fetchSpy).toHaveBeenCalledWith(url, {
      method,
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  describe('register', () => {
    test(`dispatches a ${endpoints.register.method} request`, async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };
      const { url, method } = endpoints.register;

      server.use(rest.post(url, (_req, res, ctx) => res(ctx.json(user))));

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
        response = await result.current.register(userWithPassword);
      });

      expect(fetchSpy).toHaveBeenCalledWith(url, {
        body: JSON.stringify(userWithPassword),
        method,
      });

      expect(response).toMatchObject(user);

      await waitFor(() => {
        expect(result.current.user).toMatchObject(user);
      });
    });

    test(`fails gracefully given invalid response data`, async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const { restoreConsole } = mockConsoleMethods('error');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };
      const { url, method } = endpoints.register;

      server.use(
        rest.post(url, (_req, res, ctx) => res(ctx.body('invalid json')))
      );

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
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

    test('fails gracefully when rejected', async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };

      const { url, method } = endpoints.register;

      server.use(
        rest.post(url, (_req, res, ctx) =>
          res(ctx.status(UNPROCESSABLE_ENTITY))
        )
      );

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
        response = await result.current.register(userWithPassword);
      });

      expect(response).toBe(UNPROCESSABLE_ENTITY);

      expect(result.current.user).toBeNull();

      expect(fetchSpy).toHaveBeenCalledWith(url, {
        body: JSON.stringify(userWithPassword),
        method,
      });
    });
  });

  describe('provider login', () => {
    test('does nothing given an invalid provider', async () => {
      jest.spyOn(window.location, 'assign');

      const provider = 'reddit';

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
        response = await result.current.login({
          provider: (provider as unknown) as Provider,
        });
      });

      expect(response).toBeNull();

      expect(window.location.assign).not.toHaveBeenCalled();
    });

    ENABLED_PROVIDER.filter((provider) => provider !== 'local').forEach(
      (provider) => {
        test(`redirects to a provider when demanded (provider: ${provider})`, async () => {
          jest.spyOn(window.location, 'assign');

          const { result } = renderHook(useAuth);

          let response;

          await hookAct(async () => {
            response = await result.current.login({ provider });
          });

          expect(response).toBeNull();

          expect(window.location.assign).toHaveBeenCalledWith(
            endpoints.provider.url.replace('provider', provider)
          );
        });
      }
    );
  });

  describe('local login', () => {
    test(`dispatches a ${endpoints.login.method} request`, async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };

      const { url, method } = endpoints.login;

      server.use(rest.post(url, (_req, res, ctx) => res(ctx.json(user))));

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
        response = await result.current.login(userWithPassword);
      });

      expect(response).toMatchObject(user);

      expect(fetchSpy).toHaveBeenCalledWith(url, {
        body: JSON.stringify(userWithPassword),
        method,
      });

      await waitFor(() => {
        expect(result.current.user).toMatchObject(user);
      });
    });

    test(`fails gracefully given invalid response data`, async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const { restoreConsole } = mockConsoleMethods('error');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };

      const { url, method } = endpoints.login;

      server.use(
        rest.post(url, (_req, res, ctx) => res(ctx.body('invalid json')))
      );

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
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

    test(`fails gracefully given invalid login data`, async () => {
      const fetchSpy = jest.spyOn(window, 'fetch');

      const user = { username: 'ljosberinn' };
      const userWithPassword = { ...user, password };

      const { url, method } = endpoints.login;

      server.use(
        rest.post(url, (_req, res, ctx) =>
          res(ctx.status(UNPROCESSABLE_ENTITY))
        )
      );

      const { result } = renderHook(useAuth);

      let response;

      await hookAct(async () => {
        response = await result.current.login(userWithPassword);
      });

      expect(response).toBe(UNPROCESSABLE_ENTITY);

      expect(fetchSpy).toHaveBeenCalledWith(url, {
        body: JSON.stringify(userWithPassword),
        method,
      });
    });
  });
});
