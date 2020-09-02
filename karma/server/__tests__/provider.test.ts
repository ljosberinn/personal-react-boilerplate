import type { ExternalProvider } from '../../../karma/client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../src/constants';
import { mockConsoleMethods } from '../../../testUtils/console';
import { testLambda } from '../../../testUtils/lambda';
import type { RequestInitMethod } from '../../utils/requestMethods';
import { RequestMethods } from '../../utils/requestMethods';
import {
  NOT_FOUND,
  FOUND_MOVED_TEMPORARILY,
  INTERNAL_SERVER_ERROR,
} from '../../utils/statusCodes';
import * as cookieUtils from '../auth/cookie';
import * as oauthTools from '../auth/oauth';
import { externalProviderHandler } from '../auth/routes/provider';

const url = '/api/v1/auth/provider';
const catchAllName = 'authRouter';
const method: RequestInitMethod = 'get';
const redirect = 'manual';

const code = 'code';

const createOAuthResponseMock = () => ({
  access_token: 'access_token',
  expires_in: Date.now() + 1000,
  refresh_token: 'refresh_token',
  scope: 'scope',
  token_type: 'token_type',
});

describe('api/provider', () => {
  test('should be a function', () => {
    expect(externalProviderHandler).toBeInstanceOf(Function);
  });

  RequestMethods.filter((requestMethod) => requestMethod !== method).forEach(
    (method) => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  ENABLED_PROVIDER.filter((provider) => provider !== 'local').forEach(
    (externalProvider) => {
      test(`responds with a redirect given no additional params (provider: ${externalProvider})`, async () => {
        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          url: url.replace('provider', externalProvider),
        });

        expect(response.status).toBe(FOUND_MOVED_TEMPORARILY);
        expect(response.headers.has('Location')).toBeTruthy();
        expect(
          response.headers.get('Location')?.includes(externalProvider)
        ).toBeTruthy();
      });

      test(`errors given an error query (provider: ${externalProvider})`, async () => {
        const { restoreConsole } = mockConsoleMethods('error');

        const error = 'some-error';

        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams: {
            error,
          },
          url: url.replace('provider', externalProvider),
        });

        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledWith(error);
        expect(response.status).toBe(INTERNAL_SERVER_ERROR);

        restoreConsole();
      });

      test(`errors given more than one query param, but no code (provider: ${externalProvider})`, async () => {
        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams: {
            bar: 'bar',
            baz: 'baz',
            foo: 'foo',
          },
          url: url.replace('provider', externalProvider),
        });

        expect(response.status).toBe(INTERNAL_SERVER_ERROR);
      });

      test(`errors given more than one code (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', 'a');
        searchParams.append('code', 'b');

        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(response.status).toBe(INTERNAL_SERVER_ERROR);
      });

      test(`attempts to load OAuthData (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', code);

        const getOAuthDataSpy = jest.spyOn(oauthTools, 'getOAuthData');

        await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(getOAuthDataSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            code,
            prompt: undefined,
            provider: externalProvider,
            redirect_uri: expect.any(String),
          })
        );
      });

      test(`loads profile data based on data received from getOAuthData (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', code);

        const oauthResponse = createOAuthResponseMock();

        jest
          .spyOn(oauthTools, 'getOAuthData')
          .mockResolvedValueOnce(oauthResponse);

        const getProfileDataSpy = jest.spyOn(oauthTools, 'getProfileData');

        await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(getProfileDataSpy).toHaveBeenCalledWith(
          oauthTools.config[externalProvider as ExternalProvider]
            .profileDataUrl,
          externalProvider,
          oauthResponse
        );
      });

      test(`encrypts session data (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', code);

        const oauthResponse = createOAuthResponseMock();

        const fakeProfile = {
          user: 'ljosberinn',
        };

        jest
          .spyOn(oauthTools, 'getOAuthData')
          .mockResolvedValueOnce(oauthResponse);

        jest
          .spyOn(oauthTools, 'getProfileData')
          .mockResolvedValueOnce(fakeProfile);

        const encryptSessionSpy = jest.spyOn(cookieUtils, 'encryptSession');

        await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(encryptSessionSpy).toHaveBeenCalledWith(fakeProfile);
      });

      test(`sets the cookie on response (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', code);

        const oauthResponse = createOAuthResponseMock();

        const fakeProfile = {
          user: 'ljosberinn',
        };

        const fakeCookie = 'fakeCookie';

        jest
          .spyOn(oauthTools, 'getOAuthData')
          .mockResolvedValueOnce(oauthResponse);

        jest
          .spyOn(oauthTools, 'getProfileData')
          .mockResolvedValueOnce(fakeProfile);

        jest
          .spyOn(cookieUtils, 'encryptSession')
          .mockReturnValueOnce(fakeCookie);

        const setSessionCookieSpy = jest.spyOn(cookieUtils, 'setSessionCookie');

        await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(setSessionCookieSpy).toHaveBeenCalledWith(
          fakeCookie,
          expect.any(Object)
        );
      });

      test(`redirects on successful authentication (provider: ${externalProvider})`, async () => {
        const searchParams = new URLSearchParams();

        searchParams.append('code', code);

        const oauthResponse = createOAuthResponseMock();

        const fakeProfile = {
          user: 'ljosberinn',
        };

        const fakeCookie = 'fakeCookie';

        jest
          .spyOn(oauthTools, 'getOAuthData')
          .mockResolvedValueOnce(oauthResponse);

        jest
          .spyOn(oauthTools, 'getProfileData')
          .mockResolvedValueOnce(fakeProfile);

        jest
          .spyOn(cookieUtils, 'encryptSession')
          .mockReturnValueOnce(fakeCookie);

        jest.spyOn(cookieUtils, 'setSessionCookie');

        const response = await testLambda(externalProviderHandler, {
          catchAllName,
          method,
          redirect,
          searchParams,
          url: url.replace('provider', externalProvider),
        });

        expect(response.status).toBe(FOUND_MOVED_TEMPORARILY);
        expect(response.headers.has('Location')).toBeTruthy();
      });
    }
  );
});
