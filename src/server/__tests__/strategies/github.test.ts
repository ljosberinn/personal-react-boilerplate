import {
  createNextApiRequestMock,
  createNextApiResponse,
  NextApiResponseMock,
} from '../../../../testUtils/api';
import {
  redirectToGitHub,
  processGitHubCallback,
} from '../../auth/strategies/github';
import type { GitHubProfile } from '../../auth/strategies/github';
import type { OAuth2Response } from '../../auth/types';
import * as oauth2Utils from '../../auth/utils';

import 'whatwg-fetch';

describe('auth - github', () => {
  describe('redirect', () => {
    test('sets location header', () => {
      const redirectSpy = jest.spyOn(oauth2Utils, 'redirect');
      const redirect_uri = 'karma';

      redirectToGitHub(
        createNextApiRequestMock(),
        createNextApiResponse(),
        redirect_uri
      );

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
      const expectedResponse: GitHubProfile = {
        avatar_url: '',
        bio: '',
        blog: '',
        collaborators: 0,
        company: '',
        created_at: '',
        disk_usage: 1,
        email: null,
        events_url: '',
        followers: 1,
        followers_url: '',
        following: 1,
        following_url: '',
        gists_url: '',
        gravatar_id: '',
        hireable: null,
        html_url: '',
        id: 1,
        location: '',
        login: '',
        name: '',
        node_id: '',
        organizations_url: '',
        owned_private_repos: 1,
        plan: { collaborators: 0, name: 'free', private_repos: 0 },
        private_gists: 0,
        public_gists: 0,
        public_repos: 0,
        received_events_url: '',
        repos_url: '',
        site_admin: false,
        starred_url: '',
        subscriptions_url: '',
        total_private_repos: 0,
        twitter_username: '',
        two_factor_authentication: true,
        type: 'User',
        updated_at: '',
        url: '',
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
