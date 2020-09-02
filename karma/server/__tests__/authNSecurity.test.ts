import { IncomingMessage } from 'http';
import nextConnect from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../src/constants';
import { waitFor } from '../../../testUtils';
import { testLambda } from '../../../testUtils/lambda';
import type { User } from '../../client/context/AuthContext/AuthContext';
import { RequestMethods } from '../../utils/requestMethods';
import { OK, UNAUTHORIZED } from '../../utils/statusCodes';
import * as cookieUtils from '../auth/cookie';
import type { AuthenticatedRequest } from '../auth/types';
import { authNSecurityMiddleware } from '../middlewares/authNSecurity';
import type { RequestHandler } from '../types';

const dummyHandler: RequestHandler<AuthenticatedRequest, User> = (req, res) => {
  return res.status(OK).json(req[SESSION_COOKIE_NAME]);
};

describe('middleware/authNSecurity', () => {
  test('should be a function', () => {
    expect(authNSecurityMiddleware).toBeInstanceOf(Function);
  });

  RequestMethods.filter((method) => method !== 'head').forEach((method) => {
    test(`always intercepts lambda without SESSION_COOKIE present (method: ${method})`, async () => {
      const response = await testLambda(nextConnect().use(dummyHandler), {
        method,
        middleware: authNSecurityMiddleware,
        url: '/',
      });

      expect(response.status).toBe(UNAUTHORIZED);

      const json = await response.json();

      expect(json).toMatchObject(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    test(`always attempts to decrypt the session with a SESSION_COOKIE present (method: ${method})`, async () => {
      const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');

      const response = await testLambda(nextConnect().use(dummyHandler), {
        headers: {
          cookie: {
            [SESSION_COOKIE_NAME]: 'never-gonna-let-you-down',
          },
        },
        method,
        middleware: authNSecurityMiddleware,
        url: '/',
      });

      await waitFor(() =>
        expect(getSessionSpy).toHaveBeenCalledWith(expect.any(IncomingMessage))
      );

      expect(response.status).toBe(UNAUTHORIZED);

      const json = await response.json();

      expect(json).toMatchObject(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    test(`always patches req with the decrypted session with a SESSION_COOKIE present (method: ${method})`, async () => {
      const dataset = { hello: 'world' };

      const validDummyCookie = cookieUtils.encryptSession(dataset);

      const response = await testLambda(nextConnect().use(dummyHandler), {
        headers: {
          cookie: {
            [SESSION_COOKIE_NAME]: validDummyCookie,
          },
        },
        method,
        middleware: authNSecurityMiddleware,
        url: '/',
      });

      await waitFor(() => {
        expect(response.status).toBe(OK);
      });

      const json = await response.json();

      expect(json).toMatchObject(dataset);
    });
  });
});
