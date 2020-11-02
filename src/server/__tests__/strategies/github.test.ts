import {
  createNextApiRequestMock,
  createNextApiResponse,
  NextApiResponseMock,
} from '../../../../testUtils/api';
import {
  redirectToGitHub,
  processGitHubCallback,
} from '../../auth/strategies/github';
import type { OAuth2Response } from '../../auth/types';
import * as oauth2Utils from '../../auth/utils';
import 'whatwg-fetch';

describe('auth - github', () => {
  describe('redirect', () => {
    test('sets location header', () => {
      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');
      const redirect_uri = 'karma';

      redirectToGitHub(createNextApiRequestMock(), createNextApiResponse(), {
        origin: '',
        redirect_uri,
      });

      expect(redirectSpy).toHaveBeenCalledTimes(1);

      expect(redirectSpy).toHaveBeenCalledWith(
        expect.any(NextApiResponseMock),
        'https://github.com/login/oauth/authorize',
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

    const mockOAuth2Response: OAuth2Response = {
      access_token,
      expires_in: 86_400,
      refresh_token,
      scope,
      token_type,
    };

    test('retrieves oauth2 response', async () => {
      const expectedResponse = {
        karma: 'karma',
      };

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify(mockOAuth2Response)))
        .mockResolvedValueOnce(new Response(JSON.stringify(expectedResponse)));

      const response = await processGitHubCallback(
        createNextApiRequestMock(),
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
          "https://github.com/login/oauth/access_token",
          Object {
            "body": "client_id=undefined&client_secret=undefined&code=code&redirect_uri=redirect_uri&grant_type=authorization_code",
            "headers": Object {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            "method": "POST",
          },
        ]
      `);
      expect(fetchSpy.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "https://api.github.com/user?access_token=access_token",
          Object {
            "headers": Object {
              "authorization": "token access_token",
            },
          },
        ]
      `);
    });
  });
});
