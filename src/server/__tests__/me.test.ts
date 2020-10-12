import { testLambda } from '../../../testUtils/lambda';
import { SESSION_COOKIE_NAME } from '../../constants';
import { RequestMethods } from '../../utils/requestMethods';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { NOT_FOUND, OK, UNAUTHORIZED } from '../../utils/statusCodes';
import * as cookieUtils from '../auth/cookie';
import { meHandler } from '../auth/routes/me';

const url = '/api/v1/auth/me';
const catchAllName = 'authRouter';
const method: RequestInitMethod = 'get';

describe('api/me', () => {
  RequestMethods.filter(
    (requestMethod) => !['head', method].includes(requestMethod)
  ).forEach((method) => {
    test(`does nothing on method "${method}"`, async () => {
      const response = await testLambda(meHandler, {
        catchAllName,
        method,
        url,
      });

      expect(response.status).toBe(NOT_FOUND);
    });
  });

  test('responds with UNAUTHORIZED on a GET request without cookie', async () => {
    const response = await testLambda(meHandler, {
      catchAllName,
      method,
      url,
    });

    expect(response.status).toBe(UNAUTHORIZED);
  });

  test('attempts to retrieve session', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');

    await testLambda(meHandler, {
      catchAllName,
      method,
      url,
    });

    expect(getSessionSpy).toHaveBeenCalledTimes(1);
  });

  test('responds with session if present', async () => {
    const mockSession = { firstName: 'elliot', lastName: 'alderson' };

    const headers = {
      cookie: {
        [SESSION_COOKIE_NAME]: cookieUtils.encryptSession(mockSession),
      },
    };

    const response = await testLambda(meHandler, {
      catchAllName,
      headers,
      method,
      url,
    });

    expect(response.status).toBe(OK);

    const json = await response.json();

    expect(json).toMatchObject(mockSession);
  });
});
