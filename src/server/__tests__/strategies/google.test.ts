import {
  createNextApiRequestMock,
  createNextApiResponse,
  NextApiResponseMock,
} from '../../../../testUtils/api';
import { BAD_REQUEST } from '../../../utils/statusCodes';
import {
  redirectToGoogle,
  processGoogleCallback,
} from '../../auth/strategies/google';
import type { GoogleProfile } from '../../auth/strategies/google';
import type { OAuth2Response } from '../../auth/types';
import * as oauth2Utils from '../../auth/utils';

import 'whatwg-fetch';

describe('auth - google', () => {
  describe('redirect', () => {
    test('sets location header', () => {
      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');
      const redirect_uri = 'karma';

      redirectToGoogle(
        createNextApiRequestMock(),
        createNextApiResponse(),
        redirect_uri
      );

      expect(redirectSpy).toHaveBeenCalledTimes(1);

      expect(redirectSpy).toHaveBeenCalledWith(
        expect.any(NextApiResponseMock),
        'https://accounts.google.com/o/oauth2/v2/auth',
        expect.objectContaining({
          client_id: undefined,
          redirect_uri,
          scope: expect.any(String),
        })
      );
    });
  });

  describe('callback', () => {
    const access_token = 'access_token';
    const refresh_token = 'refresh_token';
    const scope = 'scope';
    const token_type = 'token_type';

    const code = 'code';
    const redirect_uri = 'redirect_uri';
    const prompt = 'prompt';

    const mockOAuth2Response: OAuth2Response = {
      access_token,
      expires_in: 86_400,
      refresh_token,
      scope,
      token_type,
    };

    test('fails gracefully without "prompt" in query', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processGoogleCallback(
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

    test('fails gracefully with "prompt" in query being an array', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const responseMock = createNextApiResponse({
        status: jest.fn(),
      });

      const response = await processGoogleCallback(
        createNextApiRequestMock({
          query: {
            prompt: [prompt],
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

    test('retrieves oauth2 response', async () => {
      const expectedResponse: GoogleProfile = {
        email: '',
        email_verified: true,
        family_name: '',
        given_name: '',
        locale: '',
        name: '',
        picture: '',
        sub: '',
      };

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify(mockOAuth2Response)))
        .mockResolvedValueOnce(new Response(JSON.stringify(expectedResponse)));

      const response = await processGoogleCallback(
        createNextApiRequestMock({
          query: {
            prompt,
          },
        }),
        createNextApiResponse(),
        {
          code,
          redirect_uri,
        }
      );

      expect(response).toStrictEqual(expectedResponse);

      expect(fetchSpy).toHaveBeenCalledTimes(2);

      expect(fetchSpy.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "https://www.googleapis.com/oauth2/v4/token",
          Object {
            "body": "client_id=undefined&client_secret=undefined&code=code&prompt=prompt&redirect_uri=redirect_uri&grant_type=authorization_code",
            "headers": Object {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            "method": "POST",
          },
        ]
      `);
      expect(fetchSpy.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "https://www.googleapis.com/oauth2/v3/userinfo?access_token=access_token",
          Object {
            "headers": Object {
              "authorization": "token_type access_token",
            },
          },
        ]
      `);
    });
  });
});
