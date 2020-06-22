import absoluteUrl from 'next-absolute-url';
import { RequestHandler } from 'next-connect';

import { ExternalProvider } from '../../../client/context/AuthContext/AuthContext';
import {
  ENABLED_PROVIDER,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} from '../../../constants';
import {
  FOUND_MOVED_TEMPORARILY,
  INTERNAL_SERVER_ERROR,
} from '../../../utils/statusCodes';
import { encryptSession, setSessionCookie } from '../cookie';

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

const config: Config = {
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

export const externalProviderHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const [provider] = req.query.authRouter as ExternalProvider[];

  if (ENABLED_PROVIDER.includes(provider)) {
    // initial request
    const { origin } = absoluteUrl(req);

    const {
      authorizationUrl,
      tokenUrl,
      client_secret,
      client_id,
      scope,
      profileDataUrl,
    } = config[provider];
    const redirect_uri = origin + '/api/v1/auth/' + provider;

    if (Object.keys(req.query).length === 1) {
      const params = new URLSearchParams({
        client_id,
        redirect_uri,
        response_type: 'code',
        scope: scope.join(' '),
      }).toString();

      const url = [authorizationUrl, params].join('?');

      res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', url);

      return res.end();
    }

    // redirect
    const { code, error, prompt } = req.query as { [key: string]: string };

    if (!code || Array.isArray(code) || error) {
      return res.status(INTERNAL_SERVER_ERROR).end();
    }

    const params = new URLSearchParams({
      client_id,
      client_secret,
      code,
      grant_type: 'authorization_code',
      prompt,
      redirect_uri,
    }).toString();

    const response = await fetch(tokenUrl, {
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const { access_token, token_type }: OAuth2Response = await response.json();

    const profileParams = new URLSearchParams({
      access_token,
    });

    const profileUrl = [profileDataUrl, profileParams].join('?');

    const profileResponse = await fetch(profileUrl, {
      headers: {
        authorization: [token_type, access_token].join(' '),
      },
      method: 'GET',
    });

    const profileJson = await profileResponse.json();
    const token = await encryptSession(profileJson);

    setSessionCookie(token, res);

    res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', origin);

    return res.end();
  }

  next();
};

interface OAuth2Response {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export default externalProviderHandler;
