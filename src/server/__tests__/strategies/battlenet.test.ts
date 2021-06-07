import {
  createNextApiRequestMock,
  createNextApiResponse,
  NextApiResponseMock,
} from '../../../../testUtils/api';
import { BAD_REQUEST } from '../../../utils/statusCodes';
import * as cookieUtils from '../../auth/cookie';
import {
  redirectToBattleNet,
  processBattleNetCallback,
  BATTLE_NET_STATE_COOKIE_NAME,
} from '../../auth/strategies/battlenet';
import type { BattleNetRegion } from '../../auth/strategies/battlenet';
import * as oauth2Utils from '../../auth/utils';

import 'whatwg-fetch';

const regions: BattleNetRegion[] = ['apac', 'us', 'eu', 'cn'];

describe('auth - battlenet', () => {
  const redirect_uri = 'karma';

  describe('redirect', () => {
    test('does not redirect without "region" in query', () => {
      const mockResponse = createNextApiResponse({
        end: jest.fn(),
        status: jest.fn().mockReturnThis(),
      });

      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');

      redirectToBattleNet(
        createNextApiRequestMock(),
        mockResponse,
        redirect_uri
      );

      expect(redirectSpy).not.toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(BAD_REQUEST);

      expect(mockResponse.end).toHaveBeenCalledTimes(1);
    });

    test('does not redirect with an invalid "region" in query', () => {
      const mockResponse = createNextApiResponse({
        end: jest.fn(),
        status: jest.fn().mockReturnThis(),
      });

      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');

      redirectToBattleNet(
        createNextApiRequestMock({
          query: {
            region: redirect_uri,
          },
        }),
        mockResponse,
        redirect_uri
      );

      expect(redirectSpy).not.toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(BAD_REQUEST);

      expect(mockResponse.end).toHaveBeenCalledTimes(1);
    });

    regions.forEach((region) => {
      test('sets "state" cookie', () => {
        const setCookieSpy = jest.spyOn(cookieUtils, 'setCookie');
        const res = createNextApiResponse();

        redirectToBattleNet(
          createNextApiRequestMock({
            query: {
              region,
            },
          }),
          res,
          redirect_uri
        );

        expect(setCookieSpy).toHaveBeenCalledTimes(1);
        expect(setCookieSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: BATTLE_NET_STATE_COOKIE_NAME,
            options: expect.any(Object),
            value: expect.stringContaining(region),
          }),
          res
        );
      });

      test(`calls general purpose redirect (region: "${region}")`, () => {
        const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');

        redirectToBattleNet(
          createNextApiRequestMock({
            query: {
              region,
            },
          }),
          createNextApiResponse(),
          redirect_uri
        );

        expect(redirectSpy).toHaveBeenCalledTimes(1);

        expect(redirectSpy).toHaveBeenCalledWith(
          expect.any(NextApiResponseMock),
          expect.stringContaining(region),
          expect.objectContaining({
            client_id: undefined,
            redirect_uri,
            scope: expect.any(String),
            state: expect.stringContaining(region),
          })
        );
      });
    });
  });

  describe('callback', () => {
    const code = 'code';

    test('fails gracefully without "region" in query', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processBattleNetCallback(
        createNextApiRequestMock(),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('fails gracefully with "region" in query being an array', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          query: {
            region: ['eu', 'eu'],
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('does nothing given an invalid "region" in query', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          query: {
            region: 'karma',
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('does nothing without "state" in query', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          query: {
            region: 'eu',
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('does nothing if "state" in query is an array', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          query: {
            region: 'eu',
            state: ['1', '2'],
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('does nothing if no persisted state is present through cookies', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const region = 'eu';
      const state = `${region}-1`;

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          query: {
            region,
            state,
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('does nothing if persisted "state" in query does not match persisted state', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const region = 'eu';
      const state = `${region}-1`;

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          cookies: {
            [BATTLE_NET_STATE_COOKIE_NAME]: 'karma',
          },
          query: {
            region,
            state,
          },
        }),
        responseMock,
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();

      expect(responseMock.status).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenCalledWith(BAD_REQUEST);
    });

    test('unsets "state" cookie', async () => {
      const expectedResponse = {
        expires_in: 86_400,
      };

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify(expectedResponse)));

      const removeCookieSpy = jest.spyOn(cookieUtils, 'removeCookie');

      const region = 'eu';
      const state = `${region}-1`;

      const res = createNextApiResponse();

      const response = await processBattleNetCallback(
        createNextApiRequestMock({
          cookies: {
            [BATTLE_NET_STATE_COOKIE_NAME]: state,
          },
          query: {
            region,
            state,
          },
        }),
        res,
        {
          code,
          redirect_uri,
        }
      );

      expect(removeCookieSpy).toHaveBeenCalledTimes(1);
      expect(removeCookieSpy).toHaveBeenCalledWith(
        BATTLE_NET_STATE_COOKIE_NAME,
        res
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      expect(response?.expires_in).toStrictEqual(expectedResponse.expires_in);
    });
  });
});
