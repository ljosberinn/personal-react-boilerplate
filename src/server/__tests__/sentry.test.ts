import { IncomingMessage } from 'http';
import nextConnect from 'next-connect';

import { testLambda } from '../../../testUtils/lambda';
import { RequestMethods } from '../../utils/requestMethods';
import * as sentryUtils from '../../utils/sentry/server';
import { OK } from '../../utils/statusCodes';
import { sentryMiddleware } from '../middlewares/sentry';
import type { RequestHandler } from '../types';

const dummyHandler: RequestHandler = (_req, res) => {
  return res.status(OK).end();
};

describe('middleware/sentryMiddleware', () => {
  test('should be a function', () => {
    expect(sentryMiddleware).toBeInstanceOf(Function);
  });

  RequestMethods.forEach((method) => {
    test(`never intercepts the underlying handler (method: ${method})`, async () => {
      const response = await testLambda(nextConnect().use(dummyHandler), {
        method,
        middleware: sentryMiddleware,
        url: '/',
      });

      expect(response.status).toBe(OK);
    });

    test(`always attaches lambda context to sentry (method: ${method})`, async () => {
      const attachLambdaContextSpy = jest.spyOn(
        sentryUtils,
        'attachLambdaContext'
      );

      await testLambda(nextConnect().use(dummyHandler), {
        method,
        middleware: sentryMiddleware,
        url: '/',
      });

      expect(attachLambdaContextSpy).toHaveBeenCalledWith(
        expect.any(IncomingMessage)
      );
    });
  });
});
