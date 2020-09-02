import { SESSION_COOKIE_NAME } from '../../../src/constants';
import { testLambda } from '../../../testUtils/lambda';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { RequestMethods } from '../../utils/requestMethods';
import { NOT_FOUND, OK } from '../../utils/statusCodes';
import * as cookieHandling from '../auth/cookie';
import { logoutHandler } from '../auth/routes/logout';

const url = '/api/v1/auth/logout';
const catchAllName = 'authRouter';
const method: RequestInitMethod = 'delete';

describe('api/logout', () => {
  test('should be a function', () => {
    expect(logoutHandler).toBeInstanceOf(Function);
  });

  test('does nothing given no matching path', async () => {
    const response = await testLambda(logoutHandler, {
      catchAllName,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  RequestMethods.filter((requestMethod) => requestMethod !== method).forEach(
    (method) => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(logoutHandler, {
          catchAllName,
          method,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  test('unsets SESSION_COOKIE even if when absent', async () => {
    const removeCookieSpy = jest.spyOn(cookieHandling, 'removeCookie');

    const response = await testLambda(logoutHandler, {
      catchAllName,
      headers: {
        [SESSION_COOKIE_NAME]: 'never-gonna-give-you-up',
      },
      method,
      url,
    });

    expect(removeCookieSpy).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.any(Object)
    );
    expect(response.status).toBe(OK);
  });

  test('unsets SESSION_COOKIE when present', async () => {
    const removeCookieSpy = jest.spyOn(cookieHandling, 'removeCookie');

    const response = await testLambda(logoutHandler, {
      catchAllName,
      method,
      url,
    });

    expect(removeCookieSpy).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.any(Object)
    );
    expect(response.status).toBe(OK);
  });
});
