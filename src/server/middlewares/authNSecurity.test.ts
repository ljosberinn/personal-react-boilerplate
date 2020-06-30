import { seal, defaults } from '@hapi/iron';
import { IncomingMessage } from 'http';
import nextConnect from 'next-connect';

import { waitFor } from '../../../testUtils';
import { testLambda, RequestMethods } from '../../../testUtils/lambda';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_SECRET } from '../../constants';
import { OK, UNAUTHORIZED } from '../../utils/statusCodes';
import * as cookieUtils from '../auth/cookie';
import { AuthenticatedRequest } from '../auth/types';
import { RequestHandler } from '../types';
import authNSecurityMiddleware from './authNSecurity';

const dummyHandler: RequestHandler<AuthenticatedRequest> = (req, res) => {
  return res.status(OK).json(req[SESSION_COOKIE_NAME]);
};

beforeEach(() => {
  document.cookie = '';
});

describe('middleware/authNSecurity', () => {
  test('should be a function', () => {
    expect(authNSecurityMiddleware).toBeInstanceOf(Function);
  });

  RequestMethods.filter(method => method !== 'HEAD').forEach(method => {
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

      const validDummyCookie = await seal(
        dataset,
        SESSION_COOKIE_SECRET,
        defaults
      );

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
