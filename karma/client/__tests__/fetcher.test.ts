/* eslint-disable @typescript-eslint/no-floating-promises */
import nodeFetch from 'node-fetch';

import { createIncomingRequestMock } from '../../../testUtils/api';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { RequestMethods } from '../../utils/requestMethods';
import { authenticatedFetch } from '../utils/fetcher';

const testUrl = 'http://localhost:3000';

const setup = (method: RequestInitMethod) => {
  const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValueOnce({
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    body: null,
    bodyUsed: false,
    catch: jest.fn(),
    clone: jest.fn(),
    finally: jest.fn(),
    formData: jest.fn().mockResolvedValueOnce({}),
    headers: new Headers(),
    json: jest.fn(),
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    text: jest.fn(),
    then: jest.fn(),
    trailer: Promise.resolve(new Headers()),
    type: 'basic',
    url: '',
  });

  const fn = authenticatedFetch[method];

  return {
    fetchSpy,
    fn,
  };
};

describe('authenticatedFetch', () => {
  beforeEach(() => {
    // @ts-expect-error due to nextjs typings, TS things this is incorrect
    window.fetch = nodeFetch;
  });

  afterEach(() => {
    // @ts-expect-error due to nextjs typings, TS things this is incorrect
    window.fetch = undefined;
  });

  RequestMethods.forEach((method) => {
    test(`supports all request methods (method: ${method})`, () => {
      const { fetchSpy, fn } = setup(method);

      fn('', createIncomingRequestMock());

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method,
        })
      );
    });

    [true, false].forEach((bool) => {
      const endpoint = `/api${bool ? '/' : ''}`;

      test(`normalizes given url regardless of trailing slash (slash: ${bool}, method: ${method})`, () => {
        const { fetchSpy, fn } = setup(method);

        fn(endpoint, createIncomingRequestMock());

        const expectedUrl = testUrl + endpoint;

        expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
      });
    });

    test(`always sets JSON headers (method: ${method})`, () => {
      const { fetchSpy, fn } = setup(method);

      fn('', createIncomingRequestMock());

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    test(`allows overriding JSON headers (method: ${method})`, () => {
      const { fetchSpy, fn } = setup(method);

      const headers = {
        Accept: 'text/html',
        'Content-Type': 'text/html',
      };

      fn('', createIncomingRequestMock(), {
        headers,
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(headers),
        })
      );
    });

    test(`automatically forwards cookies, if present (method: ${method})`, () => {
      const { fetchSpy, fn } = setup(method);

      const cookie = 'hello=world;';

      fn('', createIncomingRequestMock({ headers: { cookie } }));

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ cookie }),
        })
      );
    });
  });
});
