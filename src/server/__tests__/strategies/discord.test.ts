import 'whatwg-fetch';

import {
  createNextApiRequestMock,
  createNextApiResponse,
  NextApiResponseMock,
} from '../../../../testUtils/api';
import {
  processDiscordCallback,
  redirectToDiscord,
} from '../../auth/strategies/discord';
import type { DiscordProfile } from '../../auth/strategies/discord';
import type { OAuth2Response } from '../../auth/types';
import * as oauth2Utils from '../../auth/utils';

describe('auth - discord', () => {
  describe('redirect', () => {
    test('sets location header', () => {
      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');
      const redirect_uri = 'karma';

      redirectToDiscord(
        createNextApiRequestMock(),
        createNextApiResponse(),
        redirect_uri
      );

      expect(redirectSpy).toHaveBeenCalledTimes(1);

      expect(redirectSpy).toHaveBeenCalledWith(
        expect.any(NextApiResponseMock),
        'https://discord.com/api/oauth2/authorize',
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
      const expectedResponse: DiscordProfile = {
        avatar: '',
        discriminator: '',
        email: '',
        flags: 1,
        id: '',
        locale: '',
        mfa_enabled: true,
        public_flags: 1,
        username: '',
        verified: true,
      };

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify(mockOAuth2Response)))
        .mockResolvedValueOnce(new Response(JSON.stringify(expectedResponse)));

      const response = await processDiscordCallback(
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
          "https://discord.com/api/oauth2/token",
          Object {
            "body": "client_id=undefined&client_secret=undefined&code=code&redirect_uri=redirect_uri&grant_type=authorization_code",
            "headers": Object {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            "method": "POST",
          },
        ]
      `);
      expect(fetchSpy.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "https://discord.com/api/users/@me?access_token=access_token",
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
