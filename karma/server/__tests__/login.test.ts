import { waitFor } from '../../../testUtils';
import { testLambda } from '../../../testUtils/lambda';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { RequestMethods } from '../../utils/requestMethods';
import {
  NOT_FOUND,
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
} from '../../utils/statusCodes';
import * as cookieHandling from '../auth/cookie';
import { loginHandler } from '../auth/routes/login';
import { expectJSONBodyMiddleware } from '../middlewares';

jest.mock('../auth/cookie', () => ({
  encryptSession: jest.fn().mockImplementation((user) => JSON.stringify(user)),
  setSessionCookie: jest.fn(),
}));

const url = '/api/v1/auth/login';
const catchAllName = 'authRouter';
const middleware = expectJSONBodyMiddleware;
const method: RequestInitMethod = 'post';

describe('api/login', () => {
  test('should be a function', () => {
    expect(loginHandler).toBeInstanceOf(Function);
  });

  test('does nothing given no matching path', async () => {
    const response = await testLambda(loginHandler, {
      catchAllName,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  RequestMethods.filter((requestMethod) => requestMethod !== method).forEach(
    (method) => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(loginHandler, {
          catchAllName,
          method,
          middleware,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  test('responds with BAD_REQUEST on a POST request without body', async () => {
    const response = await testLambda(loginHandler, {
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with UNAUTHORIZED on a POST request with invalid body', async () => {
    const response = await testLambda(loginHandler, {
      body: { foo: 'bar' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(UNAUTHORIZED);
  });

  test('responds with UNAUTHORIZED on a POST request with unknown user', async () => {
    const response = await testLambda(loginHandler, {
      body: { password: 'bar', username: 'foo' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(UNAUTHORIZED);
  });

  test('attempts to encrypt session on a POST request with valid body', async () => {
    await testLambda(loginHandler, {
      body: { password: 'next-karma!', username: 'ljosberinn' },
      catchAllName,
      method,
      middleware,
      url,
    });
    const encryptSession = jest.spyOn(cookieHandling, 'encryptSession');

    expect(encryptSession).toHaveBeenCalledWith(expect.any(Object));

    await waitFor(() => {
      expect(encryptSession).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  test('attempts to setSessionCookie on a POST request with valid body', async () => {
    const response = await testLambda(loginHandler, {
      body: { password: 'next-karma!', username: 'ljosberinn' },
      catchAllName,
      method,
      middleware,
      url,
    });
    const setSessionCookie = jest.spyOn(cookieHandling, 'setSessionCookie');

    await waitFor(() => {
      expect(setSessionCookie).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object)
      );
    });

    expect(response.status).toBe(OK);

    const json = await response.json();

    expect(json).toMatchObject(
      expect.objectContaining({
        displayName: expect.any(String),
        id: expect.any(String),
        username: expect.any(String),
      })
    );
  });
});
