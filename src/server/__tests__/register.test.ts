import { testLambda } from '../../../testUtils/lambda';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { RequestMethods } from '../../utils/requestMethods';
import { NOT_FOUND, BAD_REQUEST, CREATED } from '../../utils/statusCodes';
import { registrationHandler } from '../auth/routes/register';
import { expectJSONBodyMiddleware } from '../middlewares';

const url = '/api/v1/auth/register';
const catchAllName = 'authRouter';
const method: RequestInitMethod = 'post';
const middleware = expectJSONBodyMiddleware;

describe('api/register', () => {
  test('should be a function', () => {
    expect(registrationHandler).toBeInstanceOf(Function);
  });

  test('does nothing given no matching path', async () => {
    const response = await testLambda(registrationHandler, {
      catchAllName,
      middleware,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  RequestMethods.filter((requestMethod) => requestMethod !== method).forEach(
    (method) => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(registrationHandler, {
          catchAllName,
          method,
          middleware,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  ([{ username: 'foo' }, { password: 'foo' }] as Record<
    string,
    string
  >[]).forEach((body) => {
    const affix = `(missing ${'password' in body ? 'username' : 'passsword'})`;

    test(`responds with BAD_REQUEST given an incomplete dataset ${affix}`, async () => {
      const response = await testLambda(registrationHandler, {
        body,
        catchAllName,
        method,
        middleware,
        url,
      });

      expect(response.status).toBe(BAD_REQUEST);
    });
  });

  test('responds with CREATED given a complete dataset', async () => {
    const response = await testLambda(registrationHandler, {
      body: { password: 'bar', username: 'foo' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(CREATED);
  });

  test('responds with a JSON given a complete dataset', async () => {
    const response = await testLambda(registrationHandler, {
      body: { password: 'bar', username: 'foo' },
      catchAllName,
      method,
      middleware,
      url,
    });

    const json = await response.json();

    expect(json).toMatchObject(expect.any(Object));
  });
});
