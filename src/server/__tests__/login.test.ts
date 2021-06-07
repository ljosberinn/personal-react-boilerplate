import { waitFor } from '../../../testUtils';
import { testLambda } from '../../../testUtils/lambda';
import { RequestMethods } from '../../utils/requestMethods';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { NOT_FOUND, OK, UNAUTHORIZED } from '../../utils/statusCodes';
import * as cookieHandling from '../auth/cookie';
import { loginHandler } from '../auth/routes/login';
import { expectJSONBodyMiddleware } from '../middlewares';

const url = '/api/v1/auth/login';
const catchAllName = 'authRouter';
const middleware = expectJSONBodyMiddleware;
const method: RequestInitMethod = 'post';

describe('api/login', () => {
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

    expect(response.status).toBe(UNAUTHORIZED);
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
    const encryptSessionSpy = jest
      .spyOn(cookieHandling, 'encryptSession')
      .mockImplementationOnce((user) => JSON.stringify(user));

    await testLambda(loginHandler, {
      body: { password: 'next-karma!', username: 'ljosberinn' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(encryptSessionSpy).toHaveBeenCalledWith(expect.any(Object));

    await waitFor(() => {
      expect(encryptSessionSpy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  test('attempts to setSessionCookie on a POST request with valid body', async () => {
    const setSessionCookieSpy = jest.spyOn(cookieHandling, 'setSessionCookie');

    const response = await testLambda(loginHandler, {
      body: { password: 'next-karma!', username: 'ljosberinn' },
      catchAllName,
      method,
      middleware,
      url,
    });

    await waitFor(() => {
      expect(setSessionCookieSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object)
      );
    });

    expect(response.status).toBe(OK);

    const json = await response.json();

    expect(json).toStrictEqual({
      displayName: expect.any(String),
      id: expect.any(String),
      username: expect.any(String),
    });
  });
});
