import { waitFor } from '../../../../testUtils';
import {
  testLambda,
  RequestMethods,
  RequestMethod,
} from '../../../../testUtils/lambda';
import { NOT_FOUND, BAD_REQUEST, OK } from '../../../utils/statusCodes';
import { expectJSONBodyMiddleware } from '../../middlewares';
import * as cookieHandling from '../cookie';
import login from './login';

jest.mock('../cookie', () => ({
  encryptSession: jest
    .fn()
    .mockImplementation(
      user => new Promise(resolve => resolve(JSON.stringify(user)))
    ),
  setSessionCookie: jest.fn().mockImplementation((_token, _res) => {}),
}));

afterEach(jest.clearAllMocks);

const url = '/api/v1/auth/login';
const catchAllName = 'authRouter';
const middleware = expectJSONBodyMiddleware;
const method: RequestMethod = 'POST';

describe('api/login', () => {
  test('should be a function', () => {
    expect(login).toBeInstanceOf(Function);
  });

  test('does nothing given no matching path', async () => {
    const response = await testLambda(login, {
      catchAllName,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  RequestMethods.filter(requestMethod => requestMethod !== method).forEach(
    method => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(login, {
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
    const response = await testLambda(login, {
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with NOT_FOUND on a POST request with invalid body', async () => {
    const response = await testLambda(login, {
      body: { foo: 'bar' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  test('responds with NOT_FOUND on a POST request with unknown user', async () => {
    const response = await testLambda(login, {
      body: { password: 'bar', username: 'foo' },
      catchAllName,
      method,
      middleware,
      url,
    });

    expect(response.status).toBe(NOT_FOUND);
  });

  test('attempts to encrypt session on a POST request with valid body', async () => {
    await testLambda(login, {
      body: { password: 'next-with-batteries!', username: 'ljosberinn' },
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
    const response = await testLambda(login, {
      body: { password: 'next-with-batteries!', username: 'ljosberinn' },
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
