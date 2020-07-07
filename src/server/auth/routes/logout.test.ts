import {
  testLambda,
  RequestMethods,
  RequestMethod,
} from '../../../../testUtils/lambda';
import { SESSION_COOKIE_NAME } from '../../../constants';
import { NOT_FOUND, OK } from '../../../utils/statusCodes';
import * as cookieHandling from '../cookie';
import { logoutHandler } from './logout';

const url = '/api/v1/auth/logout';
const catchAllName = 'authRouter';
const method: RequestMethod = 'DELETE';

jest.mock('../cookie', () => ({
  removeCookie: jest.fn(),
}));

afterEach(jest.clearAllMocks);

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

  RequestMethods.filter(requestMethod => requestMethod !== method).forEach(
    method => {
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

  [true, false].forEach(bool => {
    const headers = {
      [SESSION_COOKIE_NAME]: 'never-gonna-give-you-up',
    };

    test(`tries to unset the SESSION_COOKIE regardless of presence (present: ${bool})`, async () => {
      const response = await testLambda(logoutHandler, {
        catchAllName,
        headers: bool ? headers : undefined,
        method,
        url,
      });

      const removeCookieSpy = jest.spyOn(cookieHandling, 'removeCookie');

      expect(removeCookieSpy).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        expect.any(Object)
      );
      expect(response.status).toBe(OK);
    });
  });
});
