import type { ExternalProvider } from '../../../karma/client/context/AuthContext/AuthContext';
import {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '../../../src/constants';

type Config = {
  [key in ExternalProvider]: {
    authorizationUrl: string;
    tokenUrl: string;
    client_id: string;
    client_secret: string;
    scope: string[];
    profileDataUrl: string;
  };
};

export const config: Config = {
  discord: {
    authorizationUrl: 'https://discord.com/api/oauth2/authorize',
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    profileDataUrl: 'https://discord.com/api/users/@me',
    scope: ['identify', 'email'],
    tokenUrl: 'https://discord.com/api/oauth2/token',
  },
  facebook: {
    authorizationUrl: 'https://www.facebook.com/v7.0/dialog/oauth',
    client_id: FACEBOOK_CLIENT_ID,
    client_secret: FACEBOOK_CLIENT_SECRET,
    profileDataUrl: 'https://graph.facebook.com/v7.0/me',
    scope: [],
    tokenUrl: 'https://graph.facebook.com/v7.0/oauth/access_token',
  },
  github: {
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    profileDataUrl: 'https://api.github.com/user',
    scope: ['user'],
    tokenUrl: 'https://github.com/login/oauth/access_token',
  },
  google: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    profileDataUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['openid', 'profile', 'email'],
    tokenUrl: 'https://www.googleapis.com/oauth2/v4/token',
  },
};

export const getRedirectUrl = (
  url: string,
  redirect_uri: string,
  provider: ExternalProvider
): string => {
  const { scope, client_id } = config[provider];

  const params = new URLSearchParams({
    client_id,
    redirect_uri,
    response_type: 'code',
    scope: scope.join(' '),
  }).toString();

  return [url, params].join('?');
};

interface RequiredOAuthParams {
  code: string;
  redirect_uri: string;
  provider: ExternalProvider;
  prompt?: string;
}

export const getOAuthData = async (
  url: string,

  { code, prompt, redirect_uri, provider }: RequiredOAuthParams
): Promise<OAuth2Response> => {
  const { client_id, client_secret } = config[provider];

  const tokenParams = Object.fromEntries(
    Object.entries({
      client_id,
      client_secret,
      code,
      grant_type: provider !== 'github' && 'authorization_code',
      prompt, // only used by google
      redirect_uri,
    }).filter(([_, value]) => !!value)
  ) as Record<string, string>;

  const params = new URLSearchParams(tokenParams).toString();

  const response = await fetch(url, {
    body: params,
    headers: {
      Accept: 'application/json', // required for github to return json
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });

  return response.json();
};

export const getProfileData = async (
  url: string,
  provider: ExternalProvider,
  { access_token, token_type }: OAuth2Response
): Promise<Record<string, unknown>> => {
  const profileParams = new URLSearchParams({
    access_token,
  });

  const profileUrl = [url, profileParams].join('?');
  const authorization = [
    provider === 'github' ? 'token' : token_type,
    access_token,
  ].join(' ');

  const response = await fetch(profileUrl, {
    headers: {
      authorization,
    },
    method: 'GET',
  });

  return response.json();
};

interface OAuth2Response {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
